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
var firebase = require("firebase/app");
require("firebase/storage");
var HomePageComponent = (function () {
    function HomePageComponent(authGuardService, router, headerComponent, fileModal, modalService, firebaseApp) {
        this.authGuardService = authGuardService;
        this.router = router;
        this.headerComponent = headerComponent;
        this.fileModal = fileModal;
        this.modalService = modalService;
        this.firebaseApp = firebaseApp;
        this.storage = firebaseApp.storage();
        this.database = firebaseApp.database();
        this.files = [];
    }
    HomePageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authGuardService.user.subscribe(function (a) {
            if (a === null) {
                _this.router.navigate(['/login']);
            }
            else {
                _this.userId = a.uid;
            }
        });
        jquery_1.default('#menuItems li').each(function () {
            jquery_1.default(this).on('click', function () {
                jquery_1.default('#menuItems li').each(function () {
                    jquery_1.default(this).removeClass('selected');
                });
                jquery_1.default(this).addClass('selected');
            });
        });
        this.headerComponent.ngOnInit();
        this.authGuardService.user.subscribe(function (a) {
            if (a) {
                _this.authGuardService.afDB.list('/users/' + a.uid).subscribe(function (a2) {
                    var data = a2[0];
                    var keys = Object.keys(data);
                    keys.forEach(function (key) {
                        _this.headerComponent.ngOnInit();
                        _this.headerComponent.updateUsername(data[key].name);
                        if (data[key].files) {
                            _this.files = data[key].files.splice("|||");
                        }
                    });
                });
            }
        });
    };
    HomePageComponent.prototype.open = function (customModal) {
        this.modal = this.modalService.open(customModal);
        this.hideErrors();
        jquery_1.default(".progress").hide();
    };
    HomePageComponent.prototype.inputName = function () {
        this.hideErrors();
        jquery_1.default("#fileName").val(jquery_1.default('input[type=file]')[0].files[0].name.replace(".mp3", ""));
    };
    HomePageComponent.prototype.upload = function () {
        var _this = this;
        if (jquery_1.default("#uploadButton").text() === "Upload") {
            this.hideErrors();
            if (!jquery_1.default("input[type=file]")[0].files[0]) {
                jquery_1.default("#errorNoFile").show();
                return;
            }
            var file_1 = jquery_1.default("input[type=file]")[0].files[0];
            var fileName_1 = jquery_1.default("#fileName").val().trim();
            if (fileName_1.length < 1) {
                jquery_1.default("#errorUploadFile").show();
                return;
            }
            if (!this.isUnique(fileName_1)) {
                jquery_1.default("#errorDuplicateFile").show();
                return;
            }
            var uploader_1 = this.storage.ref(this.userId + "/" + fileName_1);
            this.task = uploader_1.put(file_1);
            this.task.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                jquery_1.default("#fileUpload").prop("disabled", true);
                jquery_1.default("#fileName").prop("disabled", true);
                jquery_1.default("#uploadButton").text("Cancel").removeClass("btn-success").addClass("btn-warning");
                jquery_1.default(".progress").show();
                jquery_1.default("#uploaderProgress").css("width", ((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%").
                    removeClass("bg-danger");
                jquery_1.default("#percentageDone").text(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + "%");
            }, function (error) {
                // upload failed
                console.log(error);
            }, function () {
                // upload success
                jquery_1.default("#uploaderProgress").addClass("bg-success");
                jquery_1.default("#percentageDone").text("Uploaded Successfully!");
                jquery_1.default("#uploadButton").hide();
                jquery_1.default("#uploadButton").removeClass("btn-success").addClass("btn-primary");
                uploader_1.getDownloadURL().then(function (a) {
                    var dbHelper = _this.database.ref("/users/" + _this.userId + "/files/" + fileName_1);
                    dbHelper.push({ name: fileName_1, filename: file_1.name,
                        link: a,
                        dateUploaded: new Date().toLocaleString()
                    });
                    _this.files.push(fileName_1);
                    _this.database.ref("/users/" + _this.userId).push({ data: { files: _this.files.join("|||") } });
                });
            });
        }
        else {
            this.task.cancel();
            jquery_1.default("#fileUpload").prop("disabled", false);
            jquery_1.default("#fileName").prop("disabled", false);
            jquery_1.default("#uploadButton").text("Upload").removeClass("btn-warning").addClass("btn-success");
            jquery_1.default(".progress").show();
            jquery_1.default("#uploaderProgress").css("width", "100%").addClass("bg-danger");
            jquery_1.default("#percentageDone").text("Upload Canceled!");
        }
    };
    HomePageComponent.prototype.isUnique = function (file) {
        return true;
    };
    HomePageComponent.prototype.hideErrors = function () {
        jquery_1.default("#errorUploadFile").hide();
        jquery_1.default("#errorDuplicateFile").hide();
        jquery_1.default("#errorNoFile").hide();
    };
    HomePageComponent.prototype.closeModal = function () {
        this.modal.close();
    };
    return HomePageComponent;
}());
HomePageComponent = __decorate([
    core_1.Component({
        selector: 'app-home-page',
        templateUrl: './home-page.component.html',
        styleUrls: ['./home-page.component.css']
    })
], HomePageComponent);
exports.HomePageComponent = HomePageComponent;
