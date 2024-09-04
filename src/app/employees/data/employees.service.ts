import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IEmployee } from '../model/employee.model';
import IManager from '../model/manager.model';

@Injectable({
  providedIn: 'root',
})
export default class EmployeesService {
  private readonly CONTENT_TYPE = 'application/json';
  private readonly baseUrl = 'api/v1/employee';
  private readonly headers;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': this.CONTENT_TYPE,
    });
  }

  getPaginatedEmployees(max: number, page: number) {
    const url = `${this.baseUrl}?max=${max}&page=${page}`;
    return this.httpClient.get<any>(url);
  }

  getEmployeeList(name: string = "") {
    let url = `api/v1/list/employee`;
    if(name.length>0){
      url += `?name=${name}`
    }
    return this.httpClient.get<any>(url);
  }

  getEmployee(id: string | null) {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<any>(url);
  }

  getListManagers(name:string) {
    let url:string = `api/v1/list/manager`;
    if(name.length>0){
      url += `?name=${name}`
    }
    return this.httpClient.get<IManager[]>(url);
  }

  createEmployee(employee: IEmployee) {
    const url: string = `${this.baseUrl}`;
    return this.httpClient.post<IEmployee>(url, employee, {
      headers: this.headers,
    });
  }

  updateEmployee(updatedEmployee: IEmployee) {
    const url: string = `${this.baseUrl}/${updatedEmployee.id}`;
    return this.httpClient.put<IEmployee>(url, updatedEmployee, {
      headers: this.headers,
    });
  }
}
