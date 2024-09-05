import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showSuccess(message: string, title: string = 'Success!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonText: 'OK',
    });
  }

  showError(title: string, message: string) {
    Swal.fire({
      title: title ? title : 'Error!',
      text: message ? message : 'Unknown error',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  showApprovedLeaveToast() {
    Swal.fire({
      title: "Leave application approved!",
      icon: "success",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  showRejectedLeaveToast() {
    Swal.fire({
      title: "Leave application rejected!",
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
