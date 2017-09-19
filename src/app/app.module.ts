import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from '../shared/header/header.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import {RouterModule} from "@angular/router";
import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AuthGuardService} from "../services/auth-guard.service";
import { HomePageComponent } from './home-page/home-page.component';
import { FilesListComponent } from '../shared/files-list/files-list.component';
import { FileInsertModalComponent } from '../shared/file-insert-modal/file-insert-modal.component';
import {NgbModal, NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {NgbModalStack} from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";

export const firebaseConfig = {
  apiKey: "AIzaSyBBmvxKIyXz_SnNqKIQljm2kbl1AeZZgrE",
  authDomain: "audio-note-pro.firebaseapp.com",
  databaseURL: "https://audio-note-pro.firebaseio.com",
  storageBucket: "audio-note-pro.appspot.com",
  messagingSenderId: "1014839766664"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    SignupPageComponent,
    HomePageComponent,
    FilesListComponent,
    FileInsertModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo:'/login' ,pathMatch: 'full'},
      { path: 'login', component: LoginPageComponent },
      { path: 'signup', component: SignupPageComponent},
      { path: 'home', component: HomePageComponent}
    ]),
    FormsModule,
    HttpModule,
    NgbModalModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthGuardService, HeaderComponent, FileInsertModalComponent, NgbModal, NgbModalStack],
  bootstrap: [AppComponent]
})
export class AppModule { }
