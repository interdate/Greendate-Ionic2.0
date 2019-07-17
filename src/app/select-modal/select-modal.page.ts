import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Location} from "@angular/common";

@Component({
  selector: 'app-select-modal',
  templateUrl: 'select-modal.page.html',
  styleUrls: ['./select-modal.page.scss']
})
export class SelectModalPage implements OnInit {



  constructor(
     public modalCtrl: ModalController,
     public navLocation: Location
  ) { }

  choices;
  title;
  choseNow;
  options: any = [];
  page: any = 1;
  count: any = 50;
  opt_add:any = true;
  search: any = false;

  ngOnInit() {
    console.log(this.choices);
    console.log(this.choseNow);
    this.addOption();
  }


  getItem(item) {
    console.log(item);
    this.modalCtrl.dismiss(item);
  }

  close() {
    this.modalCtrl.dismiss('');
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.options = this.choices;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.opt_add = false;
      this.options = this.options.filter((item) => {
        return (item.label.indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.opt_add = true;
      this.options = [];
      this.page = 1;
      this.addOption();
    }
  }

  addOption(){
    if(this.opt_add) {
      let start = 0;
      let finish = this.choices.length;
      if (this.page == 1 && finish > this.count) {
        finish = this.count;
      } else {
        start = this.count * (this.page - 1);
        finish = this.count * this.page;
        if (finish > this.choices.length) {
          finish = this.choices.length;
        }
      }
      // if(this.page == 2){
      //   start = 10;
      // }
      //alert(start + ':' + finish);
      let i: any = 0;
      for (let opt of this.choices) {
        //console.log(item);
        //alert(i >= start && i < finish);
        if (i >= start && i < finish) {
          this.options.push(opt);
        }
        i++;
      }
    }
  }

}
