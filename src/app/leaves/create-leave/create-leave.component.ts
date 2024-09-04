import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import LeaveService from "../data/leave.service";
import {ButtonComponent} from "../../shared/button/button.component";
import {ButtonType} from "../../shared/button/button-type";

@Component({
  selector: 'app-create-leave',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './create-leave.component.html',
  styleUrl: './create-leave.component.css'
})
export class CreateLeaveComponent {

  public createLeaveForm: FormGroup;

  constructor(
    private router: Router,
    private leaveService: LeaveService
  ) {
    this.createLeaveForm = new FormGroup<any>({
      startDate: new FormControl(),
      endDate: new FormControl(),
      reason: new FormControl()
    })
  }

  onSubmit() {
    console.log('Submit type button click.')
    // this.router.navigate(['']);
  }

  onBackClick() {
    console.log('Back button click.')
    this.router.navigateByUrl('');
  }

  public createLeave() {
    const leaveApplication = this.createLeaveForm.value;

    this.leaveService.createLeave(leaveApplication)
      .subscribe({ next: data => {
          console.log('success');
        }, error: err => {
          console.log(err);
        }
      })
  }

  protected readonly ButtonType = ButtonType;
}
