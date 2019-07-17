import { Component, OnInit } from '@angular/core';
import {ApiQuery} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-open-app',
  templateUrl: './open-app.page.html',
  styleUrls: ['./open-app.page.scss'],
})
export class OpenAppPage implements OnInit {

  constructor(
      public api: ApiQuery,
      public router: Router
  ) {
    // this.api.storage.get('user_data').then(data=> {
    //   if(data.user_id) {
    //     this.api.username = data.username;
    //     this.api.data['params'] = 'login';
    //     this.router.navigate(['/home']);
    //   } else {
    //     this.router.navigate(['/login']);
    //   }
    // });
  }

  ngOnInit() {
  }

}
