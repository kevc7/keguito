import { Routes } from '@angular/router';
import { JunioComponent } from './junio/junio.component';
import { MarzoComponent } from './marzo/marzo.component';
import { HomeComponent } from './home/home.component';
import { MayoComponent } from './mayo/mayo.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
    { path: 'junio', component: JunioComponent, data: { animation: 'JunioPage' } },
    { path: 'marzo', component: MarzoComponent, data: { animation: 'MarzoPage' } },
    { path: 'mayo', component: MayoComponent, data: { animation: 'MayoPage' } },
    { path: '**', redirectTo: '/home' }
];
