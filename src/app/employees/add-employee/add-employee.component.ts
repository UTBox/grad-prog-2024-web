import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import IManager from '../model/manager.model';
import { lastValueFrom } from 'rxjs';
import { EmployeeRole } from '../model/employee-role';
import { ButtonStyle } from '../../shared/button/button-style';
import EmployeesService from '../data/employees.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  protected readonly ButtonStyle = ButtonStyle;
  addEmployeeForm: FormGroup;
  managers: IManager[] = [];
  roles = Object.values(EmployeeRole);

  constructor(
    private router: Router,
    private employeeService: EmployeesService
  ) {
    this.addEmployeeForm = new FormGroup<any>({
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
    this.loadManagers();
  }

  onSubmit() {
    this.addEmployeeForm.markAllAsTouched();

    if (this.addEmployeeForm.valid) {
      const employee = this.addEmployeeForm.getRawValue();
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          this.router.navigate(['employees/all'], { queryParams: { page: 1 } });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  isFormControlInvalid(controlName: string): boolean | undefined {
    return (
      this.addEmployeeForm.get(controlName)?.invalid &&
      (this.addEmployeeForm.get(controlName)?.dirty ||
        this.addEmployeeForm.get(controlName)?.touched)
    );
  }

  private async loadManagers() {
    this.managers = await lastValueFrom(this.employeeService.getListManagers());
  }
}
