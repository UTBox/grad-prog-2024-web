import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {UnauthorizedComponent} from "./authorization/unauthorized/unauthorized.component";
import {hasRoleGuard} from "./authorization/has-role.guard";
import {Role} from "./authorization/role";
import {AllLeavesComponent} from "./leaves/all-leaves/all-leaves.component";

export const routes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},
  {
    path: "welcome",
    component: WelcomeComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.HR_ADMIN]
    }
  },
  {path: "leaves", children: [
      {
        path: "",
        component: AllLeavesComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.HR_ADMIN, Role.MANAGER]}
      }
    ]},
];
