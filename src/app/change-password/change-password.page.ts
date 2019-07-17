import {Component} from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import {ApiQuery} from '../api.service';

import * as $ from 'jquery'

/*
 Generated class for the ChangePassword page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.page.html',
  styleUrls: ['change-password.page.scss'],
  providers: [HTTP]
})
export class ChangePasswordPage {

  form: { form: any } = {form: {oldPassword: {}, password: {second: {}, first: {}}, email: {}, _token: {}, text: {}}};
username = 'vita@interdate-ltd.co.il';
  password = '1111111';
  oldPassword: any;
  first_pass: any;
  second_pass: any;

  constructor(public api: ApiQuery,
              public http: HTTP
                ) {

    this.api.http.post(api.url + '/api/v2/passwords', '', api.header).subscribe((data:any) => {
      this.form = data;
      console.log(data);
    }, err => {
      console.log("Oops!");
    });
  }

  formSubmit(form) {
    this.oldPassword = this.first_pass = this.second_pass ='';
    console.log(form);
    let isValid = true;
    if (this.form.form.oldPassword.value.length < 7) {
      this.oldPassword = 'סיסמה ישנה לא נכונה';
      isValid = false;
    }
    if (this.form.form.password.first.value.length < 7) {
      this.first_pass = 'הסיסמה החדשה צריכה להכיל לפחות 7 תווים';
      isValid = false;
    }
    if ( this.form.form.password.second.value !== this.form.form.password.first.value) {
      this.second_pass = 'סיסמאות לא תואמות';
      isValid = false;
    }
    if (isValid) {


      var params = JSON.stringify({
        changePassword: {
          _token: this.form.form._token.value,
          oldPassword: this.form.form.oldPassword.value,
          password: {
            first: this.form.form.password.first.value,
            second: this.form.form.password.second.value
          },

        }
      });

      //
      // const headers = {
      // 'Content-type': 'application/json',
      // 'Accept': '*/*',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'POST',
      //  "Authorization": "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password))
      // };


      this.http.post(this.api.url + '/api/v2/passwords', params, this.api.header).then(data=>console.log(data));
    }
  }

  validate(response:any) {
    this.oldPassword = response.errors.form.children.oldPassword.errors;
    this.first_pass = response.errors.form.children.password.children.first.errors;
    this.second_pass = response.errors.form.children.password.children.second.errors;

    console.log(this);


    if (response.changed == true) {

      this.api.setStorageData({label: 'password', value: this.form.form.password.first.value});
      this.api.setHeaders(true, '', this.form.form.password.first.value);

      this.form.form.password.first.value = "";
      this.form.form.password.second.value = "";
      this.form.form.oldPassword.value = "";

  this.api.toastCreate('סיסמה עודכנה בהצלחה');
    } else {
      this.form.form = response.form;
    }
  }



  ionViewWillEnter() {
    this.api.pageName = 'ChangePasswordPage';
    console.log(this.api.pageName);
  }
}