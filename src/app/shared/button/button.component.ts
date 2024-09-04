import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {ButtonStyle} from "./button-style";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() public type: 'submit' | 'button' | 'reset' = 'button';
  @Input() public style!:ButtonStyle;
  @Input() public isDisabled:boolean = false;
  @Input() routerLink!: string;
  @Output() clickAction = new EventEmitter()

  constructor() {}

  public onClick(){
    this.clickAction.emit()
  }
}
