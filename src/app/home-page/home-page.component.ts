import {Component, Inject, OnInit} from '@angular/core';
import {AuthGuardService} from "../../services/auth-guard.service";
import {Router} from "@angular/router";
import $ from "jquery/dist/jquery";
import {HeaderComponent} from "../../shared/header/header.component";
import {FileInsertModalComponent} from "../../shared/file-insert-modal/file-insert-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {FirebaseApp} from "angularfire2";
import * as firebase from 'firebase/app';
import 'firebase/storage';

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

  constructor(private authGuardService: AuthGuardService,
              private router: Router,
              private headerComponent: HeaderComponent,
              private fileModal: FileInsertModalComponent,
              private modalService: NgbModal,
              private firebaseApp: FirebaseApp) {
    this.storage = firebaseApp.storage();
  }

  ngOnInit() {
    this.authGuardService.user.subscribe(a => {
      if (a === null) {
        this.router.navigate(['/login']);
      } else {
        this.userId = a.uid;
      }
    });
    $('#menuItems li').each(function() {
      $(this).on('click', function(){
        $('#menuItems li').each(function() {
          $(this).removeClass('selected');
        });
        $(this).addClass('selected');
      });
    });
    this.headerComponent.ngOnInit();
    this.authGuardService.user.subscribe(a => {
      if (a) {
        this.authGuardService.afDB.list('/users/' + a.uid).subscribe(a2 => {
          let data = a2[0];
          let keys = Object.keys(data);
          keys.forEach(key => {
            this.headerComponent.ngOnInit();
            this.headerComponent.updateUsername(data[key].name);
          });
        });
      }
    });
  }

  open(customModal) {
    this.modal = this.modalService.open(customModal);
    this.hideErrors();
    $(".progress").hide();
  }

  inputName() {
    this.hideErrors();
    $("#fileName").val($('input[type=file]')[0].files[0].name.replace(".mp3", ""));
  }

  upload() {
    if ($("#uploadButton").text() === "Upload") {
      this.hideErrors();
      if (!$("input[type=file]")[0].files[0]) {
        $("#errorNoFile").show();
        return;
      }
      let file = $("input[type=file]")[0].files[0];
      let fileName = $("#fileName").val().trim();
      if (fileName.length < 1) {
        $("#errorUploadFile").show();
        return;
      }
      if (!this.isUnique(fileName)) {
        $("#errorDuplicateFile").show();
        return;
      }
      let uploader = this.storage.ref(this.userId + "/" + fileName);
      this.task = uploader.put(file);
      this.task.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        $("#fileUpload").prop("disabled", true);
        $("#fileName").prop("disabled", true);
        $("#uploadButton").text("Cancel").removeClass("btn-success").addClass("btn-warning");
        $(".progress").show();
        $("#uploaderProgress").css("width", ((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%").
        removeClass("bg-danger")
        $("#percentageDone").text(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%");
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        $("#uploaderProgress").addClass("bg-success");
        $("#percentageDone").text("Uploaded Successfully!");
        $("#uploadButton").hide();
        $("#uploadButton").removeClass("btn-success").addClass("btn-primary");
      });
    } else {
      this.task.cancel();
      $("#fileUpload").prop("disabled", false);
      $("#fileName").prop("disabled", false);
      $("#uploadButton").text("Upload").removeClass("btn-warning").addClass("btn-success");
      $(".progress").show();
      $("#uploaderProgress").css("width", "100%").addClass("bg-danger");
      $("#percentageDone").text("Upload Canceled!");
    }
  }

  isUnique(file) {
    return true;
  }

  hideErrors() {
    $("#errorUploadFile").hide();
    $("#errorDuplicateFile").hide();
    $("#errorNoFile").hide();
  }

  closeModal() {
    this.modal.close();
  }
}
