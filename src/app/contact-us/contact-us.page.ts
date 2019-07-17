import {Component, OnInit} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Router} from "@angular/router";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import * as $ from 'jquery';
import {Location} from "@angular/common";
import {Validators, FormControl, FormGroup} from "@angular/forms";

/*
 Generated class for the ContactUs page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-contact-us', 
  templateUrl: 'contact-us.page.html',
  styleUrls: ['contact-us.page.scss'],
  providers: [Keyboard]
})
export class ContactUsPage implements OnInit{

  form:any =  {username: {}, subject: {}, email: {}, _token: {}, text: {}};

  errors: any = {};

  email_err: any;
  user_id: any;
  text_err: any;
  subject_err: any;
  allfields = '';
  public logged_in = false;

  constructor(public api: ApiQuery,
              public router: Router,
              public keyboard: Keyboard,
              public navLocation: Location) {}


  ngOnInit() {
    this.api.pageName = 'ContactUsPage';

    this.api.storage.get('user_data').then(data => {
      if(data.user_id) {
        this.user_id = data.user_id;
        this.logged_in = true;
      }
    });

    this.api.http.get(this.api.url + '/app_dev.php/open_api/contact', this.api.header).subscribe((data:any) => {
      this.form = data.form;
      console.log(data);
    }, err => {
      console.log("Oops!");
    });

  }



  formSubmit() {
    let isValid = true;
    if (this.form.email.value.trim().length < 6 && !this.logged_in) {
      this.errors.email = 'כתובת אימייל לא תקינה';
      isValid = false;
    }
    if( this.form.subject.value.trim() == '' ) {
      this.errors.subject = 'נא להזין נושא פנייה';
      isValid = false;
    }
    if (this.form.text.value.trim() == '' ){
      this.errors.text = 'נה להזין הודעה';
      isValid = false;
    }

    if (isValid) {
      var params = JSON.stringify({
        contact: {
          email: this.user_id ? this.user_id : this.form.form.email.value,
          text: this.form.text.value,
          subject: this.form.subject.value,
          _token: this.form._token.value,
        }
      });

      this.api.http.post(this.api.url + '/open_api/contacts', params, this.api.header).subscribe(data => this.validate(data));
    }

    }



  back() {
    this.keyboard.hide();
    this.navLocation.back();
    setTimeout(function () {
      $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
    }, 500);
  }

  validate(response) {
    this.errors.email= response.errors.form.children.email.errors;
    this.errors.subject = response.errors.form.children.subject.errors;
    this.errors.text = response.errors.form.children.text.errors;

    if (response.send == true) {

      this.form.form.email.value = "";
      this.form.form.text.value = "";
      this.form.form.subject.value = "";

       this.api.toastCreate('ההודעה נשלחה בהצלחה');
    }
  }


}