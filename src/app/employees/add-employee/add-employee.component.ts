import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../shared/button/button.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import IManager from '../model/manager.model';
import {debounceTime, lastValueFrom, Subject,} from 'rxjs';
import {EmployeeRole} from '../model/employee-role';
import {ButtonStyle} from '../../shared/button/button-style';
import EmployeesService from '../data/employees.service';
import {NgSelectModule} from "@ng-select/ng-select";
import {AsyncPipe, NgClass} from "@angular/common";
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, RouterLink, NgSelectModule, NgClass, AsyncPipe],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  protected readonly ButtonStyle = ButtonStyle;
  addEmployeeForm: FormGroup;
  managers: IManager[] = [];
  roles = ["MANAGER","EMPLOYEE"];

  managersLoading = false;
  managersInput$ = new Subject<string>();

  constructor(
    private router: Router,
    private employeeService: EmployeesService,
    private alertService: AlertService
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
    this.loadManagers("");
    this.loadManagersOptions();
  }

  onSubmit() {
    this.addEmployeeForm.markAllAsTouched();

    if (this.addEmployeeForm.valid) {
      const employee = this.addEmployeeForm.getRawValue();
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          this.router.navigate(['employees/all'], { queryParams: { page: 1 } });
          this.alertService.showSuccess("Successfully created an employee!")
        },
        error: (err) => {
          console.log(err);
          this.alertService.showError(err.error.errorCode, err.error.errorMessage);
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

  loadManagersOptions(){
    this.managersInput$
      .pipe(debounceTime(400))
      .subscribe((name) => {
        this.loadManagers(name??"")
      });
  }

  showManagerDependingOnChosenRole(){
    const role = this.addEmployeeForm.getRawValue()['role']
    if(role == "EMPLOYEE"){
      return this.managers.filter(m => m.role != EmployeeRole.HR_ADMIN)
    }
    return this.managers
  }

  private async loadManagers(name:string) {
    this.managers = await lastValueFrom(this.employeeService.getListManagers(name));
  }

  protected readonly EmployeeRole = EmployeeRole;
}
