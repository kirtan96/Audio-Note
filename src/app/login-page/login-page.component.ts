import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from "../../services/auth-guard.service";
import $ from 'jquery/dist/jquery';
import {Router} from "@angular/router";
import {HeaderComponent} from "../../shared/header/header.component";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private authGuardService: AuthGuardService,
              private router: Router,
              private header: HeaderComponent) { }

  reset = false;
  error = false;
  success = false;
  emptyEmail = false;
  invalidEmail = false;
  emptyPwd = false;
  invalidAuth = false;


  ngOnInit() {
    this.header.ngOnInit();
    $('.text-danger').hide();
    $('#email').on('keydown', function() {
      $('.text-danger').hide();
      $('.alert').hide();
    });
    $('#pwd').on('keydown', function() {
      $('.text-danger').hide();
    });
    this.authGuardService.afAuth.authState.subscribe(a => {
      if (a !== null) {
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    $('.text-danger').hide();
    let email = $("#email").val().trim();
    let password = $("#pwd").val().trim();
    if (email.length < 1) {
      this.emptyEmail = true;
      return;
    }
    if (!this.isValidEmail(email)) {
      this.invalidEmail = true;
      return;
    }
    if (password.length < 1) {
      this.emptyPwd = true;
      return;
    }
    this.authGuardService.login(email, password).then(a => {
      this.authGuardService.items = this.authGuardService.afDB.list('/users/' + a.uid);
      this.router.navigate(['/home']);
    }).catch(a => {
      this.invalidAuth = true;
    });
  }

  resetPwd() {
    this.reset = true;
    $('.text-danger').hide();
    $('.alert').hide();
  }

  cancelReset() {
    this.reset = false;
    $('.text-danger').hide();
    $('.alert').hide();
  }

  sendRecoveryEmail() {
    $('.alert').hide();
    let email = $('#email').val().trim();
    if (email.length < 1) {
      this.emptyEmail = true;
      return;
    }
    if (!this.isValidEmail(email)) {
      this.invalidEmail = true;
      return;
    }
    this.authGuardService.afAuth.auth.sendPasswordResetEmail(email).then(a => {
      this.success = true;
    }).catch(a => {
      this.error = true;
    });
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
