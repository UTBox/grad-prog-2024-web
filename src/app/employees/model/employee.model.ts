import { EmployeeRole } from "./employee-role"
import IManager from "./manager.model"

export interface IEmployee{
    id: number,
    firstName: string,
    lastName: string,
    fullName: string
    role: EmployeeRole,
    totalLeaves: number,
    availableLeaves: number,
    manager: IManager|null|undefined
}
