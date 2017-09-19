import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from "../../services/auth-guard.service";
import {Router} from "@angular/router";
import $ from "jquery/dist/jquery";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  constructor(private authGuardService: AuthGuardService, private router: Router) { }

  ngOnInit() {
    $('.text-danger').hide();
    $('#name').on('keydown', function() {
      $('.text-danger').hide();
    });
    $('#email').on('keydown', function() {
      $('.text-danger').hide();
    });
    $('#pwd').on('keydown', function() {
      $('.text-danger').hide();
    });
    $('#confirmPwd').on('keydown', function() {
      $('.text-danger').hide();
    });
    this.authGuardService.afAuth.authState.subscribe(a => {
      if (a !== null) {
        this.router.navigate(['/home']);
      }
    });
  }

  signup() {
    const userName = $("#name").val().trim();
    const email = $("#email").val().trim();
    const password = $("#pwd").val().trim();
    const confirmPwd = $("#confirmPwd").val().trim();
    if (userName.length < 1) {
      $('#emptyName').show();
      return;
    }
    if (email.length < 1){
      $('#emptyEmail').show();
      return;
    }
    if (!this.isValidEmail(email)) {
      $('#invalidEmail').show();
      return;
    }
    if (password.length < 1) {
      $('#emptyPwd').show();
      return;
    }
    if (password.length < 6) {
      $('#invalidPwd').show();
      return;
    }
    if (confirmPwd.length < 1) {
      $('#emptyConfirmPwd').show();
      return;
    }
    if (password !== confirmPwd) {
      $('#invalidConfirmPwd').show();
      return;
    }
    this.authGuardService.signup(email, password).then(a => {
      this.authGuardService.afDB.list('/users/' + a.uid).
        push({info: {name:userName, dateCreated: new Date().toLocaleString()}});
      this.authGuardService.login(email, password).then(a2 => {
        this.authGuardService.items = this.authGuardService.afDB.list('/users/' + a2.uid);
        this.router.navigate(['/home']);
      });
    }).catch(a => {
      $('#duplicateEmail').show();
    });
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
