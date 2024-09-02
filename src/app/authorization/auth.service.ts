import { Injectable } from '@angular/core';
import { Role } from './role';
import {UserObservable} from "./observable/user-observable";
import {LocalStorageService} from "../shared/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private userObservable:UserObservable,
    private localStorage:LocalStorageService
  ) {}

  getUserRole(): Role{
    return <Role> localStorage.getItem('role') ?? Role.NONE
  }
}
