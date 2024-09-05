import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {Role} from "../authorization/role";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserObservable} from "../authorization/observable/user-observable";
import EmployeesService from "../employees/data/employees.service";
import {lastValueFrom} from "rxjs";
import User from "../authorization/user.model";
import {NgSelectModule} from "@ng-select/ng-select";

interface Page{
  label:string
  allowedRoles: Role[]
  link: string
}
interface PageGroup{
  label: string
  pages: Page[]
  allowedRoles: Role[]
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgSelectModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  public defaultUser:User = {
      id: 0,
      name: "",
      role: Role.NONE
    }
  public users!:User[]

  public pages:PageGroup[] = [
    {
      label: "Employees",
      pages: [
        {label: "View all", allowedRoles: [Role.HR_ADMIN], link: "employees/all"},
        {label: "Add new", allowedRoles: [Role.HR_ADMIN], link: "employees/new"},
      ],
      allowedRoles: [Role.HR_ADMIN]
    },
    {
      label: "Leaves",
      pages: [
        {label: "Apply", allowedRoles: [Role.MANAGER, Role.EMPLOYEE], link: "leaves/create"},
        {label: "My Leaves", allowedRoles: [Role.MANAGER, Role.EMPLOYEE], link: "leaves/my"},
        {label: "View All", allowedRoles: [Role.MANAGER, Role.HR_ADMIN], link: "leaves/all"},
      ],
      allowedRoles: [Role.MANAGER, Role.HR_ADMIN, Role.EMPLOYEE]
    }
  ]

  public selectedUser!:User

  public storedRole!:Role

  constructor(
    private userObservable:UserObservable,
    private employeesService:EmployeesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializePage()
  }

  public handleChangeUser(){
    console.log(this.selectedUser)
    sessionStorage.setItem('selectedUserRole', this.selectedUser?.role.toString() ?? "")
    sessionStorage.setItem('userId', this.selectedUser?.id.toString() ?? "")

    console.log(sessionStorage.getItem('selectedUserRole'))
    this.router.navigate(['/welcome']).then(() => {
      window.location.reload();
    });
  }

  private async initializePage(){
    await this.initializeUserList()
    this.initializeSelectedUser()
  }

  private async initializeUserList(){
    const userListResponse = await lastValueFrom(this.employeesService.getEmployeeList(null))
    this.users = JSON.parse(sessionStorage.getItem('users') ?? "[]")

    if(userListResponse != this.users){
      this.users = userListResponse
      sessionStorage.setItem('users', JSON.stringify(this.users))
    }
  }

  private initializeSelectedUser(){
    let storedUserId = sessionStorage.getItem("userId")
    this.storedRole = <Role> sessionStorage.getItem("selectedUserRole")
    let storedUser = this.users.find(u => u.id === Number(storedUserId))

    this.selectedUser = storedUser ?? this.defaultUser
  }
}
