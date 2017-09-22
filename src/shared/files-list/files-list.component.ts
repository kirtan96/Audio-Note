import {Component, Input, OnInit} from '@angular/core';
import $ from "jquery/dist/jquery";
import {ANFile, FilesService} from "../../services/files.service";

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  @Input() files: ANFile[];

  constructor(private fileService: FilesService) {
    this.files = [];
  }

  ngOnInit() {
    $(".bookmark").each(function() {

    })
  }

  toggleBookmark(file){
    file.bookmark = !file.bookmark;
    this.fileService.updateFile(file);
  }

}
