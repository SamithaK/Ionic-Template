import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { APICONFIG } from '../metadata/api-config.metadata';
import { TranslateService } from '@ngx-translate/core';
const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {
  selectedLanguage = ""; // selected language
  loaderToShow: any; // loading controller

  constructor(public alertController: AlertController,private translate: TranslateService,
    public loadingCtrl: LoadingController, public toastController: ToastController, private http: HttpClient) { }

  
    //to show simple alert
    async showSimpleAlert(title, message, buttonText?, callback?, cancelBtn?, cancelBtnCaollBack?) {
      var buttons: any = [
        {
          text: buttonText ? buttonText : "OK",
          handler: callback
        }
      ]
      if (cancelBtn) {
        buttons.push({
          text: "Cancel",
          role: 'cancel',
          handler: cancelBtnCaollBack
        });
      }
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: buttons
      });
      await setTimeout(() => {
        alert.present();
      }, 500);
    }
  
    //loading controller present function
    showLoader(message) {
      this.loaderToShow = this.loadingCtrl.create({
        message: message
      }).then((res) => {
        res.present();
  
        res.onDidDismiss().then((dis) => {
          console.log('Loading dismissed!');
        });
      });
  
    }
  
    //loading controller hide function
    hideLoader() {
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 400);
    }
  
    // toast message function
    async presentToast(message, color?) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        color: color ? color : 'medium'
      });
      setTimeout(() => {
        toast.present();
      }, 100);
    }
  
    // connectivity check
    checkConnectivity(): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.http.get(APICONFIG.BASE_URL + "/users").subscribe((value) => {
          resolve(true)
        }, (error) => {
          reject(false)
        })
      })
    }
  
    // basic search function for string arrays. this will return a filtered array list from main array
    basicSearchFunction(mainArrayList: string[], searchText?: string): string[] {
      // filtering the data by using lodash
      let result = _.filter(mainArrayList, function (element) { return element.toLowerCase().indexOf(searchText.toLowerCase()) > -1 });
      console.log("search results  ", result)
      return result
    }

    setInitialAppLanguage() {
      let language = this.translate.getBrowserLang();
      this.translate.setDefaultLang(language);
      let val = localStorage.getItem(LNG_KEY)
      if (val) {
        this.setLanguage(val);
        this.selectedLanguage = val;
      }
    }
  
    // to get available languages
    getLanguages() {
      return [
        { text: 'English', value: 'en', img: 'assets/imgs/en.png' }
      ];
    }
  
    // setting langange Function
    setLanguage(lng) {
      this.translate.use(lng);
      this.selectedLanguage = lng;
      localStorage.setItem(LNG_KEY, lng);
    }
  
    // get text with current langauge
    convertToCurrentLan(text: string) {
      let converText: string = ""
      this.translate.get(text).subscribe((val) => {
        console.log("converted text ", val)
        converText = val
      })
      return converText
    }
  

  }
