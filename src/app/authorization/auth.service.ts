import { Injectable } from '@angular/core';
import { Role } from './role';
import {UserObservable} from "./observable/user-observable";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private userObservable:UserObservable
  ) {}

  getUserRole(): Role{
  }
}
