

import {Storage} from '@ionic/storage';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';
import { Injectable } from '@angular/core';
//import {RequestOptions} from "@angular/http";
import {LoadingController,ToastController} from '@ionic/angular';
import {SelectModalPage} from "./select-modal/select-modal.page";
import {httpFactory} from "@angular/http/src/http_module";
import {HttpRequest} from "@angular/common/http";





@Injectable({
  providedIn: 'root'
})
export class ApiQuery {

  data:{} = {};

  public url: any;
  public headers: any;
  public response: any;
  public username: any = 'noname';
  public password: any = 'nopass';
  public header: any;
  public status: any = '';
  public back: any = false;
  public storageRes: any;
  public footer: any;
  public pageName: any =false;
  public loading: any;
  public usersChooses: any = {};

  public signupData: {  username: any, password: any };
    isLoading = false;
  constructor(public storage: Storage,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public http: HttpClient,
              private sanitizer: DomSanitizer) {


    //this.url = 'http://localhost:8100';
    this.url = 'https://www.greendate.co.il';
    this.footer = true;

  }

  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
    //return this.sanitizer.bypassSecurityTrustScript(html);
  }

  sendPhoneId(idPhone) {
    //alert(idPhone);
    let data = JSON.stringify({phone_id: idPhone});
    this.http.post(this.url + '/api/v2/phones', data ,this.setHeaders(true)).subscribe(data => {
      //alert(data.json().success);
    });
  }

  setUserData(data) {
    this.setStorageData({label: 'username', value: data.username});
    this.setStorageData({label: 'password', value: data.password});
  }


  setStorageData(data) {
    this.storage.set(data.label, data.value);
  }

  getStorageData(data) {
    /*
     this.storage.get(data).then((res) => {
     console.log(this.storageRes);
     this.storageRes = res;
     });
     setTimeout(function(){
     console.log(this.storageRes);
     return this.storageRes;
     },2000);
     */
  }


  async toastCreate(mess, duration = 600000) {
    const toast = await this.toastCtrl.create({
      message: mess,
      showCloseButton: true,
      closeButtonText: 'אישור',
      duration: duration
    });
    await toast.present();
  }

    async showLoad(text = 'אנה המתן...'){
        this.isLoading = true;
        return await this.loadingCtrl.create({
            message: text,
        }).then(a => {
            a.present().then(() => {
                 if (!this.isLoading) {
                    a.dismiss();
                }
            });
        });
    }

    async hideLoad() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss();
    }



  setHeaders(is_auth = false, username = '', password = '') {



    if (username !== ''){
      this.username = decodeURIComponent(username);
    }
    if (password !== ''){
      this.password = decodeURIComponent(password);
    }



    let myHeaders: HttpHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');



    if (is_auth == true) {
        //myHeaders = myHeaders.append("Authorization", "Basic " +  /*'YWRtaW46cG9pcXdlMTI='*/ btoa(this.username + ':' + this.password));
      myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
    }
    this.header = {
        headers: myHeaders
    };
    return this.header;
  }



  ngAfterViewInit() {

    this.storage.get('user_id').then((val) => {
      this.storage.get('username').then((username) => {
        this.username = username;
      });
      this.storage.get('password').then((password) => {
        this.password = password;
      });
    });
  }
}