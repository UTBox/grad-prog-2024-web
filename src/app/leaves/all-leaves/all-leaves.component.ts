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
import {ButtonType} from "../../shared/button/button-type";
import IUpdateLeaveRequest from "../model/update-leave-request.model";
import {LeaveStatus} from "../leave-status";
import {Role} from "../../authorization/role";

@Component({
  selector: 'app-all-leaves',
  standalone: true,
  imports: [
    PaginationComponent,
    ButtonComponent,
    DatePipe
  ],
  templateUrl: './all-leaves.component.html',
  styleUrl: './all-leaves.component.css'
})
export class AllLeavesComponent implements OnInit{
  public isLoading = true
  public leaves!: PageResponse<IManagerialLeave>;
  private headers = [
    "Applied By",
    "Manager",
    "Start",
    "End",
    "Days"
  ]

  private max = 5
  public currentPage = 0
  public totalPages = 0

  public selectedUserRole = "HR"
  private userId!:number
  protected readonly ButtonType = ButtonType;

  constructor(
    private leaveService:LeaveService,
    private router:Router,
    private route:ActivatedRoute,
    private location:Location,
  ) {}

  ngOnInit() {
    this.initializeSelectedUserData()
    this.getQueryParams()
    this.initializeData()
  }

  public buildTableHeader(): String[]{
    if(this.selectedUserRole == "MANAGER"){
      return this.headers.filter(h => h != "Manager")
    }
    return this.headers
  }

  public buildTableContent(): String[][]{
    if(this.leaves === undefined){
      return [];
    }

    if(this.selectedUserRole == "MANAGER"){
      return this.leaves.content.map(l => ([
        l.id.toString(),
        l.employeeName,
        l.startDate.toString(),
        l.endDate.toString(),
        l.workDays.toString()
      ]))
    }

    return this.leaves.content.map(l => ([
      l.id.toString(),
      l.employeeName,
      l.managerName,
      l.startDate.toString(),
      l.endDate.toString(),
      l.workDays.toString()
    ]))
  }

  public handleApproveLeave(id:number){
    let toUpdate:IUpdateLeaveRequest = {
      status: "APPROVED"
    }

    this.leaveService.updateLeave(id, toUpdate).subscribe({next: (data)=>{
      console.log(data)
    },error: (err)=>{
      console.log(err)
    } })
  }
  public handleRejectLeave(id:number){
    let toUpdate:IUpdateLeaveRequest = {
      status: "REJECTED"
    }

    this.leaveService.updateLeave(id, toUpdate).subscribe({next: (data)=>{
        console.log(data)
      },error: (err)=>{
        console.log(err)
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

  private getQueryParams(){
    this.route.queryParams.subscribe(params => {
      if(isNaN(Number(params['page']))){
        this.setPageParams(1);
        return;
      }
      this.currentPage = Number(params['page']);
      console.log("here", this.currentPage, params['page'])
    });
  }

  private async initializeData(){

    let managerId = this.selectedUserRole == Role.MANAGER? this.userId : null

    this.leaves = await lastValueFrom(this.leaveService.getAllPendingLeaves(this.max, this.currentPage, managerId))
    this.totalPages = this.leaves.totalPages
    this.isLoading = false
  }

  private initializeSelectedUserData(){
    this.userId = Number(sessionStorage.getItem('userId'))
    this.selectedUserRole = <Role> sessionStorage.getItem("selectedUserRole")
  }
}
