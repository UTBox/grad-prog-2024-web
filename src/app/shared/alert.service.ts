import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showSuccess(message: string) {
    Swal.fire({
      title: 'Success',
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

  showLeaveTransactionToast(status: string) {
    Swal.fire({
      title: `Leave application ${status}!`,
      icon: "success",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
