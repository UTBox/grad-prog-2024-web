import {Component, OnInit} from '@angular/core';
import {PaginationComponent} from "../../shared/pagination/pagination.component";
import {HttpParams} from "@angular/common/http";
import {Location} from "@angular/common";
import EmployeesService from "../data/employees.service";
import PageResponse from "../../shared/page-response";
import {lastValueFrom} from "rxjs";
import {ButtonComponent} from "../../shared/button/button.component";
import {ButtonType} from "../../shared/button/button-type";

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [
    PaginationComponent,
    ButtonComponent
  ],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.css'
})
export class AllEmployeesComponent implements OnInit{
  public isLoading = true

  private max = 5
  public currentPage = 1
  public totalPages = 0

  public employees!:PageResponse<any>

  protected readonly ButtonType = ButtonType;


  constructor(
    private employeesService:EmployeesService,
    private location:Location
  ) {}

  ngOnInit() {
    this.initializeData()
  }

  public setPageParams(page: number){
    let params = new HttpParams();
    params = params.append("page", page);
    this.location.go(this.location.path().split('?')[0], params.toString());
  }

  public handleChangePage(page:number){
    this.currentPage = page
    this.setPageParams(page)
    this.initializeData()
  }

  private async initializeData(){
    this.employees = await lastValueFrom(this.employeesService.getPaginatedEmployees(this.max, this.currentPage))
    this.totalPages = this.employees.totalPages
    this.isLoading = false
  }

}
