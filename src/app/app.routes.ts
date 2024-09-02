import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {hasRoleGuard} from "./has-role.guard";
import {Role} from "./role";

export const routes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},
  {
    path: "welcome",
    component: WelcomeComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.HR_ADMIN]
    }
  }
];
