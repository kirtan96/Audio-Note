import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Injectable } from '@angular/core';
import { FirebaseApp } from "angularfire2";

@Injectable()
export class AuthGuardService {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;

  constructor(public afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase,
              public firebaseApp: FirebaseApp) {
    this.items = afDB.list('/users', {
    });
    this.user = this.afAuth.authState;
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  signup(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }
}
