import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {Role} from "../authorization/role";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserObservable} from "../authorization/observable/user-observable";
import EmployeeService from "../employees/data/employee.service";
import {lastValueFrom} from "rxjs";
import {compareSegments} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker";

interface User{
  id:number
  firstName:string
  lastName:string
  role:Role
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  public defaultUser:User = {
      id: 0,
      firstName: "",
      lastName: "",
      role: Role.NONE
    }

  public users!:User[]

  public selectedUser = new FormControl<User>(this.defaultUser);

  constructor(
    private userObservable:UserObservable,
    private employeeService:EmployeeService
  ) {}

  ngOnInit() {
    this.initializePage()
  }

  public handleChangeUser(){
    sessionStorage.setItem('selectedUserRole', this.selectedUser.getRawValue()?.role.toString() ?? "")
    sessionStorage.setItem('userId', this.selectedUser.getRawValue()?.id.toString() ?? "")

    console.log(sessionStorage.getItem('selectedUserRole'))
    // window.location.reload();
  }

  private async initializePage(){
    await this.initializeUserList()
    this.initializeSelectedUser()
  }

  private async initializeUserList(){
    const userListResponse = await lastValueFrom(this.employeeService.getEmployeeList(null))
    this.users = JSON.parse(sessionStorage.getItem('users') ?? "[]")

    if(userListResponse != this.users){
      this.users = userListResponse
      sessionStorage.setItem('users', JSON.stringify(this.users))
    }
  }

  private initializeSelectedUser(){
    let storedUserId = sessionStorage.getItem("userId")
    let storedRole = sessionStorage.getItem("selectedUserRole")
    let storedUser = this.users.find(u => u.id === Number(storedUserId))

    this.selectedUser.setValue(storedUser ?? this.defaultUser)
  }
}
