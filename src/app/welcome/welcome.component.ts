import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import User from "../authorization/user.model";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit{
  public selectedUser!:User

  ngOnInit() {
    this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser') ?? "{}" )
  }
}
