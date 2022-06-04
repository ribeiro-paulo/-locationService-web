import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionsComponent } from './pages/positions/positions.component';

const routes: Routes = [
  {path : '', component : PositionsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
