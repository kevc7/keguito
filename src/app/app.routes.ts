import { Routes } from '@angular/router';
import { JunioComponent } from './junio/junio.component';
import { MarzoComponent } from './marzo/marzo.component';
import { HomeComponent } from './home/home.component';
import { MayoComponent } from './mayo/mayo.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'junio', component: JunioComponent },
    { path: 'marzo', component: MarzoComponent },
    { path: 'mayo', component: MayoComponent },
    { path: '**', redirectTo: '/home' }
];
