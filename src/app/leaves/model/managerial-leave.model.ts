import {LeaveStatus} from "../leave-status";

export default interface IManagerialLeave{
  id: number
  employeeName: string
  managerName: string
  startDate: Date
  endDate: Date
  workDays: number
  reason: string
  status: LeaveStatus
}
