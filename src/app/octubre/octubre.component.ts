import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-octubre',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './octubre.component.html',
  styleUrl: './octubre.component.css'
})
export class OctubreComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('pageContainer') pageContainer!: ElementRef<HTMLElement>;
  @ViewChild('spectrogramCanvas') spectrogramCanvas?: ElementRef<HTMLCanvasElement>;

  isMusicPlaying = false;
  private hasAutoplayed = false;
  private audioCtx?: AudioContext;
  private analyser?: AnalyserNode;
  private sourceNode?: MediaElementAudioSourceNode;
  private animationFrameId?: number;
  private isAnalyserSetup = false;
  private freqBuffer?: Uint8Array;

  // Persistent bar height array for smooth attack & decay physics on top border
  private barHeightsTop: number[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startRenderLoop();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (isPlatformBrowser(this.platformId) && !this.hasAutoplayed) {
      this.playMusic();
      this.hasAutoplayed = true;
    }
  }

  toggleMusic(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!isPlatformBrowser(this.platformId) || !this.audioPlayer?.nativeElement) return;

    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  private setupAudioAnalyser(): void {
    if (!isPlatformBrowser(this.platformId) || this.isAnalyserSetup || !this.audioPlayer?.nativeElement) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      const audio = this.audioPlayer.nativeElement;
      this.sourceNode = this.audioCtx.createMediaElementSource(audio);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512; // 256 frequency bins, ideal for high dynamic range piano visualization
      this.analyser.smoothingTimeConstant = 0.82; // Built-in temporal smoothing

      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      this.freqBuffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.isAnalyserSetup = true;
    } catch (e) {
      console.warn('AudioAnalyser initialization notice:', e);
    }
  }

  private playMusic(): void {
    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;
    audio.volume = 0.5;

    this.setupAudioAnalyser();

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    audio.play().then(() => {
      this.isMusicPlaying = true;
    }).catch(() => {
      // Audio autoplay policy might require user interaction
    });
  }

  private pauseMusic(): void {
    if (!this.audioPlayer?.nativeElement) return;
    this.audioPlayer.nativeElement.pause();
    this.isMusicPlaying = false;
  }

  private startRenderLoop(): void {
    if (!isPlatformBrowser(this.platformId) || this.animationFrameId) return;

    const update = (timestamp: number) => {
      let bassNorm = 0;
      let volNorm = 0;

      // Extract frequency data if playing
      if (this.isMusicPlaying && this.analyser && this.freqBuffer) {
        this.analyser.getByteFrequencyData(this.freqBuffer);

        const bufferLength = this.freqBuffer.length;
        // Low frequency range (bass/chords)
        let bassSum = 0;
        const bassCount = Math.min(10, bufferLength);
        for (let i = 1; i < bassCount; i++) {
          bassSum += this.freqBuffer[i];
        }
        const bassAvg = bassCount > 1 ? bassSum / (bassCount - 1) : 0;

        // Overall volume
        let totalSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalSum += this.freqBuffer[i];
        }
        const totalAvg = totalSum / bufferLength;

        // Normalized values [0..1]
        bassNorm = Math.min(1, Math.max(0, bassAvg / 85));
        volNorm = Math.min(1, Math.max(0, totalAvg / 75));
      }

      // Update ambient reactive properties on page container
      if (this.pageContainer?.nativeElement) {
        const el = this.pageContainer.nativeElement;
        el.style.setProperty('--audio-bass', bassNorm.toFixed(3));
        el.style.setProperty('--audio-vol', volNorm.toFixed(3));
        el.style.setProperty('--audio-scale', (1 + bassNorm * 0.06).toFixed(3));
        el.style.setProperty('--audio-disc-scale', (1 + bassNorm * 0.16).toFixed(3));
        el.style.setProperty('--audio-glow', `${(bassNorm * 70).toFixed(1)}px`);
        el.style.setProperty('--audio-wave-scale', (1 + volNorm * 1.4).toFixed(3));
      }

      // Render the audio visualizer spectrum on canvas
      this.drawSpectrogram(timestamp, bassNorm);

      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  private drawSpectrogram(timestamp: number, bassNorm: number): void {
    if (!this.spectrogramCanvas?.nativeElement) return;
    const canvas = this.spectrogramCanvas.nativeElement;

    const dpr = window.devicePixelRatio || 1;
    const displayW = Math.floor(canvas.clientWidth);
    const displayH = Math.floor(canvas.clientHeight);

    if (displayW <= 0 || displayH <= 0) return;

    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, displayW, displayH);

    const isMobile = displayW < 640;
    const padX = isMobile ? 20 : 65;
    const padY = isMobile ? 45 : 65;
    const cardW = Math.max(10, displayW - 2 * padX);
    const cardH = Math.max(10, displayH - 2 * padY);

    // Baseline tracks offset around the card
    const offset = isMobile ? 10 : 26;
    const cornerMargin = isMobile ? 24 : 46;
    const pitch = isMobile ? 6.5 : 8.0;
    const maxBarH = isMobile ? 15 : 28;

    const leftX = padX - offset;
    const rightX = padX + cardW + offset;
    const topY = padY - offset;

    // 1. Draw Subtle Top Baseline with Corner Brackets
    ctx.beginPath();
    // Top baseline segment
    ctx.moveTo(leftX + cornerMargin, topY);
    ctx.lineTo(rightX - cornerMargin, topY);

    // Top-left and Top-right corner brackets
    ctx.moveTo(leftX + cornerMargin, topY);
    ctx.lineTo(leftX, topY);
    ctx.lineTo(leftX, topY + cornerMargin);

    ctx.moveTo(rightX - cornerMargin, topY);
    ctx.lineTo(rightX, topY);
    ctx.lineTo(rightX, topY + cornerMargin);

    ctx.strokeStyle = `rgba(148, 163, 184, ${0.35 + bassNorm * 0.35})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Calculate bars along the top edge
    const topSpan = Math.max(0, (rightX - cornerMargin) - (leftX + cornerMargin));
    const numBarsH = Math.max(1, Math.floor(topSpan / pitch));

    // Update physical bar heights for top edge
    this.barHeightsTop = this.updateEdgeHeights(
      this.barHeightsTop, numBarsH, this.freqBuffer || null, timestamp, maxBarH, isMobile
    );

    // 3. Draw Symmetrical Mirrored Spectrum Bars (Exclusively Top Edge)
    this.drawSpectrumEdge(
      ctx, leftX + cornerMargin, topY, rightX - cornerMargin, topY,
      this.barHeightsTop, pitch
    );

    ctx.restore();
  }

  private updateEdgeHeights(
    currentHeights: number[],
    numBars: number,
    freqData: Uint8Array | null,
    timestamp: number,
    maxBarH: number,
    isMobile: boolean
  ): number[] {
    if (currentHeights.length !== numBars) {
      const resized = new Array(numBars).fill(2);
      for (let i = 0; i < Math.min(currentHeights.length, numBars); i++) {
        resized[i] = currentHeights[i];
      }
      currentHeights = resized;
    }

    const hasAudio = !!(freqData && freqData.length > 0 && this.isMusicPlaying);
    const time = timestamp * 0.003;
    const binCount = freqData ? freqData.length : 0;
    const maxActiveBin = Math.min(95, binCount - 1);

    for (let i = 0; i < numBars; i++) {
      const p = i / Math.max(1, numBars - 1);
      const sym = 1 - Math.abs(p - 0.5) * 2; // 0..1..0 bell envelope

      // Gentle ambient breathing wave so it is never stiff even during quiet passages
      const idleWave = Math.sin(time * 1.3 + i * 0.28) * 1.1 +
                       Math.cos(time * 0.8 - i * 0.16) * 0.6;
      const baseIdleH = (isMobile ? 1.5 : 2.0) + Math.max(0, idleWave);

      let audioEnergy = 0;
      if (hasAudio && freqData) {
        // Map bar to frequency bin with perceptual curve
        const freqP = 0.35 * sym + 0.65 * Math.pow(p, 1.4);
        const targetBin = Math.floor(1 + freqP * maxActiveBin);
        const safeBin = Math.max(1, Math.min(maxActiveBin, targetBin));

        const raw = freqData[safeBin] / 255.0;
        const prev = freqData[Math.max(1, safeBin - 1)] / 255.0;
        const next = freqData[Math.min(maxActiveBin, safeBin + 1)] / 255.0;
        const smoothVal = raw * 0.45 + (prev + next) * 0.275;

        // Distinct transient spikes on specific harmonic bars (mimicking the sudden spikes in the video)
        const isHarmonicSpike = (i % 7 === 0) || (i % 11 === 0);
        const spikeMultiplier = isHarmonicSpike ? 1.5 : (i % 2 === 0 ? 1.05 : 0.82);

        // Warm piano fundamental bass energy
        const bassVal = (freqData[1] + freqData[2] + freqData[3]) / (3 * 255.0);

        // Combined audio energy with high dynamic contrast (quiet valleys vs tall peaks)
        const envelope = Math.pow(smoothVal, 1.25);
        audioEnergy = (envelope * 0.75 + raw * 0.25) * spikeMultiplier;
        audioEnergy += bassVal * 0.12 * sym;
      }

      // Smooth taper within 7 bars of corners
      const distFromCorner = Math.min(i, numBars - 1 - i);
      const taper = Math.min(1, distFromCorner / 7);

      // Target height: valleys around 3-6px, peaks reaching 20-28px
      const targetH = (baseIdleH + audioEnergy * maxBarH * (hasAudio ? 1.15 : 0)) * taper;

      // Snappy attack & fluid damped decay physics
      if (targetH > currentHeights[i]) {
        // Fast attack: jump up on notes
        currentHeights[i] = currentHeights[i] * 0.35 + targetH * 0.65;
      } else {
        // Smooth decay: glide down fluidly
        const decayRate = hasAudio ? 0.86 : 0.92;
        currentHeights[i] = Math.max(baseIdleH * taper, currentHeights[i] * decayRate - 0.25);
      }
    }

    return currentHeights;
  }

  private drawSpectrumEdge(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    heights: number[],
    pitch: number
  ): void {
    ctx.save();
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';

    const normalPath = new Path2D();
    const peakPath = new Path2D();

    for (let i = 0; i < heights.length; i++) {
      const h = Math.max(1, heights[i]);
      const isPeak = h > 13;

      const barX = startX + i * pitch;
      const barY = startY;
      const y1 = barY - h;
      const y2 = barY + h;

      if (isPeak) {
        peakPath.moveTo(barX, y1);
        peakPath.lineTo(barX, y2);
      } else {
        normalPath.moveTo(barX, y1);
        normalPath.lineTo(barX, y2);
      }
    }

    // Normal bars (platinum white with delicate glow)
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.shadowColor = 'rgba(203, 213, 225, 0.45)';
    ctx.shadowBlur = 4;
    ctx.stroke(normalPath);

    // Peak bars (pure brilliant white with elevated moonlight bloom)
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 8;
    ctx.stroke(peakPath);

    ctx.restore();
  }

  scrollToLetter(): void {
    if (isPlatformBrowser(this.platformId)) {
      const letterElement = document.getElementById('letter-section');
      if (letterElement) {
        letterElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (isPlatformBrowser(this.platformId)) {
      if (this.audioPlayer?.nativeElement) {
        this.audioPlayer.nativeElement.pause();
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.audioCtx.close().catch(() => {});
      }
    }
  }
}
