import { Routes } from '@angular/router';
import { ProfessorDetailComponent } from './components/professor-detail/professor-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ProfessorDetailComponent
  },
  {
    path: 'professors/:id', // your existing path for dynamic IDs (optional)
    component: ProfessorDetailComponent
  },
  // other routes...
];
