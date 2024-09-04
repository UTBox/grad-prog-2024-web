import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Role} from "../role";

@Injectable({providedIn: 'root'})
export class UserObservable{
  private changeRoleStateSubject = new BehaviorSubject<Role|undefined>(undefined);
  changeRoleState$ = this.changeRoleStateSubject.asObservable();

  changeRole(role:Role|undefined):void{
    this.changeRoleStateSubject.next(role);
  }

  clearRole():void{
    this.changeRoleStateSubject.next(undefined);
  }
}
