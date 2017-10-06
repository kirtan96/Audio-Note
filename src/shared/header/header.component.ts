import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthGuardService} from "../../services/auth-guard.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authGuardService: AuthGuardService) { }

  page;

  ngOnInit() {
    this.page = window;
  }

  logout() {
    this.authGuardService.logout().then(a => {
      this.router.navigate(['/login']);
    });
  }

  updateUsername(name) {
    $("#userName").html(name);
  }
}
