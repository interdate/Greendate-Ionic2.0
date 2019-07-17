import {Component, ViewChild} from '@angular/core';
import {ApiQuery} from '../api.service';
import {IonContent} from "@ionic/angular";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

/*
 Generated class for the Profile page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var $: any;


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  @ViewChild(IonContent) content: IonContent;


  isAbuseOpen: any = false;
  isAbout: boolean = false;

  // user: { id: any, type: any, username: any, music: any, isAddBlackListed: any, about: { label: any }, photos: any, photo: any, url: any, } = {
  //   id: '',
  //   isAddBlackListed: false,
  //   music: '',
  //   username: '',
  //   about: {label: ''},
  //   photos: '',
  //   type: '',
  //   photo: '',
  //   url: ''
  // };
  user:any = {
    isAddBlackListed:  false
};
  texts: { lock: any, unlock: any } = {lock: '', unlock: ''};

  formReportAbuse: { title: any, buttons: { cancel: any, submit: any }, text: { label: any, name: any, value: any } } =
  {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

  myId: any = false;

  constructor(public api: ApiQuery,
              public navLocation: Location,
              public router: Router) {

    

    this.api.showLoad();
    
    let user = this.api.data['user'];

    if (user) {

      this.user = user;
        this.getUesr();
        this.api.hideLoad();
    } else {
     this.api.storage.get('user_data').then((val) => {

        if (val.user_id) {
          this.myId = val.user_id;
          this.user.id = val.user_id;
          this.getUesr();
          }
        });
        this.api.hideLoad();
    }
  }

    getKeys(obj){

        return Object.keys(obj);

    }
  getUesr(){
      this.api.http.get(this.api.url + '/api/v2/users/' + this.user.id, this.api.setHeaders(true)).subscribe((data:any)=> {
          console.log(data);
          this.user = data;
          this.formReportAbuse = data.formReportAbuse;
          this.texts = data.texts;

      });
  }


    moreAbout() {
      return  this.isAbout = this.isAbout ? false : true;
        alert(this.isAbout);

    }

  back() {
    this.navLocation.back();
  }

  scrollToBottom() {
   // this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 300);
  }

  addFavorites(user) {
    user.isAddFavorite = true;


    let params = JSON.stringify({
      list: 'Favorite',
    });

   this.api.http.post(this.api.url + '/api/v1/lists/' + user.id, params, this.api.setHeaders(true)).subscribe((data:any) => {
      console.log(data);
     this.api.toastCreate(data.success);
    });
  }

  blockSubmit() {
    if (this.user.isAddBlackListed == true) {
      this.user.isAddBlackListed = false;
      var action = 'delete';
    } else {
      this.user.isAddBlackListed = true;
      var action = 'create';
    }


    let params = JSON.stringify({
      list: 'BlackList',
      action: action
    });

   this.api.http.post(this.api.url + '/api/v1/lists/' + this.user.id, params, this.api.setHeaders(true)).subscribe((data:any) => {
     this.api.toastCreate(data.success);
    });
  }

  addLike(user) {
    user.isAddLike = true;
    this.api.toastCreate(' עשית לייק ל' + user.username);

    let params = JSON.stringify({
      toUser: user.id,
    });

   this.api.http.post(this.api.url + '/api/v1/likes/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
      console.log(data);
    }, err => {
      console.log("Oops!");
    });

  }

  fullPagePhotos() {
    this.api.data['user'] = this.user;
    this.router.navigate(['full-screen-profile']);
  }

  toDialog(user) {

    this.api.data['user'] = user;
    this.router.navigate(['/dialog']);
  }

  reportAbuseShow() {
    this.isAbuseOpen = true;
    this.scrollToBottom();
  }

  reportAbuseClose() {
    this.isAbuseOpen = false;
    this.formReportAbuse.text.value = "";
  }

  abuseSubmit() {

    let params = JSON.stringify({
      text: this.formReportAbuse.text.value,
    });

   this.api.http.post(this.api.url + '/api/v1/reports/' + this.user.id + '/abuses', params, this.api.setHeaders(true)).subscribe((data:any) => {
     this.api.toastCreate(data.success);
    }, err => {
      console.log("Oops!");
    });
    this.reportAbuseClose();
  }



  ionViewDidLoad() {
    console.log(this.user);
  }

  ionViewWillEnter() {
    this.api.pageName = 'ProfilePage';
  }

  ngOnDestroy() {
    this.api.data['user'] = '';
  }

}
