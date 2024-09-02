import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {UnauthorizedComponent} from "./authorization/unauthorized/unauthorized.component";
import {hasRoleGuard} from "./authorization/has-role.guard";
import {Role} from "./authorization/role";

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
