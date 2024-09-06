import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import EmployeesService from '../data/employees.service';
import PageResponse from '../../shared/page-response';
import { lastValueFrom } from 'rxjs';
import { ButtonComponent } from '../../shared/button/button.component';
import { ButtonStyle } from '../../shared/button/button-style';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import {EmployeeRole} from "../model/employee-role";
import {IEmployee} from "../model/employee.model";

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [PaginationComponent, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.css',
})
export class AllEmployeesComponent implements OnInit {
  public isLoading = true;

  private max = 10;
  public currentPage = 1;
  public totalPages = 0;

  public employees!: PageResponse<IEmployee>;

  protected readonly ButtonStyle = ButtonStyle;

  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializePage();
  }

  onEdit(employeeId: number) {
    this.router.navigate([`/employees/edit/${employeeId}`]);
  }

  public handleChangePage(page: number) {
    this.currentPage = page;
    this.setPageParams(page);
    this.initializeData();
  }

  private async initializePage() {
    this.getQueryParams();
    await this.initializeData();
    this.isLoading = false;
  }

  private async initializeData() {
    this.employees = await lastValueFrom(
      this.employeesService.getPaginatedEmployees(this.max, this.currentPage)
    );
    this.totalPages = this.employees.totalPages;
  }

  private setPageParams(page: number) {
    let params = new HttpParams();
    params = params.append('page', page);
    this.location.go(this.location.path().split('?')[0], params.toString());
  }

  private getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (isNaN(Number(params['page']))) {
        this.setPageParams(1);
        return;
      }
      this.currentPage = Number(params['page']);
    });
  }

  protected readonly EmployeeRole = EmployeeRole;
}
