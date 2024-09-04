import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {CreateLeaveComponent} from "./leaves/create-leave/create-leave.component";

export const routes: Routes = [
  {
    path: '', component: WelcomeComponent
  },
  {
    path: 'leaves/create', component: CreateLeaveComponent
  }
];
