// src/app/app.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="starry-background">
      <div class="container">
        <div class="letter">
          <p>Mi amor,</p>
          
          <p>Son las 7 de la mañana, un 17 de marzo, y no sé si la brisa que acaricia la ventana es el preludio de algo más, o si es el susurro tímido de tus palabras que resuenan en mi mente mientras el día apenas comienza. Me siento emocionado, como un niño que espera su regalo más preciado. En unos días te veré, y cuento los segundos como si se tratara de una eternidad. Mi mente, que a veces parece perderse entre las sombras del tiempo, solo sabe que te pertenece, que sigue el ritmo de tus pasos aunque a veces parezca callada.</p>
          
          <p>Hace ya más de un mes que no te escribo cartas, pero no creas que este silencio ha sido vacío. No es que no te piense, ni que tu imagen se haya desvanecido en mis pensamientos. Al contrario, cada rincón de mi ser te lleva dentro, como si fueras la luna en mi noche más oscura. Pensar que te pedí ser parte de tu vida, que te pedí ser tu novio, me llena de una calidez extraña, porque siento que eso es solo el principio de algo mucho más grande. Te amo tanto, que la idea de seguir trabajando en nosotros me motiva, me impulsa, me da fuerzas para ser la mejor versión de mi mismo, para que este amor, este sueño que estamos creando, siga floreciendo.</p>
          
          <p>Te amo, Kadley, con todo lo que soy. Con todo lo que sé y con todo lo que haré. Mi amor por ti no tiene límites, y cada vez que te pienso, que te imagino, que te siento cerca, me doy cuenta de que en este viaje que compartimos, no hay final, solo infinitos comienzos.</p>
          <p>remember: Por favor, esté o no esté a tu lado nunca dejes de creer en tus capacidades y que puedes 
            lograr todo lo que te propongas, eres un niña muy capaz y 
            siempre creeré en ti, le ruego al universo por que me permita 
            estar mucho tiempo a tu lado para seguirte viendo crecer y ponerme 
            feliz a tu lado por cada uno de tus logros cumplidos.</p>
            
            <p>-kevin</p>
        </div>

        <div class="slider-container">
          <div class="slider" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
            <div *ngFor="let image of images" class="slide">
              <img [src]="image" alt="Imagen de amor">
            </div>
          </div>
          <div class="slider-controls">
            <button (click)="prevSlide()" class="slider-button">❮</button>
            <button (click)="nextSlide()" class="slider-button">❯</button>
          </div>
          <div class="slider-dots">
            <span *ngFor="let image of images; let i = index" 
                  [class.active]="i === currentSlide"
                  (click)="goToSlide(i)"></span>
          </div>
        </div>
        
        <div class="music-controls">
          <div class="song-controls" *ngIf="isPlaying">
            <button class="song-nav-button" (click)="prevSong()">
              ◄◄
            </button>
            <span class="song-indicator">Canción {{ currentSongIndex + 1 }}</span>
            <button class="song-nav-button" (click)="nextSong()">
              ►►
            </button>
          </div>

          <button class="play-button" (click)="toggleMusic()" [class.playing]="isPlaying">
            <span *ngIf="!isPlaying">♥ Play ♥</span>
            <span *ngIf="isPlaying">♥ Pause ♥</span>
          </button>
          
          <div class="volume-control" *ngIf="isPlaying">
            <input 
              type="range" 
              min="0" 
              max="100" 
              [value]="volume" 
              (input)="adjustVolume($event)"
              class="volume-slider"
            >
            <span class="volume-label">🔊 {{ volume }}%</span>
          </div>
        </div>

        <audio #audioPlayer (ended)="onSongEnd()" preload="auto"></audio>
      </div>
    </div>
  `,
  styles: [`
    .starry-background {
      background-color: black;
      background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px);
      background-size: 50px 50px;
      background-position: 0 0, 25px 25px;
      min-height: 100vh;
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      position: relative;
      z-index: 1;
    }
    
    .letter {
      font-family: "Times New Roman", Times, serif;
      max-width: 800px;
      line-height: 1.6;
      text-align: justify;
      margin-bottom: 30px;
      padding: 30px;
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
      color: white;
      border-radius: 8px;
      backdrop-filter: blur(3px);
    }

    .slider-container {
      width: 100%;
      max-width: 800px;
      margin: 20px 0;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }

    .slider {
      display: flex;
      transition: transform 0.5s ease-in-out;
      height: 400px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .slide {
      min-width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: 10px;
    }

    .slide img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .slider-controls {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      pointer-events: none;
    }

    .slider-button {
      background: rgba(255, 255, 255, 0.3);
      border: none;
      color: white;
      padding: 15px;
      cursor: pointer;
      border-radius: 50%;
      font-size: 18px;
      transition: background 0.3s ease;
      pointer-events: auto;
    }

    .slider-button:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    .slider-dots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
    }

    .slider-dots span {
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .slider-dots span.active {
      background: white;
    }
    
    .music-controls {
      position: fixed;
      top: 20px;
      left: 20px;
      transform: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 12px;
      border-radius: 15px;
      backdrop-filter: blur(5px);
      min-width: 200px;
    }

    .song-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
      width: 100%;
      justify-content: space-between;
    }

    .song-nav-button {
      background-color: rgba(255, 105, 180, 0.3);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .song-nav-button:hover {
      background-color: rgba(255, 20, 147, 0.5);
      transform: scale(1.1);
    }

    .song-indicator {
      color: white;
      font-size: 13px;
      text-align: center;
    }

    .play-button {
      background-color: #FF69B4;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 8px 20px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      width: 100%;
    }
    
    .play-button:hover {
      background-color: #FF1493;
      transform: scale(1.05);
    }
    
    .play-button.playing {
      background-color: #FF1493;
    }
    
    .music-container {
      width: 1px;
      height: 1px;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      right: 0;
    }
    
    iframe {
      width: 300px;
      height: 200px;
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .volume-slider {
      -webkit-appearance: none;
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: #ffffff50;
      outline: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #FF69B4;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .volume-label {
      color: white;
      font-size: 12px;
      min-width: 45px;
    }
  `]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  isPlaying = false;
  volume = 50;
  currentSongIndex = 0;
  currentSlide = 0;

  songs = [
    'assets/songs/song1.mp3',
    'assets/songs/song2.mp3',
    'assets/songs/song3.mp3'
  ];

  images = [
    'assets/imagenes/img7.jpeg',
    'assets/imagenes/img8.jpeg',
    'assets/imagenes/img9.jpeg',
    'assets/imagenes/img1.jpeg',
    'assets/imagenes/img2.jpeg',
    'assets/imagenes/img4.jpeg',
    'assets/imagenes/img5.jpeg',
    'assets/imagenes/img6.jpeg',
    'assets/imagenes/img10.jpeg'
  ];

  ngAfterViewInit() {
    const audio = this.audioPlayer.nativeElement;
    audio.volume = this.volume / 100;
    audio.src = this.songs[this.currentSongIndex];
    audio.load();
  }

  async loadAndPlaySong() {
    const audio = this.audioPlayer.nativeElement;
    audio.src = this.songs[this.currentSongIndex];
    try {
      await audio.load();
      if (this.isPlaying) {
        await audio.play();
      }
    } catch (error) {
      console.error('Error loading or playing audio:', error);
    }
  }

  toggleMusic() {
    const audio = this.audioPlayer.nativeElement;
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        this.isPlaying = false;
      });
    } else {
      audio.pause();
    }
  }

  adjustVolume(event: any) {
    this.volume = event.target.value;
    this.audioPlayer.nativeElement.volume = this.volume / 100;
  }

  async nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    await this.loadAndPlaySong();
  }

  async prevSong() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    await this.loadAndPlaySong();
  }

  onSongEnd() {
    this.nextSong();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}