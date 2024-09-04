import {LeaveStatus} from "../leave-status";

export default interface IEmployeeLeaveResponse{

  id: number
  startDate: Date
  endDate: Date
  workDays: number
  reason: string
  status: LeaveStatus
}
