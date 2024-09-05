import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { ButtonStyle } from '../../shared/button/button-style';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import EmployeesService from '../data/employees.service';
import { lastValueFrom } from 'rxjs';
import { IEmployee } from '../model/employee.model';
import { AlertService } from '../../shared/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css',
})
export class EditEmployeeComponent implements OnInit {
  protected readonly ButtonStyle = ButtonStyle;
  editEmployeeForm: FormGroup;
  managerName: string = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeesService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.editEmployeeForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      role: new FormControl('', [Validators.required]),
      managerId: new FormControl('', [Validators.required]),
      totalLeaves: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[1-9][0-9]*$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.disableFormControlsExceptTotalLeaves();
    this.loadEmployee();
  }

  onSubmit() {
    if (this.editEmployeeForm.valid) {
      const updatedEmployee = this.editEmployeeForm.value;
      this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next: () => {
          this.router.navigate(['/employees/all'], {
            queryParams: { page: 1 },
          });
          this.alertService.showSuccess("Successfully updated total leaves!");
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.editEmployeeForm.get(controlName)?.invalid &&
      (this.editEmployeeForm.get(controlName)?.dirty ||
        this.editEmployeeForm.get(controlName)?.touched)
    );
  }

  private async loadEmployee() {
    const employeeId = this.route.snapshot.paramMap.get('employeeId');
    const employee: IEmployee = await lastValueFrom(
      this.employeeService.getEmployee(employeeId)
    );
    this.managerName = employee.manager
      ? `${employee.manager.firstName} ${employee.manager.lastName}`
      : '';
    this.editEmployeeForm.patchValue({
      ...employee,
      managerId: employee.manager ? employee.manager.id : null
    });
  }

  private disableFormControlsExceptTotalLeaves(): void {
    this.editEmployeeForm.get('firstName')?.disable();
    this.editEmployeeForm.get('lastName')?.disable();
    this.editEmployeeForm.get('role')?.disable();
    this.editEmployeeForm.get('managerId')?.disable();
  }
}
