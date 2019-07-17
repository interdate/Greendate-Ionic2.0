import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiQuery} from "../api.service";

import {SelectModalPage} from "../select-modal/select-modal.page";
import {LoadingController} from "@ionic/angular";
import {Router, NavigationExtras} from "@angular/router";
import {IonContent} from "@ionic/angular";
import {ModalController} from "@ionic/angular";




@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss']
})


export class RegistrationPage implements OnInit {

    @ViewChild(IonContent) content: IonContent;

    usersChooses: any = {};
    form: any = {
        username: {},
        email: {first: {}, second: {}},
        password: {first: {}, second: {}},
        gender: {choices: [[]]},
        birthday: {value: {day: {}, month: {}, year: {}}},
        phone: {},
        agree: {},
        _token: {},
        flow_signUp_step: Number,
    };
  formKeys: any;
  errKeys: any;
   user: {
       region: any,
       username: any,
       email: any,
       email_retype: any,
       area: any,
       neighborhood: any,
       zip_code: any,
       phone: any,
       occupation: any,
       about_me: any,
       looking_for: any
   };

  err:any = {

    username: {errors: []},
    email: {children: {first: {errors: []}, second: {errors: []}}},
    password: {children: {first: {errors: []}, second: {errors: []}}},
    gender: {errors: []},
    birthday: {errors: []},
    phone: {errors: []},
    agree: {errors: []},
    _token: {errors: []},
    flow_signUp_step: {errors: []}
  };



  //user: { username: any, email: any, phone: any, password: any, gender:any, birthday:any, agree:any};
  name: any;
  birth: any;
  allfields = '';

    constructor(
      private api: ApiQuery,
      private router: Router,
      private modalCtrl: ModalController

    ) {


    }


    ngOnInit() {
        this.api.http.post(this.api.url + '/open_api/v2/signs/ups.json', '', this.api.setHeaders(false)).subscribe((data: any) => {
            console.log(data);
            this.formKeys = Object.keys(data.user.form);
            this.form = data.user.form;
            console.log(this.form);
        });

    }


    maxYear() {
        return new Date().getFullYear() - 18;
    }


    async openSelect2(field, fieldTitle) {

            console.log(field);
            const modal = await this.modalCtrl.create({
                component: SelectModalPage,
                componentProps: {
                choices: field.choices,
                title: field.label,
                choseNow: this.usersChooses[fieldTitle]
                }
            });
            await modal.present();

        modal.onDidDismiss().then(data => {
            console.log(data);

            this.form[fieldTitle].value = data.data.value;
            this.usersChooses[fieldTitle] = data.data.label;
            console.log(this.usersChooses);
        });

    }


    getPage(id) {
        let navigationExtras: NavigationExtras = {
            state: {
                id: id
            }
        }
        //alert(id);
        this.router.navigate(['/page'], navigationExtras);
    }


  isObject(val) {
    return typeof val == 'object';
  }


  getKeys(obj){
      return Object.keys(obj);
  }



    formSubmit() {

      //  this.api.showLoad();

        if ( false ) {

            this.allfields = 'יש למלא את כל השדות המסומנים בכוכבית';
            this.api.hideLoad();

            //console.log("name: "+this.form.form.username.value +" email-1: "+ this.form.form.email.first.value +" email-2:  " +this.form.form.email.second.value + " pass-1: "+ this.form.form.password.first.value +" pass-2: "+ this.form.form.password.second.value + " gender: " +this.form.form.gender.value + " birtthday: "+this.form.form.birthday.value);


        } else if(this.form.flow_signUp_step.value==1) {
            this.api.storage.set('user_data', {
                username: this.form.username.value,
                password: this.form.password.first.value
            });

            var date_arr = this.birth.split('-');
            console.log(date_arr);
        }
            var data =  {
                signUpOne: {
                    username: this.form.username.value,
                    email: {
                        first: this.form.email.first.value,
                        second: this.form.email.second.value
                    },
                    password: {
                        first: this.form.password.first.value,
                        second: this.form.password.second.value
                    },
                    gender: this.form.gender.value,
                    birthday: {
                        day: parseInt(date_arr[2]),
                        month: parseInt(date_arr[1]),
                        year: parseInt(date_arr[0])
                    },
                    phone: this.form.phone.value,
                    agree: this.form.agree.value,
                    flow_signUp_instance: this.form.flow_signUp_instance.value,
                    flow_signUp_step: this.form.flow_signUp_step.value,
                    _token: this.form._token.value
                }
            };



            console.log( data);


            this.api.http.post(this.api.url + '/open_api/v2/signs/ups.json', data, this.api.setHeaders() ).subscribe((data: any) => {
                console.log(data);
                if(data.user.form.flow_signUp_step.value == 2) {
                     console.log(123);
                    this.form = data.user.form;
                    console.log(this.form);
                    this.formKeys = this.getKeys(this.form);
                }
                this.api.hideLoad();
            });
        }


    validate(response) {
        console.log('in validate');
        console.log(response);
        if (typeof response.user.form.flow_signUp_step != 'undefined' && response.user.form.flow_signUp_step.value == 2) {
            console.log('in validate if');

        } else {

            this.err = response.user.errors.form.children;
            this.errKeys = Object.keys(this.err);
            this.err.username.errors;
        }

        this.api.hideLoad();
    }





}
