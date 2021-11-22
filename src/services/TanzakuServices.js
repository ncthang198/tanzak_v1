import { RestfulAPI } from "../common";


export default class TanzakuServices extends RestfulAPI {
  postComment(book_id, comment) {
    return this.POST("/books/{book_id}/comment", {
     comment: comment
    });   
  }
 }