import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import 'rxjs/add/operator/catch';
import {HttpHeaders} from "@angular/common/http";
import {Router, ActivatedRoute} from "@angular/router";

import * as $ from 'jquery';
import {Events} from "@ionic/angular";

//import { MyApp } from '../app/app.component';
/*
 Generated class for the Login page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: []
})
export class LoginPage implements OnInit{

  form: { errors: any, login: any } = {errors: {}, login: {username: {label: ''}, password: {label: ''}}};
  errors: any;
  header:any;
  user: any = {id: '', name: ''};
  logout: any = false;

  constructor(
              public api: ApiQuery,
              public router:Router,
              public events: Events,
              public route: ActivatedRoute,
              public toastCtrl: ToastController) {
    this.api.showLoad();
  }

  ngOnInit() {
    this.api.hideLoad();
    this.api.http.get(this.api.url + '/open_api/login', this.api.header).subscribe((data:any) => {
      this.form = data;
      this.api.storage.get('username').then((username) => {
        this.form.login.value = username;
        this.user.name = username;
      });

    });

    this.route.queryParams.subscribe((params: any) => {
      console.log(JSON.stringify(params));
      this.logout = params.logout;
    });

    //if (typeof this.router.getCurrentNavigation().extras.state != 'undefined' && this.router.getCurrentNavigation().extras.state.page._id == "logout") {
    if( this.logout){
      console.log('in logout functioin');
      this.api.setHeaders(false, null, null);
      this.api.storage.remove('user_data').then(asd => console.log(asd));
    }
  }

  formSubmit() {
    this.form.login.username.value = this.user.name;

    this.api.http.post(this.api.url + '/open_api/v2/logins.json','', this.setHeaders()).subscribe(data => {

      setTimeout(function(){
        this.errors = 'משתמש זה נחסם על ידי הנהלת האתר';
      },300)

      this.validate(data);

    }, err => {

      console.log(this.form.errors);

      if(this.form.errors.is_not_active) {
        this.errors = 'משתמש זה נחסם על ידי הנהלת האתר';
      }else{
        this.errors = this.form.errors.bad_credentials;
      }
    });
  }

  setHeaders() {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('username', this.form.login.username.value);
    myHeaders = myHeaders.append('password', this.form.login.password.value);
    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');


    console.log(this.form.login.password.value);
    console.log(this.form.login.username.value);

    let header = {
      headers: myHeaders
    };
    return header;
  }

  validate(response) {
console.log('in validate', response);
    if (response.status != "not_activated") {
      this.api.storage.set('user_data', {
        'username': this.form.login.username.value,
        'password': this.form.login.password.value,
        'status': response.status,
        'user_id': response.id,
        'user_photo': response.photo
      });

      this.events.publish('status:login');

      this.api.setHeaders(true, this.form.login.username.value, this.form.login.password.value);
    }
    if (response.status == "login") {




      this.api.data['params'] = 'login';
      this.router.navigate(['/home']);

    } else if (response.status == "no_photo") {
      this.user.id = response.id;

  this.api.toastCreate('אישןר');

    } else if (response.status == "not_activated") {
      this.api.toastCreate('אישור');
      this.router.navigate(['/login']);
    }
    this.api.storage.get('deviceToken').then((deviceToken) => {
      console.log(deviceToken);
      this.api.sendPhoneId(deviceToken);
    });

    console.log(response.status);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  ionViewWillLeave() {
    this.api.footer = true;
    console.log('login page will liiv');
    $('.footerMenu').show();

  }


  ionViewWillEnter() {
    console.log('login page will enter');
    this.api.pageName = 'LoginPage';
    $('.footerMenu').hide();
  }

}