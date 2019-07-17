import {Component, ViewChild, OnInit} from '@angular/core';
import {IonContent} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import * as $ from 'jquery';
//declare var $: any;

@Component({
  selector: 'page-dialog',
  templateUrl: 'dialog.page.html',
  styleUrls: ['dialog.page.scss']
})

export class DialogPage implements OnInit{
  @ViewChild(IonContent) content: IonContent;

  user: { id: string, isOnline: string, nick_name: string, image: string ,gender: string};
  users: Array<{ id: string, isOnline: string, nick_name: string, image: string }>;
  texts: any = {a_conversation_with: '', title: '', photo: ''};
  message: any;
  messages: Array<{ id: string, isRead: any, text: string, dateTime: string, from: any }>;
  checkChat: any;
  notReadMessage: any = [];
  //keyboard: Keyboard;

  constructor(public api: ApiQuery,
              public router: Router,
              public navLocation: Location) {}


  ngOnInit() {

    this.api.back = false;
   // this.user = navParams.get('user');
    this.user = this.api.data['user'];
    console.log(this.user);

    this.api.http.get(this.api.url + '/api/v2/dialogs/' + this.user.id, this.api.setHeaders(true)).subscribe((data:any) => {
      console.log('data from dialog ' + data);
      this.user = data.dialog.contact;
      this.texts = data.texts;
      this.messages = data.history;
      for (let i = 0; i < this.messages.length; i++) {
        if(this.messages[i].isRead == false) {
          this.notReadMessage.push(this.messages[i].id);
        }
      }
      let that = this;
      setTimeout(function () {
        that.scrollToBottom();
      },300)
    }, err => {
      console.log("Oops!");
    });

  }

  scrollToBottom() {
    this.content.scrollToBottom(300).then(asd=> console.log(asd));
  }


  back() {
    $('.footerMenu').show();
    setTimeout(function () {
      $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
    }, 500);

    this.api.back = true;
    this.navLocation.back();
  }

  sendPush() {
    this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/pushes', {}, this.api.setHeaders(true)).subscribe(data => {});
  }

  sendMessage() {

    var params = JSON.stringify({
      message: this.message
    });

    this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe((data:any) => {
      let mess = data.message;
      console.log(data.message);
      if (mess) {
        mess.text = this.message;
        this.messages.push(mess);
        console.log('this.messages on send mesage ' + this.message);
        this.notReadMessage.push(mess.id);
        this.sendPush();
          this.message = '';
      } else {
        this.api.toastCreate(data.errorMessage, 5000);
      }

      this.scrollToBottom();
    });

  }

  getNewMessages() {

    var notReadMessageStr = '';

    for (let i = 0; i < this.notReadMessage.length; i++) {
      if(i == 0) {
        notReadMessageStr += '?messages[]=' + this.notReadMessage[i];
      }else {
        notReadMessageStr += '&messages[]=' + this.notReadMessage[i];
      }

    }

    this.api.http.get(this.api.url + '/api/v2/chats/' + this.user.id + '/new/messages' + notReadMessageStr, this.api.setHeaders(true)).subscribe((data:any) => {
      if (data.newMessages.length > 0) {
        for (let message of data.newMessages) {
          this.readMessagesStatus();
          this.messages.push(message);
          this.scrollToBottom();
          var params = JSON.stringify({
            message_id: message.id
          });
          this.api.http.post(this.api.url + '/api/v2/reads/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe((data:any) => {
          });
        }
        //this.messages.push(data.newMessages);
      }
      if(data.readMessages.length > 0){
        let readMess = data.readMessages;
        for (let i = 0; i < this.messages.length; i++) {
          //alert(readMess.indexOf(this.messages[i].id));
          if (readMess.indexOf(this.messages[i].id) != '-1') {

            this.messages[i].isRead = 1;
            this.notReadMessage.splice(this.notReadMessage.indexOf(this.messages[i].id), 1);
          }
        }
      }
    });
  }

  sandReadMessage(){
    var params = JSON.stringify({
      message: 'ok-1990234'
    });

    this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe(data => {
    });
  }

  deleteMessage (id) {
    alert('want delete mess by id ' + id);
  }

  readMessagesStatus() {
    //alert(this.notReadMessage.length);
    if(this.notReadMessage.length > 0) {
      var params = JSON.stringify({
        messages: this.notReadMessage
      });

      this.api.http.post(this.api.url + '/api/v2/checks/messages', params, this.api.setHeaders(true)).subscribe(data => {

        for (let i = 0; i < this.messages.length; i++) {
          //if (data.json().readMessages.indexOf(this.messages[i].id) !== '-1') {
          //this.messages[i].isRead = 1;
          //}
        }
        for (let e = 0; this.notReadMessage.length; e++) {
          //if (data.json().readMessages.indexOf(this.notReadMessage[e]) !== '-1') {
          //delete this.notReadMessage[e];
          //}
        }
      });
    }
  }

  ionViewWillLeave() {
    clearInterval(this.checkChat);
    $('.footerMenu').show();
  }

  toProfilePage() {
    this.api.data['user'] = this.user;
    this.router.navigate(['/profile']);
  }

  ionViewWillEnter() {
    this.api.pageName = 'DialogPage';
    $('.footerMenu').hide();
  }

  ionViewDidLoad() {
    console.log('DIALOG Load');
    this.scrollToBottom();
    var that = this;
    this.checkChat = setInterval(function () {
      that.getNewMessages();
    }, 10000);

    $('button').click(function () {
      $('textarea').val('');
    });

  }
}