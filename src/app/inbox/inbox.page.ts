import {Component, OnInit} from '@angular/core';

import {ApiQuery} from '../api.service';

import {Router} from "@angular/router";

/*
 Generated class for the Inbox page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['inbox.page.scss']
})
export class InboxPage implements OnInit{

  users: Array<{ id: string, message: string, username: string, newMessagesNumber: string, faceWebPath: string, noPhoto: string }>;
  texts: { no_results: string };

  constructor(public router: Router,
              public api: ApiQuery) {}

  ngOnInit() {
    this.api.showLoad();

    this.api.pageName = 'InboxPage';
    this.api.http.get(this.api.url + '/api/v2/inbox', this.api.setHeaders(true)).subscribe((data:any) => {
      console.log(data);
      this.users = data.dialogs;
      this.texts = data.texts;
      this.api.hideLoad();
    });
  }

  toDialogPage(user) {
    this.api.data['user'] = user;
    this.router.navigate(['/dialog']);
  }
  deleteDialog(id) {
    alert(id);
  }

}