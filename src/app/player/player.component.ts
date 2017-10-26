import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ANFile, FilesService} from "../../services/files.service";
import {AuthGuardService} from "../../services/auth-guard.service";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  file: ANFile;
  userId;
  audio;

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
    this.audio.currentTime = minutes + seconds;
  }

  editNote(note) {
    console.log("Editing");

  }

  deleteNote(note) {
    console.log("deleting");
  }

}
