import {HttpClient, HttpHeaders} from "@angular/common/http";
import PageResponse from "../../shared/page-response";
import IManagerialLeave from "../model/managerial-leave.model";
import {Injectable} from "@angular/core";
import ICreateLeave from "../model/create-leave.model";
import IUpdateLeaveRequest from "../model/update-leave-request.model";
import IEmployeeLeaveResponse from "../model/employee-leave-response.model";

@Injectable({
  providedIn: 'root'
})
export default class LeaveService {
  private readonly CONTENT_TYPE = "application/json";
  private readonly baseUrl = "api/v1/leave";
  private readonly headers;

  constructor( private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': this.CONTENT_TYPE
    });
  }

  getAllPendingLeaves(max:number, page:number, managerId:number|null){

    let url = `${this.baseUrl}?max=${max}&page=${page}&status=PENDING`;
    if(managerId != null){
      url += `&manager=${managerId}`
    }
    return this.httpClient.get<PageResponse<IManagerialLeave>>(url);
  }

  getAllEmployeeLeaves(max: number, page:number, employeeId:number){
    const url = `${this.baseUrl}/employee/${employeeId}?max=${max}&page=${page}`
    return this.httpClient.get<PageResponse<IEmployeeLeaveResponse>>(url)
  }

  createLeave(
    leaveRequest: ICreateLeave
  ) {
    const url = `${this.baseUrl}`;
    return this.httpClient.post(url, leaveRequest);
  }

  updateLeave(id:number, requestBody:IUpdateLeaveRequest){
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.put(url, requestBody);
  }

  cancelLeave(id:number){
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.delete(url);
  }
}

