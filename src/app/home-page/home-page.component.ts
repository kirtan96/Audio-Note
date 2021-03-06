import {Component, Inject, OnInit} from '@angular/core';
import {AuthGuardService} from "../../services/auth-guard.service";
import {Router} from "@angular/router";
import {HeaderComponent} from "../../shared/header/header.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {FilesListComponent} from "../../shared/files-list/files-list.component";
import {ANFile} from "../../services/files.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  private userId;
  private storage;
  private modal;
  private task;
  private database;
  private selected;
  public files: ANFile[];
  public filteredFiles: ANFile[];

  constructor(private authGuardService: AuthGuardService,
              private router: Router,
              private headerComponent: HeaderComponent,
              private modalService: NgbModal,
              private firebaseApp: FirebaseApp,
              private fileList: FilesListComponent) {
    this.storage = firebaseApp.storage();
    this.database = firebaseApp.database();
    this.files = [];
    this.filteredFiles = [];
    this.selected = "home";
  }

  ngOnInit() {
    this.authGuardService.user.subscribe(a => {
      if (a === null) {
        this.router.navigate(['/login']);
      } else {
        this.userId = a.uid;
        this.authGuardService.afDB.list('/users/' + a.uid).subscribe(a2 => {
          this.files = [];
          this.filteredFiles = [];
          a2.forEach( b => {
            let keys = Object.keys(b);
            keys.forEach(key => {
              if (key === "info") {
                this.headerComponent.updateUsername(b[key].name);
              }
              if (b.$key === "files") {
                let fileDb = b[key];
                let fileKeys = Object.keys(b[key]);
                fileKeys.forEach( fileKey => {
                  let anFile = new ANFile();
                  anFile.deserialize(fileDb[fileKey]);
                  this.files.push(anFile);
                  // this.filteredFiles.push(anFile);
                  this.filter(this.selected);
                });
              }
            });
          });
        });
      }
    });
    $("#" + this.selected).addClass("selected");
    $('#menuItems li').each(function() {
      $(this).on('click', function(){
        $('#menuItems li').each(function() {
          $(this).removeClass('selected');
        });
        $(this).addClass('selected');
      });
    });
  }

  open(customModal) {
    this.modal = this.modalService.open(customModal);
    this.hideErrors();
    $(".progress").hide();
  }

  inputName() {
    this.hideErrors();
    let name = ($('input[type=file]')[0] as HTMLInputElement).files[0].name.replace(".mp3", "");
    if (name.length > 30) {
      name = name.substring(0, 30);
    }
    $("#fileName").val(name);
  }

  upload() {
    if ($(".uploadButton").text() === "Upload") {
      this.hideErrors();
      if (!($("input[type=file]")[0] as HTMLInputElement).files[0]) {
        $(".errorNoFile").show();
        return;
      }
      let file = ($('input[type=file]')[0] as HTMLInputElement).files[0];
      let fileName = $("#fileName").val().toString().trim();
      if (fileName.length < 1) {
        $(".errorUploadFile").show();
        return;
      }
      if (!this.isUnique(fileName)) {
        $(".errorDuplicateFile").show();
        return;
      }
      let uploader = this.storage.ref(this.userId + "/" + file.name);
      this.task = uploader.put(file);
      this.task.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        $("#fileUpload").prop("disabled", true);
        $("#fileName").prop("disabled", true);
        $(".uploadButton").text("Cancel").removeClass("btn-success").addClass("btn-warning");
        $(".progress").show();
        $(".uploaderProgress").css("width", ((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%").
        removeClass("bg-danger")
        $("#percentageDone").text(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%");
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        $(".uploaderProgress").addClass("bg-success");
        $("#percentageDone").text("Uploaded Successfully!");
        $(".uploadButton").hide();
        $(".uploadButton").removeClass("btn-success").addClass("btn-primary");
        uploader.getDownloadURL().then(a => {
          let hashed = (+new Date).toString(36);
          let dbHelper = this.database.ref("/users/" + this.userId + "/files/" + hashed);
          let fileJson = {
            id: hashed,
            name: fileName,
            filename: file.name,
            link: a,
            dateUploaded: new Date().toLocaleString(),
            modifiedOn: new Date().toLocaleString(),
            type: "file",
            bookmark: false,
            notes: []
          };
          let anFile = new ANFile();
          anFile.deserialize(fileJson);
          dbHelper.push(fileJson).then( a => {
            // this.files.push(anFile);
          });
        });
      });
    } else {
      this.task.cancel();
      $("#fileUpload").prop("disabled", false);
      $("#fileName").prop("disabled", false);
      $(".uploadButton").text("Upload").removeClass("btn-warning").addClass("btn-success");
      $(".progress").show();
      $(".uploaderProgress").css("width", "100%").addClass("bg-danger");
      $("#percentageDone").text("Upload Canceled!");
    }
  }

  isUnique(file) {
    let isUnique = true;
    this.files.forEach(f => {
      if (f.name === file) {
        isUnique = false;
      }
    });
    return isUnique;
  }

  hideErrors() {
    $(".errorUploadFile").hide();
    $(".errorDuplicateFile").hide();
    $(".errorNoFile").hide();
    $(".errorYTLink").hide();
    $(".invalidYTLink").hide();
  }

  closeModal() {
    this.modal.close();
  }

  filter(filter) {
    if (filter === 'home') {
      this.filteredFiles = this.files;
      this.selected = "home";
    } else if (filter === 'files') {
      this.selected = "files";
      this.filteredFiles = this.files.filter(file => {
        if (file.type === 'file'){
          return file;
        }
      });
    } else if (filter === 'recordings') {
      this.selected = "recordings";
      this.filteredFiles = this.files.filter(file => {
        if (file.type === 'recording') {
          return file;
        }
      });
    } else if (filter === 'youtube') {
      this.selected = "youtube";
      this.filteredFiles = this.files.filter(file => {
        if (file.type === 'youtube') {
          return file;
        }
      });
    } else if (filter === 'favorites') {
      this.selected = "favorites";
      this.filteredFiles = this.files.filter(file => {
        if (file.bookmark) {
          return file;
        }
      });
    }
  }

  uploadYT() {
    if ($(".uploadButton").text() === "Upload") {
      this.hideErrors();
      let fileName = $("#ytFileName").val().toString().trim();
      let ytLink = $("#ytLink").val().toString().trim();
      if (ytLink.length < 1) {
        $(".errorYTLink").show();
        return;
      }
      if (!this.isValidYoutubeLink(ytLink)) {
        $(".invalidYTLink").show();
        return;
      }
      if (fileName.length < 1) {
        $(".errorUploadFile").show();
        return;
      }
      if (!this.isUnique(fileName)) {
        $(".errorDuplicateFile").show();
        return;
      }
      let hashed = (+new Date).toString(36);
      let dbHelper = this.database.ref("/users/" + this.userId + "/files/" + hashed);
      let fileJson = {
        id: hashed,
        name: fileName,
        filename: fileName,
        link: ytLink,
        dateUploaded: new Date().toLocaleString(),
        modifiedOn: new Date().toLocaleString(),
        type: "youtube",
        bookmark: false,
        notes: []
      };
      let anFile = new ANFile();
      anFile.deserialize(fileJson);
      dbHelper.push(fileJson).then( a => {
        // this.files.push(anFile);
        this.modal.close();
      });
    }
  }

  isValidYoutubeLink(ytLink) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(ytLink.match(p)) {
      return true;
    }
    else {
      return false;
    }
  }
}
