import {Component, OnInit} from '@angular/core';
import {ApiQuery} from '../api.service';
import {PagePage} from '../page/page.page';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {ActionSheetController, AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
 /*
 Generated class for the ChangePhotos page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-change-photos',
  templateUrl: 'change-photos.page.html',
  styleUrls: ['change-photos.page.scss'],
  providers: [Camera, FileTransferObject, ImagePicker]

})
export class ChangePhotosPage implements OnInit{

  image: any;
  photos: any;
  imagePath: any;
  username: any;
  password: any;
  new_user: any;

  dataPage: { noPhoto: any, texts: any, photos: Array<{ _id: string, face: string, isValid: string, isMain: string, url: any}> };
  description: any;

  constructor(public actionSheetCtrl: ActionSheetController,
              public api: ApiQuery,
              public router: Router,
              public camera: Camera,
              private transfer: FileTransfer,
              public alertCtrl: AlertController,
              public fileTransfer: FileTransferObject,
              public  imagePicker: ImagePicker){}


  ngOnInit() {
    this.api.pageName = 'ChangePhotosPage';

    this.api.storage.get('user_id').then((val) => {
      this.api.storage.get('username').then(username => {
        this.username = username;
      });
      this.api.storage.get('password').then(password => {
        this.password = password;
      });
    });

    let data = this.api.data;
    this.new_user = data['new_user'] ? data['new_user'] : false;
    this.username = data['username'] ? data['username'] : false;
    this.password = data['password'] ? data['password'] : false;

    this.getPageData();
    this.image = data['images'];
  }


  async delete(photo) {
    let confirm =  await this.alertCtrl.create({
      header: 'האם למחוק את התמונה?',
      message: 'This is an alert message.',
      buttons: ['yes', 'no']
    });
    await confirm.present();
  }


  getCount(num) {
    return parseInt(num) + 1;
  }


  getPageData() {

    this.api.http.get(this.api.url + '/api/v2/photos/json.json', this.api.setHeaders(true)).subscribe((data:any) => {

      this.dataPage = data;
      this.description = data.texts.description;
      this.photos = Object.keys(this.dataPage.photos);
    }, err => {
      console.log("Oops!");
    });
  }


  getPage(id) {
    this.api.data['id'] = id;
    this.router.navigate(['/page']);
  }


  postPageData(type, params) {//not active

    if (type == 'mainImage') {
      console.log('Param', params);
      var data = JSON.stringify({setMain: params.id});

    } else if ('deletePage') {
      var data = JSON.stringify({
        delete: params.id
      });
    }


    this.api.http.post(this.api.url + '/api/v2/photos.json', data, this.api.setHeaders(true, this.username, this.password)).subscribe((data:any) => {

      this.dataPage = data;
      this.photos = Object.keys(this.dataPage.photos);
      console.log(this.photos);
    }, err => {
      console.log("Oops!");
    });
  }



   edit(photo) {
  //
  //   let mainOpt = [];
  //
  //   console.log(photo);
  //   if (!photo.isMain && photo.isValid) {
  //
  //     mainOpt.push({
  //           text: this.dataPage.texts.set_as_main_photo,
  //           icon: 'contact',
  //           handler: () => {
  //             this.postPageData('mainImage', photo);
  //           }
  //         }
  //     );
  //   }
  //   mainOpt.push({
  //     text: this.dataPage.texts.delete,
  //     role: 'destructive',
  //     icon: 'trash',
  //     handler: () => {
  //       this.delete(photo);
  //     }
  //   });
  //   mainOpt.push({
  //     text: this.dataPage.texts.cancel,
  //     role: 'destructive',
  //     icon: 'close',
  //     handler: () => {
  //       console.log('Cancel clicked');
  //     }
  //   });
  //
  //
  //   var status = photo.isValid ?
  //       this.dataPage.texts.approved : this.dataPage.texts.waiting_for_approval;
  //
  //   this.lightSheet(mainOpt);
   }

  async lightSheet(mainOpt = []) {
    let actionSheet = await this.actionSheetCtrl.create({
      header: 'ערוך תמונה',

      subHeader: this.dataPage.texts.status + ': ' + status,

      buttons: mainOpt
    });
   await actionSheet.present();
  }

 //  async add() {
 //
 //    let actionSheet = await this.actionSheetCtrl.create({
 //      title: this.dataPage.texts.add_photo,
 //      buttons: [
 //        {
 //          text: this.dataPage.texts.choose_from_camera,
 //          icon: 'aperture',
 //        }, {
 //          text: this.dataPage.texts.choose_from_gallery,
 //          icon: 'photos',
 //        }, {
 //          text: this.dataPage.texts.cancel,
 //          role: 'destructive',
 //          icon: 'close',
 //        }
 //      ]
 //    });
 // await actionSheet.present();
 //  }


  openGallery() {

    let options = {
      maximumImagesCount: 1,
      width: 600,
      height: 600,
      quality: 100
    };

    this.imagePicker.getPictures(options).then(
        (file_uris) => {
          this.uploadPhoto(file_uris[0]);
        },

        (err) => {
          console.log('uh oh')
        }
    );
  }


  openCamera() {
    let cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 600,
      targetHeight: 600,
      saveToPhotoAlbum: true,
      chunkedMode: true,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.uploadPhoto(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  safeHtml(el): any {
    let html = this.description;
    let div: any = document.createElement('div');
    div.innerHTML = html;
    [].forEach.call(div.getElementsByTagName("a"), (a) => {
      var pageHref = a.getAttribute('click');
      if (pageHref) {
        a.removeAttribute('click');
        a.onclick = () => this.getPage(pageHref);
      }
    });
    if(el.innerHTML == '') {
      el.appendChild(div);
    }
  }

  uploadPhoto(url) {

  this.api.showLoad();

    this.api.storage.get('user_id').then((val) => {

      let options = {
        fileKey: "photo",
        fileName: 'test.jpg',
        chunkedMode: false,
        mimeType: "image/jpg",
        headers: {Authorization: "Basic " + btoa(encodeURIComponent(this.username) + ":" + this.password)}/*@*/
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      fileTransfer.upload(url, this.api.url + '/api/v1/photos.json', options).then((entry) => {

       // this.navCtrl.push(ChangePhotosPage, {});
        this.router.navigate(['change-photo']);
        this.api.hideLoad();
      }, (err) => {
        this.api.hideLoad();
      });
    });

  }

  onHomePage() {
    this.router.navigate(['/home']);
  }


}
