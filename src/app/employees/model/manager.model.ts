import {EmployeeRole} from "./employee-role";

export default interface IManager{
    id: number,
    firstName: string,
    lastName: string,
    role: EmployeeRole
}
