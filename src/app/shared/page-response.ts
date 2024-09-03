export default interface PageResponse<T>{
  content: Array<T>
  totalCount: number
  totalPages: number
  pageNumber: number
}
