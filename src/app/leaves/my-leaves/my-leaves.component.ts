import {Component, OnInit} from '@angular/core';
import {PaginationComponent} from "../../shared/pagination/pagination.component";
import PageResponse from "../../shared/page-response";
import IManagerialLeave from "../model/managerial-leave.model";
import {Role} from "../../authorization/role";
import { ButtonStyle } from './../../shared/button/button-style';
import {lastValueFrom} from "rxjs";
import LeaveService from "../data/leave.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {HttpParams} from "@angular/common/http";
import IEmployeeLeaveResponse from "../model/employee-leave-response.model";
import {ButtonComponent} from "../../shared/button/button.component";
import IUpdateLeaveRequest from "../model/update-leave-request.model";
import {LeaveStatus} from "../leave-status";
import User from "../../authorization/user.model";
import { AlertService } from '../../shared/alert.service';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    PaginationComponent,
    DatePipe,
    ButtonComponent,
    LoadingSpinnerComponent
],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.css'
})
export class MyLeavesComponent implements OnInit{
  public isLoading = true
  public leaves!: PageResponse<IEmployeeLeaveResponse>;

  private max = 5
  public currentPage = 1
  public totalPages = 1

  public selectedUserRole!:Role
  private selectedUser!:User

  protected readonly ButtonStyle = ButtonStyle;
  protected readonly LeaveStatus = LeaveStatus;

  constructor(
    private leaveService:LeaveService,
    private router:Router,
    private route:ActivatedRoute,
    private location:Location,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.initializePage()
  }

  public handleCancelLeave(id:number){
    this.leaveService.cancelLeave(id).subscribe({next: (data)=>{
      this.initializeData();
      this.alertService.showLeaveTransactionToast("cancelled");

    }, error: (err)=>{
      console.log(err)
      this.alertService.showError(err.error.errorCode, err.error.errorMessage);
    }})
  }

  public handleChangePage(page: number) {
    this.currentPage = page;
    this.setPageParams(page);
    this.initializeData();
  }

  public setPageParams(page: number){
    let params = new HttpParams();
    params = params.append("page", page);
    this.location.go(this.location.path().split('?')[0], params.toString());
  }

  private getQueryParams(){
    this.route.queryParams.subscribe(params => {
      if(isNaN(Number(params['page']))){
        this.setPageParams(1);
        return;
      }
      this.currentPage = Number(params['page']);
    });
  }

  private async initializePage(){
    this.initializeSelectedUserData()
    this.getQueryParams()
    await this.initializeData()
    this.isLoading = false
  }

  private async initializeData(){

    let userId = this.selectedUser.id

    this.leaves = await lastValueFrom(this.leaveService.getAllEmployeeLeaves(this.max, this.currentPage, userId))
    this.totalPages = this.leaves.totalPages
    console.log(this.leaves)
    this.isLoading = false
  }

  private initializeSelectedUserData(){
    this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser') ?? "")
    this.selectedUserRole = this.selectedUser.role
  }
}
