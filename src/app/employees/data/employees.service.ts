import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export default class EmployeesService {
  private readonly CONTENT_TYPE = "application/json";
  private readonly baseUrl = "api/v1/employee";
  private readonly headers;

  constructor( private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': this.CONTENT_TYPE
    });
  }

  getPaginatedEmployees(max:number, page:number){
    const url = `${this.baseUrl}?max=${max}&page=${page}`
    return this.httpClient.get<any>(url)
  }

  getEmployeeList(nameFilter:string|null){
    const url = `api/v1/list/employee`
    return this.httpClient.get<any>(url);
  }


}
