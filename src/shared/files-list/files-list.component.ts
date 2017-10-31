import {Component, Input, OnInit} from '@angular/core';
import {ANFile, FilesService} from "../../services/files.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  @Input() files: ANFile[];
  @Input() filteredFiles: ANFile[];
  deleteModal;
  editModal;
  infoModal;

  constructor(private fileService: FilesService,
              private modalService: NgbModal,
              private router: Router) {
    this.files = [];
    this.filteredFiles = [];
  }

  ngOnInit() {
  }

  toggleBookmark(file){
    file.bookmark = !file.bookmark;
    this.fileService.updateFile(file);
  }

  removeFile(file) {
    this.fileService.removeData(file).then(a => {
      if (file.type !== "youtube") {
        this.fileService.removeFile(file).then(b => {
          this.delete(file);
        });
      } else {
        this.delete(file);
      }
    });
  }

  delete(file) {
    let index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
    index = this.filteredFiles.indexOf(file);
    if (index > -1) {
      this.filteredFiles.splice(index, 1);
    }
    this.deleteModal.close();
  }

  showDeleteModal(modal, file) {
    this.deleteModal = this.modalService.open(modal);
    let self = this;
    $("#confirmationText").text("Are you sure you want to delete \"" + file.name + "\"?");
    $("#deleteButton").on("click", function(){
      self.removeFile(file);
    });
  }

  showEditModal(modal, file) {
    this.editModal = this.modalService.open(modal);
    let self = this;
    $("#errorDuplicateFile").hide();
    $("#errorNoFile").hide();
    $("#fileName").val(file.name);
    $("#editButton").on("click", function() {
      $("#errorDuplicateFile").hide();
      $("#errorNoFile").hide();
      let filename = $("#fileName").val().toString().trim();
      if (filename === file.name) {
        self.editModal.close();
        return;
      }
      if (filename.length < 1) {
        $("#errorNoFile").show();
        return;
      }
      if (!self.isUnique(filename)) {
        $("#errorDuplicateFile").show();
        return;
      }
      file.name = filename;
      file.modifiedOn = new Date().toLocaleString();
      self.fileService.updateFile(file).then(a => {
        self.editModal.close();
      });
    });
  }

  showInfoModal(modal, file) {
    this.infoModal = this.modalService.open(modal);
    $("#nameOfFile").text(file.name);
    $("#uploadedOn").text(file.dateUploaded);
    $("#modifiedOn").text(file.modifiedOn);
    $("#numberOfNotes").text(file.notes ? file.notes.length : 0);
    $("#downloadButton").hide();
    if (file.type !== "youtube") {
      $("#downloadButton").show();
      $("#downloadLink").show().attr("href", file.link).attr("download", file.filename);
    }
  }

  isUnique(filename) {
    let unique = true;
    this.files.forEach(file => {
      if (file.name === filename) {
        unique = false;
      }
    });
    return unique;
  }

  closeModal(){
    if (this.deleteModal){
      this.deleteModal.close();
    }
    if (this.editModal){
      this.editModal.close();
    }
    if (this.infoModal) {
      this.infoModal.close();
    }
  }

  goToPlayer(file) {
    this.router.navigate(["player", file.id]);
  }
}
