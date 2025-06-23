import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-marzo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './marzo.component.html',
  styleUrls: ['./marzo.component.css']
})
export class MarzoComponent implements AfterViewInit {
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
    'assets/imagenes/img1.jpeg',
    'assets/imagenes/img2.jpeg',
    'assets/imagenes/img3.jpeg',
    'assets/imagenes/img4.jpeg',
    'assets/imagenes/img5.jpeg',
    'assets/imagenes/img6.jpeg',
    'assets/imagenes/img7.jpeg',
    'assets/imagenes/img8.jpeg',
    'assets/imagenes/img9.jpeg',
    'assets/imagenes/img10.jpeg'
  ];

  ngAfterViewInit() {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.src = this.songs[this.currentSongIndex];
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.volume = this.volume / 100;
    }
  }

  toggleMusic() {
    if (this.audioPlayer) {
      const audio = this.audioPlayer.nativeElement;
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        audio.play().catch(e => {
            console.error("Error playing audio:", e);
            this.isPlaying = false;
        });
      } else {
        audio.pause();
      }
    }
  }

  adjustVolume(event: any) {
    this.volume = event.target.value;
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.volume = this.volume / 100;
    }
  }

  private loadAndPlaySong() {
    if (this.audioPlayer) {
      const audio = this.audioPlayer.nativeElement;
      audio.src = this.songs[this.currentSongIndex];
      audio.load();
      if (this.isPlaying) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }

  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.loadAndPlaySong();
  }

  prevSong() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.loadAndPlaySong();
  }
  
  onSongEnd() {
    this.nextSong();
  }

  // Slider controls
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
