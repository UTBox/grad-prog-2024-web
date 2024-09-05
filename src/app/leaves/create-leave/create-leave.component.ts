import { AlertService } from './../../shared/alert.service';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import LeaveService from "../data/leave.service";
import {ButtonComponent} from "../../shared/button/button.component";
import {ButtonStyle} from "../../shared/button/button-style";
import {NgIf} from "@angular/common";
import {debounceTime} from "rxjs";

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
export class CreateLeaveComponent implements OnInit {
  public totalLeaveDays = 0;

  public createLeaveForm: FormGroup;

  constructor(
    private router: Router,
    private leaveService: LeaveService,
    private alertService: AlertService
  ) {
    this.createLeaveForm = new FormGroup<any>({
      employeeId: new FormControl(0),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null,[Validators.required]),
      reason: new FormControl('', [Validators.required])
    })
  }

  async ngOnInit() {
    this.createLeaveForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.isDateFormInputsValidated()) {
          this.calculateLeaveWorkDays();
        }
    });
  }

  onSubmit() {
    this.createLeaveForm.markAllAsTouched();

    if (this.createLeaveForm.valid) {
      this.createLeave();
    } else {
      console.log('Invalid form.')
    }
  }

  public isFormInvalid(): boolean {
    return (this.isInvalidLeaveDates() || this.createLeaveForm.invalid);
  }

  public isInvalidFormInput(controlName: string): boolean {
    const control = this.createLeaveForm.get(controlName);

    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }

  public isInvalidLeaveDates(): boolean {
    const startDate = new Date(this.createLeaveForm.value.startDate);
    const endDate = new Date(this.createLeaveForm.value.endDate);
    const currentDate = new Date();
    const isDateInputsPristine =
      this.createLeaveForm.get('startDate')?.pristine && this.createLeaveForm.get('endDate')?.pristine

    if (isDateInputsPristine) {
      return false;
    }
    if (this.totalLeaveDays === 0) {
      return true;
    }
    if (startDate === null || endDate === null) {
      return true;
    }
    if (startDate > endDate) {
      return true;
    }

    return startDate < currentDate;
  }

  private createLeave() {
    this.createLeaveForm.patchValue({
      employeeId: sessionStorage.getItem("userId")
    })

    const leaveRequest = this.createLeaveForm.value;

    this.leaveService.createLeave(leaveRequest)
      .subscribe({
        next: () => {
          console.log('success');
          this.router.navigate(['leaves/my']);
          this.alertService.showSuccess("Successfully applied for leave!")
        }, error: response => {
          console.log(response.error.errorCode);
          console.log(response.error.errorMessage);
          this.alertService.showError(response.error.errorCode, response.error.errorMessage)
        }
      })
  }

  private isDateFormInputsValidated(): boolean {
    const startDateValid = this.createLeaveForm.get('startDate')?.valid ?? false;
    const endDateValid = this.createLeaveForm.get('endDate')?.valid ?? false;

    return startDateValid && endDateValid;
  }

  private calculateLeaveWorkDays() {
    const startDate = new Date(this.createLeaveForm.value.startDate);
    const endDate = new Date(this.createLeaveForm.value.endDate);

    let leaveWorkDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        leaveWorkDays++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.totalLeaveDays = leaveWorkDays;
  }

  protected readonly ButtonStyle = ButtonStyle;
}
