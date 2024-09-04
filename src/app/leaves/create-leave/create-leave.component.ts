import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import LeaveService from "../data/leave.service";
import {ButtonComponent} from "../../shared/button/button.component";
import {ButtonStyle} from "../../shared/button/button-style";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-create-leave',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './create-leave.component.html',
  styleUrl: './create-leave.component.css'
})
export class CreateLeaveComponent {
  public totalLeaveDays = 0;

  public createLeaveForm: FormGroup;

  constructor(
    private leaveService: LeaveService
  ) {
    this.createLeaveForm = new FormGroup<any>({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null,[Validators.required]),
      reason: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.createLeaveForm.markAsTouched();

    if (this.createLeaveForm.valid) {
      this.createLeave();
    } else {
      console.log('Cannot submit invalid form.')
    }
    console.log('Submit type button click.')
    // this.router.navigate(['']);
  }

  public createLeave() {
    const leaveApplication = this.createLeaveForm.value;

    this.leaveService.createLeave(leaveApplication)
      .subscribe({
        next: () => {
          console.log('success');
        }, error: err => {
          console.log(err);
        }
      })
  }

  isInvalidFormInput(controlName: string): boolean {
    const control = this.createLeaveForm.get(controlName);

    return control ? (control.invalid && control.touched) : false;
  }

  protected readonly ButtonStyle = ButtonStyle;
}
