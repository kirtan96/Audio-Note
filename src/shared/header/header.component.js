"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var jquery_1 = require("jquery/dist/jquery");
var HeaderComponent = (function () {
    function HeaderComponent(router, authGuardService) {
        this.router = router;
        this.authGuardService = authGuardService;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        this.page = window;
    };
    HeaderComponent.prototype.logout = function () {
        var _this = this;
        this.authGuardService.logout().then(function (a) {
            _this.router.navigate(['/login']);
        });
    };
    HeaderComponent.prototype.updateUsername = function (name) {
        jquery_1.default("#userName").html(name);
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.css']
    })
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
