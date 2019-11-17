import { Component, OnInit } from '@angular/core';
import {ApiQuery} from '../api.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  page:any;

  constructor(public api: ApiQuery) {
    this.api.http.get(api.url + '/app_dev.php/api/v2/user/subscribe', this.api.setHeaders(true)).subscribe((data: any) => {
      this.page = data;
    });
  }

  ngOnInit() {
  }

  subscribe(payment) {
    window.open(this.page.url + '&payPeriod=' + payment.period + '&prc=' + btoa(payment.amount), '_blank');
    return false;
  }

  ionViewWillEnter() {
    this.api.pageName = 'SubscriptionPage';
  }
}
