import {Component, ViewChild, OnInit} from '@angular/core';
import { Events} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {IonSlides} from "@ionic/angular";
/*
 Generated class for the Arena page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-arena',
  templateUrl: 'arena.page.html',
  styleUrls: ['arena.page.scss']
})
@Injectable()
export class ArenaPage implements OnInit{

  @ViewChild(IonSlides) slides: IonSlides;

  users: Array<{ id: string, username: string, photo: string, age: string, area: string, image: string }>;

  texts: { like: string, add: string, message: string, remove: string, unblock: string, no_results: string  };
  notifications: any;
  checkNotifications: any;
  user:any;
  index:any;
  constructor(public events: Events,
              public router: Router,
              public api: ApiQuery) {}



  ngOnInit() {

    this.api.showLoad();
    this.api.pageName = 'ArenaPage';
    let user_id = this.api.data['user'] ? this.api.data['user'] : false;

    let params = JSON.stringify({
      action: 'arena',
      user_id: user_id
    });

    this.api.http.post(this.api.url + '/api/v1/users/results', params, this.api.setHeaders(true)).subscribe((data:any) => {
      console.log(data);
      this.users =  data.users;
      this.texts =  data.texts;
      this.api.hideLoad();

      // If there's message, than user can't be on this page
      if (data.arenaStatus) {
        this.api.toastCreate(data.arenaStatus);
        this.router.navigate(['/change-photo']);
      }
    });
  }

  setNotifications() {
    this.events.subscribe('user:created', (notifications) => {
      console.log('Welcome', notifications, 'at');
      this.notifications = notifications;
    });
  }

  goToSlide(str) {
  //   this.slides.getActiveIndex().subscribe(index => {
  //     var user = this.users[this.slides[index]];
  //     var index = this.slides.index;
  //   });
  //
  //
  //
  //   if (str == 'like') {
  //
  //     let params = JSON.stringify({
  //       toUser: user.id,
  //     });
  //
  //     this.api.http.post(this.api.url + '/api/v1/likes/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
  //
  //     });
  //
  //     this.users.splice(index, 1);
  //     this.slides.slideTo(index,1);
  //
  //   } else {
  //
  //
  //     if (this.slides.isEnd()) {
  //       this.slides.slideNext();
  //       var that = this;
  //       setTimeout(function () {
  //       this.slides.slideTo(0,1);
  //       this.slides.update();
  //       }, 10);
  //     } else {
  //       this.slides.slideNext();
  //     }
  //   }
  }






  slideChanged(event) {
    // if(this.slides.getActiveIndex() == 1){
    //   console.log(this.users[this.slides.getActiveIndex()]);
    //
    //   console.log(this.slides.getActiveIndex());
    // }
  }

  toDialog() {
    // let user = this.users[this.slides.getActiveIndex()];
    // this.api.data['user'] = user;
    // this.router.navigate(['/dialog']);
  }

  toProfile() {
    // let user = this.users[this.slides.getActiveIndex()];
    // this.api.data['user'] = user;
    // this.router.navigate(['/profile']);
  }

  toNotifications() {
    //this.navCtrl.push(NotificationsPage);
    this.router.navigate(['/notification']);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ArenaPage');
  }


  ionViewDidEnter() {
    //this.slides.update();
  }

}