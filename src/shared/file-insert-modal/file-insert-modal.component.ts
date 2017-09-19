import { Component, OnInit } from '@angular/core';
import $ from "jquery/dist/jquery";

@Component({
  selector: 'app-file-insert-modal',
  templateUrl: './file-insert-modal.component.html',
  styleUrls: ['./file-insert-modal.component.css']
})
export class FileInsertModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  showModal() {
    $(".modal-dialog").show();
  }

}
