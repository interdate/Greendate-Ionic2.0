import {Component, ViewChild} from '@angular/core';
import {
    Platform,
    AlertController,
    Events
} from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push } from '@ionic-native/push/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Market } from '@ionic-native/market/ngx';
import {ApiQuery} from './api.service';
import {MenuController} from '@ionic/angular';
import * as $ from 'jquery';
import {Router, NavigationEnd, NavigationExtras} from "@angular/router";
import {IonNav} from "@ionic/angular";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  //providers: [Geolocation, MenuController, Push, Market, Nav, GestureController, TransitionController, DomController, AlertController, Events],


})
export class AppComponent {

  @ViewChild(IonNav) nav: IonNav;

  // make HomePage the root (or first) page
  rootPage: any;
  banner: any;
  menu_items_logout: any;
  menu_items_login: any;
  menu_items: any;
  menu_items_settings: any;
  menu_items_contacts: any;
  menu_items_footer1: any;
  menu_items_footer2: any;

  deviceToken: any;
  activeMenu: string;
  username: any;
  back: string;


  is_login: any = false;
  status: any = '';
  texts: any = {};
  new_message: any = '';
  message: any = {};
  avatar: string = '';
  stats: string = '';
  interval: any = true;

  constructor(public platform: Platform,
              public  menu: MenuController,
              public api: ApiQuery,
              public router: Router,
              private geolocation: Geolocation,
              public alertCtrl: AlertController,
              public events: Events,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public push: Push,
              public market: Market) {



    this.api.http.get(api.url + '/open_api/menu', {}).subscribe((data: any)=> {

      this.initMenuItems(data.menu);

      this.api.storage.get('user_data').then((val) => {
        this.initPushNotification();
        if (!val) {
          this.menu_items = this.menu_items_logout;
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/home']);
          this.menu_items = this.menu_items_login;
          this.getBingo();
          this.api.setHeaders(true, val.username, val.password);
        }
      });

    });


    this.closeMsg();
    var that = this;
    setInterval(function () {
      let page = that.router.url;
      if (page != '/login' && that.api.username === false && that.api.username === null) {
        that.getBingo();
        // New Message Notification
        that.getMessage();
      }

    }, 10000);

    this.initializeApp();
    this.menu1Active(false);

  }

  navigateHome() {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        params: JSON.stringify({
          action: 'search',
          filter: "lastActivity",
        })
      }
    };
    this.router.navigate(['/home'], navigationExtras);
  }


  closeMsg() {
    this.new_message = '';
  }

  /**
   *  Set User's Current Location
   */
  setLocation() {

    this.geolocation.getCurrentPosition().then(pos => {
      var params = JSON.stringify({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      this.api.http.post(this.api.url + '/api/v2/locations', params, this.api.setHeaders(true)).subscribe(data => {
      });
    });
  }

  getStatistics() {
    this.api.http.get(this.api.url + '/api/v2/statistics', this.api.setHeaders(true)).subscribe((data:any) => {

      let statistics = data.statistics;

      // First Sidebar Menu
      this.menu_items[2].count = statistics.newNotificationsNumber;
      this.menu_items[0].count = statistics.newMessagesNumber;
      // Contacts Sidebar Menu
      this.menu_items_contacts[0].count = statistics.viewed;
      this.menu_items_contacts[1].count = statistics.viewedMe;
      this.menu_items_contacts[2].count = statistics.connected;
      this.menu_items_contacts[3].count = statistics.connectedMe;
      this.menu_items_contacts[4].count = statistics.favorited;
      this.menu_items_contacts[5].count = statistics.favoritedMe;
      this.menu_items_contacts[6].count = statistics.blacklisted;
      //Footer Menu
      this.menu_items_footer2[2].count = statistics.newNotificationsNumber;
      this.menu_items_footer2[2].count = 0;
      this.menu_items_footer1[3].count = statistics.newMessagesNumber;
      this.menu_items_footer2[0].count = statistics.favorited;
      this.menu_items_footer2[1].count = statistics.favoritedMe;

      this.bannerStatus();

    }, err => {
      this.clearLocalStorage();
    });
  }


  bannerStatus() {


    if (this.api.pageName == 'DialogPage' || this.api.pageName == 'EditProfilePage'
        //   || this.api.pageName == 'SearchPage' || this.api.pageName == AdvancedSearchPage
        || this.api.pageName == 'Registration' || this.api.pageName == 'ArenaPage'
        || this.api.pageName == 'ChangePhotosPage' || this.api.pageName == 'ProfilePage' || this.is_login == false) {
      $('.link-banner').hide();
    }
    else if (this.api.pageName == 'LoginPage') {
      $('.link-banner').hide();
    } else if (this.api.pageName == 'HomePage') {
      $('.link-banner').show();
    }
    else {
      $('.link-banner').show();
    }

  }


  clearLocalStorage() {
    this.api.setHeaders(false, null, null);
    // Removing data storage
    this.api.storage.remove('status');
    this.api.storage.remove('password');
    this.api.storage.remove('user_id');
    this.api.storage.remove('user_photo');

    // this.nav.push(LoginPage);
    this.router.navigate(['/login']);
  }

  initMenuItems(menu) {

    this.back = menu.back;

    this.stats = menu.stats;

    this.menu_items_logout = [
      {_id: '', icon: 'log-in', title: menu.login, url: '/login', count: ''},
      {_id: 'blocked', icon: '', title: menu.forgot_password, url: '/password-recovery', count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
      {_id: '', icon: 'person-add', title: menu.join_free, url: '/registration', count: ''},
    ];

    this.menu_items = [
      {_id: 'inbox', icon: '', title: menu.inbox, url: '/inbox', count: ''},
      {_id: 'the_area', icon: '', title: menu.the_arena, url: '/arena', count: ''},
      {_id: 'notifications', icon: '', title: menu.notifications, url: '/notifications', count: ''},
      {_id: 'stats', icon: 'stats', title: menu.contacts, url: '/profile', count: ''},
      {_id: '', icon: 'search', title: menu.search, url: '/search', count: ''},
      {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', url: '/faq', count: ''},
    ];

    this.menu_items_login = [
      {_id: 'inbox', icon: '', title: menu.inbox, url: '/inbox', count: ''},
      {_id: 'the_area', icon: '', title: menu.the_arena, url: '/arena', count: ''},
      {_id: 'notifications', icon: '', title: menu.notifications, url: '/notifications', count: ''},
      {_id: 'stats', icon: 'stats', title: menu.contacts, url: '/profile', count: ''},
      {_id: '', icon: 'search', title: menu.search, url: '/search', count: ''},
      {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', url: '/faq', count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
    ];

    this.menu_items_settings = [
      {_id: 'edit_profile', icon: '', title: menu.edit_profile, url: '/edit-profile', count: ''},
      {_id: 'edit_photos', icon: '', title: menu.edit_photos, url: '/change-photos', count: ''},
      {_id: '', icon: 'person', title: menu.view_my_profile, url: '/profile', count: ''},
      {_id: 'change_password', icon: '', title: menu.change_password, url: '/change-password', count: ''},
      {_id: 'freeze_account', icon: '', title: menu.freeze_account, url: '/freeze-account', count: ''},
      {_id: 'settings', icon: 'cog', title: menu.settings, url: '/settings', count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact', count: ''},
      {_id: 'logout', icon: 'log-out', title: menu.log_out, url: '/login', count: ''}
    ];


    this.menu_items_contacts = [
      {_id: 'viewed', icon: '', title: menu.viewed, url: '/home', list: 'viewed', count: ''},
      {
        _id: 'viewed_me',
        icon: '',
        title: menu.viewed_me,
        url: '/home',
        list: 'viewed_me',
        count: ''
      },
      {
        _id: 'contacted',
        icon: '',
        title: menu.contacted,
        url: '/home',
        list: 'connected',
        count: ''
      },
      {
        _id: 'contacted_me',
        icon: '',
        title: menu.contacted_me,
        url: '/home',
        list: 'connected_me',
        count: ''
      },
      {
        _id: 'favorited',
        icon: '',
        title: menu.favorited,
        url: '/home',
        list: 'favorited',
        count: ''
      },
      {
        _id: 'favorited_me',
        icon: '',
        title: menu.favorited_me,
        url: '/home',
        list: 'favorite_me',
        count: ''
      },
      {_id: '', icon: 'lock', title: menu.blocked, url: '/home', list: 'black', count: ''}

    ];
console.log(menu);
    this.menu_items_footer1 = [
      {
        _id: 'online',
        src_img: '../assets/img/icons/online.png',
        icon: '',
        list: 'online',
        title: menu.online,
        url: '/home',
        count: ''
      },
      {
        _id: 'viewed',
        src_img: '../assets/img/icons/the-arena.png',
        icon: '',
        list: 'viewed',
        title: menu.the_arena,
        url: '/arena',
        count: ''
      },
      {
        _id: 'near-me',
        src_img: '',
        title: 'קרוב אלי',
        list: 'distance',
        icon: 'pin',
        url: '/home',
        count: ''
      },
      {
        _id: 'inbox',
        src_img: '../assets/img/icons/inbox.png',
        icon: '',
        list: '',
        title: menu.inbox,
        url: '/inbox',
        count: ''
      },
    ];

    this.menu_items_footer2 = [
      {
        _id: '',
        src_img: '../assets/img/icons/favorited.png',
        icon: '',
        list: 'favorited',
        title: menu.favorited,
        url: '/home',
        count: ''
      },
      {
        _id: '',
        src_img: '../assets/img/icons/favorited_me.png',
        icon: '',
        list: 'favorite_me',
        title: menu.favorited_me,
        url: '/home',
        count: ''
      },
      {
        _id: 'notifications',
        src_img: '../assets/img/icons/notifications_ft.png',
        list: '',
        icon: '',
        title: menu.notifications,
        url: '/notifications',
        count: ''
      },
      {_id: '', src_img: '', icon: 'search', title: menu.search, list: '', url: '/search', count: ''},
    ];
  }


  menu1Active(bool = true) {
    console.log('menu1Active, bool = ' + bool)
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.enable(false, 'menu3');
    if (bool) {
      this.menu.open('menu1');
    }
  }


  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
    this.menu.enable(false, 'menu3');
    this.menu.toggle('menu2');
  }


  menu3Active() {
    this.activeMenu = 'menu3';
    this.menu.enable(false, 'menu1').then(asd => console.log(asd+ 'from 1'));
    this.menu.enable(false, 'menu2').then(asd => console.log(asd+ 'from 2'));
    this.menu.enable(true, 'menu3').then(asd => console.log(asd+ 'from 3'));
    this.menu.open('menu3').then(val => console.log(val + 'from toggle'));
   }


  menuCloseAll() {
    if (this.activeMenu != 'menu1') {
      this.menu.toggle();
      this.activeMenu = 'menu1';
      this.menu.enable(true, 'menu1');
      this.menu.enable(false, 'menu2');
      this.menu.enable(false, 'menu3');
      this.menu.close();
      this.menu.toggle();
    }
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  initPushNotification() {
    //alert(123);
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    let push = this.push.init({
      android: {
        senderID: "72562107329"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    });

    push.on('registration').subscribe((data) => {
      this.deviceToken = data.registrationId;
      this.api.storage.set('deviceToken', data.registrationId);
      this.api.sendPhoneId(data.registrationId);
      //TODO - send device token to server
    });

    push.on('notification').subscribe((data) => {
      let self = this;
      //if user using app and push notification comes
      if (data.additionalData.foreground == false) {
        this.api.storage.get('user_id').then((val) => {
          if (val) {
            // self.nav.push(InboxPage);
          } else {
            //  this.nav.push(LoginPage);
          }
        });

      }
    });
  }


  swipeFooterMenu() {
    console.log('in swipe footer function');
    if ($('.more-btn').hasClass('menu-left')) {
      $('.more-btn').removeClass('menu-left');
      $('.more-btn .right-arrow').show();
      $('.more-btn .left-arrow').hide();

      $('.more-btn').parents('.menu-one').animate({
        'margin-right': '-92%'
      }, 1000);
    } else {
      $('.more-btn').addClass('menu-left');
      $('.more-btn .left-arrow').show();
      $('.more-btn .right-arrow').hide();
      $('.more-btn').parents('.menu-one').animate({
        'margin-right': '0'
      }, 1000);
    }
  }


  removeBackground() {
    $('#menu3, #menu2').find('ion-backdrop').remove();
  }

  getBanner() {
    this.api.http.get(this.api.url + '/open_api/banner', this.api.header).subscribe((data:any) => {
      this.banner = data.banner;
    });
  }

  goTo() {
    window.open(this.banner.link, '_blank');
    return false;
  }
  openPage(page) {
    var logout = false;
    if (page._id == 'logout') {
      this.status = '';
       logout = true;
    }

    if (page._id == 'stats') {
      this.menu3Active();
    } else {
      // close the menu when clicking a link from the menu
      this.menu.close();

      let params = '';

      // navigate to the new page if it is not the current page
      if (page.list == 'online') {
        params = JSON.stringify({
          action: 'online'
        });
      } else if (page.list == 'distance') {
        params = JSON.stringify({
          action: 'search',
          filter: page.list
        });
      }

      else {

        params = JSON.stringify({
          action: 'list',
          list: page.list
        });
      }

       //this.nav.push(page.component, {page: page, action: 'list', params: params});

      let navigationExtras: NavigationExtras = {
        queryParams: {
          params: params,
          page:page,
          action: 'list',
          logout:logout
        }
      };
      this.router.navigate([page.url], navigationExtras);

    }
  }

  getBingo() {
    this.api.storage.get('user_data').then((val) => {

      if (val) {
        this.api.http.get(this.api.url + '/app_dev.php/api/v2/bingo', this.api.setHeaders(true)).subscribe((data: any) => {
          this.api.storage.set('status', this.status);
          this.avatar = data.texts.photo;
          this.texts = data.texts;
          // DO NOT DELETE
          if (this.status != data.status) {
            this.status = data.status;
            this.checkStatus();
          } else {
            this.status = data.status;
          }
          if (data.user) {
            // this.nav.push(BingoPage, {data: data});
            this.api.data[data] = data.user;
            this.router.navigate(['/bingo']);

            this.api.http.get(this.api.url + '/app_dev.php/api/v2/bingo?likeMeId=' + data.user.id, this.api.setHeaders(true)).subscribe(data => {
            });
          }
        });
      }
    });
  }

  dialogPage() {
    let user = {id: this.new_message.user_id};
    this.closeMsg();
    // this.nav.push(DialogPage, {user: user});
   // this.api.data[user] = user;
    this.router.navigate(['/dialog']);
  }

  getMessage() {
    this.api.http.get(this.api.url + '/api/v2/new/messages', this.api.setHeaders(true)).subscribe((data: any) => {

      if ((this.new_message == '' || typeof this.new_message == 'undefined') && !(this.api.pageName == 'DialogPage')) {
        this.new_message = data.messages[0];
        if (typeof this.new_message == 'object') {
          this.api.http.get(this.api.url + '/api/v2/messages/notify?message_id=' + this.new_message.id, this.api.setHeaders(true)).subscribe(data => {
          });
        }
      }

      this.message = data;

      this.menu_items[2].count = data.newNotificationsNumber;
      this.menu_items[0].count = data.newMessagesNumber;
      this.menu_items_footer2[2].count = data.newNotificationsNumber;
      this.menu_items_footer1[3].count = data.newMessagesNumber;
    });
  }

  checkStatus() {
    if (!(this.api.pageName == 'ActivationPage') && !(this.api.pageName == 'ContactUsPage') && !(this.api.pageName == 'ChangePhotosPage') && !(this.api.pageName == 'Registration')
        && !(this.api.pageName == 'PagePage')) {
      if (this.status == 'no_photo') {

        if (this.texts.photoMessage) {
          this.api.toastCreate(this.texts.photoMessage);
        }

        // this.nav.push(RegistrationFourPage);
      } else if (this.status == 'not_activated') {
        //  this.nav.push(ActivationPage);
        //this.router.navigate(['/activate']);
      }
    }
    if (((this.api.pageName == 'ActivationPage') && this.status == 'login')) this.router.navigate(['/home']);

  }

  async alert(title, subTitle) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: subTitle,
      buttons: ['אישור']
    });
    await alert.present();
  }

  getAppVersion() {
    this.api.http.get(this.api.url + '/open_api/version', this.api.header).subscribe(data => {

      // if (this.platform.is('cordova')) {
      //   this.appVersion.getVersionNumber().then((s) => {
      //     if (data != s) {
      //       window.open('market://details?id=com.nyrd', '_system');
      //     } else {
      //       alert('else of getAppVersion(data = s)');
      //     }
      //   })
      // }
    });
  }


  ngAfterViewInit(){

    $('.footerMenu').show();
    this.router.events.subscribe((val) => {
      if(val instanceof  NavigationEnd) {

        console.log('after view init run');
        this.getBanner();
        // this.getAppVersion();

        this.events.subscribe('statistics:updated', () => {
          //alert('stat upd event');
          // user and time are the same arguments passed in `events.publish(user, time)`
          this.getStatistics();
        });


        if (this.api.pageName == 'HomePage') {
          if (this.api.status != '') {
            this.status = this.api.status;
          }
          this.setLocation();
        }

        let el = this;
        window.addEventListener('native.keyboardshow', function () {

          this.keyboard.disabledScroll(true);

          $('.link-banner').hide();
          $('.footerMenu, .back-btn').hide();
          $('.back-btn').hide();


          if (this.api.pageName == 'DialogPage') {
            $('.banner').hide();

            setTimeout(function () {
              $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
              $('.form-dialog').css({'margin-bottom': '-20px'});
            }, 200);
          } else {
            $('.banner').show();
            setTimeout(function () {
              $('.scroll-content, .fixed-content').css({'margin-bottom': '0px'});
            }, 200);

          }

        });

        window.addEventListener('native.keyboardhide', function () {

          $('.footerMenu, .back-btn').show();

          this.bannerStatus();

          if (el.api.pageName == 'DialogPage') {
            $('.back-btn').show();
            $('.footerMenu').hide();
            setTimeout(function () {
              $('.scroll-content, .fixed-content').css({'margin-bottom': '115px'});
              $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
              // el.content.scrollTo(0, 999999, 300);
            }, 600);
          } else {
            $('.footerMenu, .back-btn').show();
            setTimeout(function () {
              $('.scroll-content, .fixed-content').css({'margin-bottom': '0px'});
            }, 500);
          }

        });

        if (el.api.pageName == 'LoginPage') {
          clearInterval(this.interval);
          this.interval = false;
          this.avatar = '';
        }
        if (el.api.pageName == 'HomePage' && this.interval == false) {
          $('.link-banner').show();
          this.interval = true;
          this.getBingo();
        }

        this.api.setHeaders(true);

        this.api.storage.get('user_data').then((val) => {
          if (this.status == '') {
            this.status = val.status;
          }
          this.checkStatus();
          if (!val.status) {
            console.log('!val');
            this.menu_items = this.menu_items_logout;
            this.is_login = false
          } else {
            console.log('val');
            this.is_login = true;
            this.menu_items = this.menu_items_login;
            this.getStatistics();
          }

          if (el.api.pageName == 'HomePage') {
            $('.link-banner').show();
          }

          if (el.api.pageName == 'LoginPage') {
            $('.link-banner').hide();
          }
          this.bannerStatus();

        });


      } //this.username = this.api.username;


    });


  }
}