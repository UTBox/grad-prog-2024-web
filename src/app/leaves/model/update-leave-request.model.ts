import {LeaveStatus} from "../leave-status";

export default interface IUpdateLeaveRequest{
  status: "CANCELLED"|"REJECTED"|"PENDING"|"APPROVED"
}
