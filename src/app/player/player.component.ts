///<reference path="../../../node_modules/@types/youtube/index.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ANFile, FilesService} from "../../services/files.service";
import {AuthGuardService} from "../../services/auth-guard.service";
import YouTubePlayer from "youtube-player";
import {sendRequest} from 'selenium-webdriver/http';

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

  constructor(private authGuardService: AuthGuardService,
              private route: ActivatedRoute,
              private router: Router,
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
            $("#audioPlayer").attr("src", this.file.link);
            $("#fileName").text(this.file.name);
            this.audio = $("#audioPlayer")[0];
            if (this.file.type === "youtube") {
              this.getYTReady(this.file.link);
            }
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
    let minutes = Number.parseInt(time.split(":")[0]) * 60;
    let seconds = Number.parseInt(time.split(":")[1]);
    if (this.audio) {
      this.audio.currentTime = minutes + seconds;
    } else if (this.player) {
      console.log("Came here");
      this.player.seekTo(minutes+seconds);
    }
  }

  editNote(note) {
    console.log("Editing");

  }

  deleteNote(note) {
    console.log("deleting");
  }

  getYTReady(link){
    let element = $("#ytPlayer");
    console.log(element[0]);
    this.player = new YouTubePlayer(element[0]);
    let video_id = link.split('v=')[1];
    let ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition !== -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    this.player.loadVideoById(video_id);
  }

}
