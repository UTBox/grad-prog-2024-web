import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {ButtonType} from "../button/button-type";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    ButtonComponent
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges{
  protected readonly ButtonType = ButtonType;

  @Input({required: true}) currentPage = 1
  @Input({required: true}) totalPages = 1

  @Output() changePageAction = new EventEmitter()

  private maxPageNumbers = 5
  public pageNumbers: number[] = []
  public isPrevButtonDisabled = false;
  public isNextButtonDisabled = false;

  ngOnChanges(changes: SimpleChanges) {
    if(changes["currentPage"]){
      this.currentPage = changes["currentPage"].currentValue
      this.determinePageNumbers()
      this.determinePageNavigationButtonDisable()
    }
    if(changes["totalPages"]){
      this.totalPages = changes["totalPages"].currentValue
      this.determinePageNumbers()
      this.determinePageNavigationButtonDisable()
    }
  }

  public handleNextPage(){
    this.handleChangePage(this.currentPage+1)
  }
  public handlePreviousPage(){
    this.handleChangePage(this.currentPage-1)
  }
  public handleChangePage(page:number){
    this.currentPage = page
    this.changePageAction.emit(this.currentPage)
  }

  private determinePageNumbers(){
    this.pageNumbers = [];
    const pageNumberOffset = Math.floor(this.maxPageNumbers / 2);
    const lowerLimit = this.currentPage>pageNumberOffset? this.currentPage-pageNumberOffset : 1;
    const upperLimit = this.currentPage+pageNumberOffset<=this.totalPages? this.currentPage+pageNumberOffset : this.totalPages;
    for(let i=lowerLimit; i<=upperLimit; i++){
      this.pageNumbers.push(i);
    }
  }

  private determinePageNavigationButtonDisable(){
    this.isPrevButtonDisabled = this.currentPage <= 1;
    this.isNextButtonDisabled = this.currentPage >= this.totalPages;
  }

}
