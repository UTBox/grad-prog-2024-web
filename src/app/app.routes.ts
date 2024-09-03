import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {AllLeavesComponent} from "./leaves/all-leaves/all-leaves.component";

export const routes: Routes = [
  {path: "leaves", children: [
      {path: "", component: AllLeavesComponent}
    ]},
  {path: "**", redirectTo: "", component: WelcomeComponent}
];
