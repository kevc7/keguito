import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mayo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mayo.component.html',
  styleUrl: './mayo.component.css'
})
export class MayoComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  private hasPlayed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId) && !this.hasPlayed) {
      const audio = this.audioPlayer.nativeElement;
      audio.volume = 0.3;
      audio.play();
      this.hasPlayed = true;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.pause();
    }
  }
}
