"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AuthGuardService = (function () {
    function AuthGuardService(afAuth, afDB, firebaseApp) {
        this.afAuth = afAuth;
        this.afDB = afDB;
        this.firebaseApp = firebaseApp;
        this.items = afDB.list('/users', {});
        this.user = this.afAuth.authState;
    }
    AuthGuardService.prototype.login = function (email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    };
    AuthGuardService.prototype.logout = function () {
        return this.afAuth.auth.signOut();
    };
    AuthGuardService.prototype.signup = function (email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    };
    return AuthGuardService;
}());
AuthGuardService = __decorate([
    core_1.Injectable()
], AuthGuardService);
exports.AuthGuardService = AuthGuardService;
