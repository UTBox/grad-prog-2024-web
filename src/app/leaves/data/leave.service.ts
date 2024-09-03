import {HttpClient, HttpHeaders} from "@angular/common/http";
import PageResponse from "../../shared/page-response";
import IManagerialLeave from "../model/managerial-leave.model";
import {Injectable} from "@angular/core";

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

  getAllLeaves(max:number, page:number){
    const url = `${this.baseUrl}?max=${max}&page=${page}`;
    return this.httpClient.get<PageResponse<IManagerialLeave>>(url);
  }
}

