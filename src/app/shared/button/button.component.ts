import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {ButtonType} from "./button-type";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() public type: 'submit' | 'button' | 'reset' = 'button';
  @Input() public style!:ButtonType;
  @Input() public isDisabled:boolean = false;
  @Output() clickAction = new EventEmitter()

  constructor() {}

  public onClick(){
    this.clickAction.emit()
  }
}
