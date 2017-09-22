import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Injectable } from '@angular/core';
import { FirebaseApp } from "angularfire2";

@Injectable()
export class FilesService {
  userId;
  items: FirebaseListObservable<any[]>;
  database;

  constructor(public afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase,
              public firebaseApp: FirebaseApp) {
    this.items = afDB.list('/users', {
    });
    this.afAuth.authState.subscribe(a => {
      this.userId = a.uid;
    });
    this.database = firebaseApp.database();
  }

  updateFile(file) {
    let secretKey;
    this.afDB.list("/users/" + this.userId + "/files/" + file.id).subscribe(a => {
      let keys = Object.keys(a);
      secretKey = a[keys[0]].$key;
    });
    let db = this.database.ref("/users/" + this.userId + "/files/" + file.id + "/" + secretKey);
    db.update(file);
  }
}

export class ANFile {
  public id;
  public link;
  public name;
  public notes;
  public bookmark;
  public type;
  public dateUploaded;
  public modifiedOn;

  constructor(){
  }

  public deserialize(json) {
    this.id = json.id;
    this.name = json.name;
    this.link = json.link;
    this.bookmark = json.bookmark;
    this.notes = json.notes;
    this.type = json.type;
    this.dateUploaded = json.dateUploaded;
    this.modifiedOn = json.modifiedOn;
  }

}
