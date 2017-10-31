///<reference path="../../../node_modules/@types/youtube/index.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ANFile, FilesService} from "../../services/files.service";
import {AuthGuardService} from "../../services/auth-guard.service";
import YouTubePlayer from "youtube-player";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  file: ANFile;
  userId;
  audio;
  player: any;
  editModal;
  deleteModal;
  editing = false;
  deleting = false;
  timeLeftOff;

  constructor(private authGuardService: AuthGuardService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private fileService: FilesService) {
    route.params.subscribe(params => {
      this.authGuardService.user.subscribe(a => {
        if (a === null) {
          this.router.navigate(['/login']);
        } else {
          this.userId = a.uid;
          this.authGuardService.afDB.list('/users/' + a.uid + "/files/" + params.id).subscribe(a2 => {
            this.file = new ANFile();
            this.file.deserialize(a2[0]);
            if (this.file.type === 'youtube') {
              $("#player").hide();
              this.getYTReady(this.file.link);
            } else {
              $("#audioPlayer").attr("src", this.file.link);
              this.audio = $("#audioPlayer")[0];
            }
            $("#fileName").text(this.file.name);
          });
        }
      });
    });
  }

  ngOnInit() {

  }

  goBack() {
    this.router.navigate(["../"]);
  }

  playFrom(time) {
    if (!this.editing && !this.deleting) {
      let minutes = Number.parseInt(time.split(":")[0]) * 60;
      let seconds = Number.parseInt(time.split(":")[1]);
      if (this.audio) {
        this.audio.currentTime = minutes + seconds;
      } else if (this.player) {
        this.player.seekTo(minutes+seconds);
      }
    }
  }

  pause() {
    if (this.file.type !== "youtube") {
      this.audio.pause();
      this.timeLeftOff = this.audio.currentTime;
    } else {
      this.player.pauseVideo();
    }
  }

  resume() {
    if (this.file.type !== "youtube") {
      this.audio.currentTime = this.timeLeftOff;
      this.audio.play();
    } else {
      this.player.playVideo();
    }
  }

  editNote(modal, note) {
    this.editing = true;
    this.pause();
    let self = this;
    self.editModal = self.modalService.open(modal);
    $("#noteView").text(note.note);
    $("#editButton").on("click", function () {
      self.updateNote(note.time, $("#noteView").val());
    });
  }

  updateNote(time, note) {
    this.file.notes.forEach(n => {
      if (n.time === time) {
        n.note = note;
      }
    });
    this.fileService.updateFile(this.file);
    this.closeModal();
  }

  deleteNote(modal, note) {
    let self = this;
    this.pause();
    self.deleting = true;
    self.deleteModal = self.modalService.open(modal);
    $("#confirmationText").html("Are you sure you want to delete this note?");
    $("#deleteButton").on("click", function () {
      self.delete(note.time);
    });
  }

  delete(time) {
    this.file.notes = this.file.notes.filter(note => {
      if (note.time !== time) {
        return note;
      }
    });
    this.fileService.updateFile(this.file);
    this.closeModal();
  }

  getYTReady(link){
    let element = $("#ytPlayer");
    this.player = new YouTubePlayer(element[0]);
    let video_id = link.split('v=')[1];
    let ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition !== -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    this.player.loadVideoById(video_id);
  }

  closeModal(){
    if (this.deleteModal){
      this.deleting = false;
      this.deleteModal.close();
    }
    if (this.editModal){
      this.editing = false;
      this.editModal.close();
    }
    this.resume();
  }

}
