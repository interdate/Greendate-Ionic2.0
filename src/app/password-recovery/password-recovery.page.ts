import {Component, OnInit} from "@angular/core";
import {ToastController} from "@ionic/angular";
import {ApiQuery} from "../api.service";
import {HttpHeaders} from "@angular/common/http";
/*
 Generated class for the PasswordRecovery page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-password-recovery',
    templateUrl: 'password-recovery.page.html',
    styleUrls: ['password-recovery.page.scss']
})
export class PasswordRecoveryPage implements OnInit{

    form: any = {email: {}, _token: {}};

    email_err: any;

    constructor(public api: ApiQuery,
                public toastCtrl: ToastController) {}


    ngOnInit() {

        this.api.http.get(this.api.url + '/open_api/password.json', this.api.header).subscribe((data: any) => {
            this.form = data.form;
        }, err => {
            console.log("Oops!");
        });

    }

    formSubmit() {

        let isValid = true;
        if(this.form.email.value.trim().length < 6) {
            this.email_err = 'כתובת אימייל לא תקינה';
            isValid = false;
        }

        if(isValid) {
            var data = JSON.stringify({
                form: {
                    email: this.form.email.value,
                    _token: this.form._token.value,
                }
            });


            let httpHeaders = new HttpHeaders()
                .set('Accept', '*/*')
                .set('Content-Type', 'applicatioin/json');

            let options = {
                headers: httpHeaders
            };

            this.api.http.post(this.api.url + '/open_api/v2/passwords', data , this.api.setHeaders(false)).subscribe(data => this.validate(data));
            console.log(data);
        }
    }

    validate(response) {

        console.log(response)

        this.email_err = response.errors.form.children.email.errors;
        this.form = response.form;

        if( response.send == true ) {
            this.form.email.value = "";

            this.api.toastCreate(response.success);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordRecoveryPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'PasswordRecoveryPage';
    }



}

