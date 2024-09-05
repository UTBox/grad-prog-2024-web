import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {Role} from "../authorization/role";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserObservable} from "../authorization/observable/user-observable";
import EmployeesService from "../employees/data/employees.service";
import {debounceTime, lastValueFrom, Subject} from "rxjs";
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
  usersInput$ = new Subject<string>();

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
  public selectedUserRole!:Role


  constructor(
    private userObservable:UserObservable,
    private employeesService:EmployeesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializePage()
    this.loadUsersOptions()
  }

  public handleChangeUser(){
    sessionStorage.setItem('selectedUser', JSON.stringify(this.selectedUser))
    this.router.navigate(['/welcome']).then(() => {
      window.location.reload();
    });
  }

  private async initializePage(){
    await this.initializeUserList("")
    this.initializeSelectedUser()
  }

  loadUsersOptions(){
    this.usersInput$
      .pipe(debounceTime(400))
      .subscribe(name => {
        this.initializeUserList(name)
      })
  }

  public async initializeUserList(name: string){
    const userListResponse = await lastValueFrom(this.employeesService.getEmployeeList(name))

    if(userListResponse != this.users){
      this.users = userListResponse
    }

    if( name == "" && this.selectedUser && this.users.findIndex(u => u.id == this.selectedUser.id) == -1){
      this.users.push(this.selectedUser)
    }
  }

  private initializeSelectedUser(){
    let storedUser:User = JSON.parse(sessionStorage.getItem('selectedUser')??"{}")

    if(Object.keys(storedUser).length == 0){
      this.selectedUser = this.defaultUser
      this.selectedUserRole = storedUser.role
      return
    }

    let userInUserList = this.users.find(u => u.id==storedUser.id)

    if(!userInUserList){
      this.users.push(storedUser)
      userInUserList = this.users.at(-1)
    }

    this.selectedUser = userInUserList ?? this.defaultUser
    this.selectedUserRole = storedUser.role
  }
}
