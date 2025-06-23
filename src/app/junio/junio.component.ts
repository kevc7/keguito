import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './junio.component.html',
  styleUrl: './junio.component.css'
})
export class JunioComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  poemLines: string[] = [
    "Las palabras que nacen de tus ojos",
    "son más dulces que cualquier canción",
    "que mi alma haya escuchado.",
    "",
    "No necesitas hablar,",
    "porque tus pupilas ya lo dicen todo:",
    "que hay ternura,",
    "que hay fuego,",
    "que hay un universo",
    "donde me quiero mudar.",
    "",
    "Con dos palabras tuyas,",
    "con un simple saludo,",
    "dejo de ser quien era",
    "para convertirme en algo mejor.",
    "",
    "Tú no lo sabes,",
    "pero cada vez que cruzas frente a mí",
    "mi mundo se paraliza y renace,",
    "como si dijera:",
    `"ahora sí vale la pena seguir adelante."`,
    "",
    "Sueño—",
    "porque no me queda",
    "nada más valiente que eso:",
    "soñar que algún día",
    "tu corazón se junte con el mío.",
    "No como un destino impuesto,",
    "sino como una elección libre y amorosa.",
    "",
    "Sueño—",
    "porque en ti descubrí",
    "que amar en silencio",
    "es también una forma de resistir al olvido.",
    "",
    "Y si se tratara de sacrificar algo,",
    "mis ojos—que tanto te buscan—",
    "los daría sin dudar.",
    "Mi vida misma,",
    "si con eso garantizo",
    "un segundo en que tu alma y la mía",
    "se abracen sin miedo.",
    "",
    "No es exageración,",
    "es certeza:",
    "certeza de un amor",
    "que brota de donde ni yo entiendo.",
    "",
    "Eres mi noche,",
    "mi amor de noche:",
    "ese que florece cuando todos callan,",
    "ese que vive sin testigos,",
    "pero que arde con más fuerza que el día.",
    "",
    "Eres mi amor eterno,",
    "ese que no necesita presente,",
    "porque está escrito",
    "en cada intento de poema,",
    "en cada respiro que pronuncio sin ti,",
    "en cada silencio lleno de ti."
  ];
  
  displayedLines: string[] = [];

  ngOnInit() {
    this.typewriterEffect();
  }

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
      }
      video.volume = 0.3;
    }, { once: true });
  }

  async typewriterEffect() {
    this.displayedLines = []; 
    for (let i = 0; i < this.poemLines.length; i++) {
      const line = this.poemLines[i];
      this.displayedLines.push('');
      for (let j = 0; j < line.length; j++) {
        this.displayedLines[i] += line[j];
        this.displayedLines = [...this.displayedLines];
        await this.delay(35);
      }
      await this.delay(150);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}