import { ButtonStyle } from './../../shared/button/button-style';
import {Component, OnInit} from '@angular/core';
import PageResponse from "../../shared/page-response";
import IManagerialLeave from "../model/managerial-leave.model";
import LeaveService from "../data/leave.service";
import {lastValueFrom} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe, Location} from "@angular/common";
import {PaginationComponent} from "../../shared/pagination/pagination.component";
import {ButtonComponent} from "../../shared/button/button.component";
import IUpdateLeaveRequest from "../model/update-leave-request.model";
import {Role} from "../../authorization/role";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { AlertService } from '../../shared/alert.service';
import User from "../../authorization/user.model";

@Component({
  selector: 'app-all-leaves',
  standalone: true,
  imports: [
    PaginationComponent,
    ButtonComponent,
    DatePipe,
    LoadingSpinnerComponent
],
  templateUrl: './all-leaves.component.html',
  styleUrl: './all-leaves.component.css'
})
export class AllLeavesComponent implements OnInit{
  public isLoading = true
  public leaves!: PageResponse<IManagerialLeave>;

  private max = 10
  public currentPage = 1
  public totalPages = 0

  public selectedUser!:User
  public selectedUserRole!:Role
  protected readonly ButtonStyle = ButtonStyle;

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


  public handleApproveLeave(id:number){
    let toUpdate:IUpdateLeaveRequest = {
      status: "APPROVED"
    }

    this.leaveService.updateLeave(id, toUpdate).subscribe({next: (data)=>{
      this.initializeData();
      this.alertService.showLeaveTransactionToast("approved");
    },error: (err)=>{
      console.log(err)
      this.alertService.showError(err.error.errorCode, err.error.errorMessage);
    } })
  }
  public handleRejectLeave(id:number){
    let toUpdate:IUpdateLeaveRequest = {
      status: "REJECTED"
    }

    this.leaveService.updateLeave(id, toUpdate).subscribe({next: (data)=>{
        this.initializeData();
        this.alertService.showLeaveTransactionToast("rejected");

      },error: (err)=>{
        console.log(err)
        this.alertService.showError(err.error.errorCode, err.error.errorMessage);
      } })
  }

  public handleChangePage(page:number){
    this.currentPage = page
    this.setPageParams(page)
    this.initializeData()
  }

  public setPageParams(page: number){
    let params = new HttpParams();
    params = params.append("page", page);
    this.location.go(this.location.path().split('?')[0], params.toString());
  }

  private async initializePage(){
    this.initializeSelectedUserData()
    this.getQueryParams()
    await this.initializeData()
    this.isLoading = false
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

  private async initializeData(){

    let managerId = this.selectedUser.role == Role.MANAGER? this.selectedUser.id : null

    this.leaves = await lastValueFrom(this.leaveService.getAllPendingLeaves(this.max, this.currentPage, managerId))
    this.totalPages = this.leaves.totalPages
    this.isLoading = false
  }

  private initializeSelectedUserData(){
    this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser') ?? "{}")
    this.selectedUserRole = this.selectedUser.role
  }
}
