import {HttpClient, HttpHeaders} from "@angular/common/http";
import PageResponse from "../../shared/page-response";
import IManagerialLeave from "../model/managerial-leave.model";
import {Injectable} from "@angular/core";
import IUpdateLeaveRequest from "../model/update-leave-request.model";

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
  updateLeave(id:number, requestBody:IUpdateLeaveRequest){
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.put(url, requestBody);
  }
}

