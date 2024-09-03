import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {Role} from "../authorization/role";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserObservable} from "../authorization/observable/user-observable";

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

  public users:User[] = [
    {
      id: 1,
      firstName: "HR",
      lastName: "Admin",
      role: Role.HR_ADMIN
    },
    {
      id: 2,
      firstName: "Man",
      lastName: "Ager",
      role: Role.MANAGER
    },
    {
      id: 3,
      firstName: "Em",
      lastName: "Ployee",
      role: Role.EMPLOYEE
    },
  ]

  public selectedUser = new FormControl<User|null>(null);

  constructor(
    private userObservable:UserObservable,
  ) {}

  ngOnInit() {
  }

  public handleChangeUser(){
  }
}
