import { EditEmployeeComponent } from './employees/edit-employee/edit-employee.component';
import { Routes } from '@angular/router';
import {WelcomeComponent} from "./welcome/welcome.component";
import {UnauthorizedComponent} from "./authorization/unauthorized/unauthorized.component";
import {hasRoleGuard} from "./authorization/has-role.guard";
import {Role} from "./authorization/role";
import {AllLeavesComponent} from "./leaves/all-leaves/all-leaves.component";
import {AllEmployeesComponent} from "./employees/all-employees/all-employees.component";
import { AddEmployeeComponent } from './employees/add-employee/add-employee.component';
import {MyLeavesComponent} from "./leaves/my-leaves/my-leaves.component";
import {CreateLeaveComponent} from "./leaves/create-leave/create-leave.component";

export const routes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '', redirectTo: 'welcome', pathMatch: 'full'},
  {
    path: "welcome",
    component: WelcomeComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE]
    }
  },
  {path: "leaves", children: [
      {
        path: "all",
        component: AllLeavesComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.HR_ADMIN, Role.MANAGER]}
      },
      {
        path: "my",
        component: MyLeavesComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.EMPLOYEE, Role.MANAGER]}
      },
      {
        path: "create",
        component: CreateLeaveComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.EMPLOYEE, Role.MANAGER]}
      }
  ]},
  {path: "employees", children: [
      {
        path: "all",
        component: AllEmployeesComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.HR_ADMIN]}
      },
      {path: "new",
        component: AddEmployeeComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.HR_ADMIN]}
      },
      {path: "edit/:employeeId",
        component: EditEmployeeComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [Role.HR_ADMIN]}
      }
  ]}
];
