import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showSuccess(message: string, title: string = 'Success') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonText: 'OK',
    });
  }

  showError(message: string, title: string = 'Error') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonText: 'OK',
    });
  }
}
