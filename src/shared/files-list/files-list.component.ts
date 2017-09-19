import { Component, OnInit } from '@angular/core';
import $ from "jquery/dist/jquery";

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(".bookmark").each(function() {
      $(this).on("click", function() {
        if ($(this).hasClass("fa-star-o")) {
          $(this).removeClass("fa-star-o");
          $(this).addClass("fa-star");
        } else {
          $(this).removeClass("fa-star");
          $(this).addClass("fa-star-o");
        }
      });
    })
  }

}
