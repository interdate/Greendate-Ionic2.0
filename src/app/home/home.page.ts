import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import {ToastController, Events, ModalController} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {Geolocation } from '@ionic-native/geolocation/ngx'
import {Router, ActivatedRoute} from "@angular/router";
import {IonInfiniteScroll} from "@ionic/angular";
import {IonContent} from "@ionic/angular";




@Component({
  selector: 'page-home',
  styleUrls: ['./home.page.scss'],
  templateUrl: 'home.page.html',
  providers: []
})
export class HomePage implements OnInit{

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public options: { filter: any } = {filter: 1};
  list: any;
  action: any;
  offset: any;
  page_counter: any;
  loader: any = true;
  username: any;
  password: any;
  blocked_img: any = false;
  user_counter: any = 0;
  form_filter: any;
  filter: any = {filter: '', visible: ''};
  users: any;
  texts: any;
  params: any = {action: 'search', filter: 'new', page: 1, list: ''};
  params_str: any;
  scrolling = false;

  constructor(public api: ApiQuery,
              public route: ActivatedRoute,
              public router: Router,
              public geolocation:Geolocation ,
              public events: Events) {

      this.api.pageName = 'home page';
-
    console.log('in home page constructor');
      this.route.queryParams.subscribe(params => {
          console.log(JSON.stringify(params));
          if (params && params.params) {
              this.params_str = params.params;
              this.params = JSON.parse(params.params);
          }

            this.blocked_img = false;
          this.loader = true;

          this.params_str = JSON.stringify(this.params);

          //If Current Page Is "Block" or "Favorited", than remove "Add Favorited";



          if (this.params.list == 'black' || this.params.list == 'favorited') {
              this.blocked_img = true;
          }

          this.page_counter = 1;


          this.getUsers();

          this.getLocation();

      });

  }


        ngOnInit() {
            console.log('in home page ng on init');
        }


  itemTapped(user) {

    if (this.scrolling == false) {
        this.api.data['user'] = user;
      this.router.navigate(['/profile']);
    }
  }

  filterStatus() {
    this.options.filter = this.options.filter === 1 ? 0 : 1;
  }

  toDialog(user) {
    this.api.data['user'] = user;
   this.router.navigate(['/dialog']);
  }

  addLike(user) {

    if (user.isAddLike == false) {

      user.isAddLike = true;
       this.api.toastCreate(' עשית לייק ל' + user.username, 2500);

      let params = JSON.stringify({
        toUser: user.id,
      });

      this.api.http.post(this.api.url + '/api/v2/likes/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
      }, err => {
      });
    } else {

    }
  }

  block(user, bool) {


    let params;

    if (user.isAddBlackListed == false && bool == true) {

      user.isAddBlackListed = true;


      params = {
        list: 'Favorite',
        action: 'delete'
      };

    } else if (user.isAddBlackListed == true && bool == false) {

      user.isAddBlackListed = false;

      params = {
        list: 'BlackList',
        action: 'delete'
      };
    }

    if (this.users.length == 1) {
      this.user_counter = 0;
    }

    // Remove user from list
    this.users.splice(this.users.indexOf(user), 1);
    this.events.publish('statistics:updated');


    this.api.http.post('/api' + this.api.url + '/api/v2/lists/' + user.id, params, this.api.setHeaders(true)).subscribe((data:any) => {
        this.api.toastCreate(data.success, 2500);
    });
  }

  addFavorites(user, bool = false) {

    if (user.isAddFavorite == false) {
      user.isAddFavorite = true;

      var params = JSON.stringify({
        list: 'Favorite'
      });
    } else {
        user.isAddFavorite = false;
        var params  = JSON.stringify({
            list: 'Favorite',
            action: 'delete'
        });
    }


    if ( bool ) {
        this.users.splice(this.users.indexOf(user), 1);
    }
      this.api.http.post(this.api.url + '/api/v2/lists/' + user.id, params, this.api.setHeaders(true)).subscribe((data:any) => {
          this.api.toastCreate(data.success, 2500);
        this.events.publish('statistics:updated');
      });

  }

  sortBy() {
    this.params.filter = this.filter;
    this.params.page = 1;
    this.params_str = JSON.stringify(this.params);
    this.content.scrollToTop(500);
    this.getUsers();
  }

  getUsers() {
     this.api.showLoad();
      this.api.http.post(this.api.url + '/api/v2/users/results',  this.params_str, this.api.setHeaders(true)).subscribe((data:any) => {
          console.log(data);
        this.users = data.users;
        this.texts = data.texts;

        this.user_counter = data.users.length;
        this.form_filter = data.filters;
        this.filter = data.filter;
        if (data.users.length < 10) {
          this.loader = false;
        }
      });
    this.api.hideLoad();
  }

  getLocation() {

     this.geolocation.getCurrentPosition().then(pos => {
     });

  }

  moreUsers(event) {
    if (this.loader) {
        this.page_counter++;
        this.params.page = this.page_counter;
        this.params_str = JSON.stringify(this.params);

        this.api.http.post(this.api.url + '/api/v2/users/results', this.params_str, this.api.setHeaders(true)).subscribe((data:any) => {
            console.log('user data');
            console.log(data);
            if (data.users.length < 10) {
                this.loader = false;
            }
            for (let person of data.users) {
                this.users.push(person);
            }
        });
      event.target.complete();
    }
}


  onScroll(event) {
    this.scrolling = true;
    $('.my-invisible-overlay').show();

  }

  endscroll(event) {
    var that = this;
    setTimeout(function () {
      $('.my-invisible-overlay').hide();
      that.scrolling = false;
    }, 4000);

  }

  ionViewWillEnter() {
      this.api.pageName = 'LoginPage';
  }
}