import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CommonFunctionsService } from './core/services/common-functions.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Profile',
      url: '/home',
      icon: 'contact'
    },
    {
      title: 'Contacts',
      url: '/home',
      icon: 'contacts'
    },
    {
      title: 'Settings',
      url: '/home',
      icon: 'settings'
    },

    {
      title: 'Logout',
      url: '/home',
      icon: 'exit'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private commonFunction: CommonFunctionsService,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.commonFunction.setInitialAppLanguage()
      this.splashScreen.hide();
    });
  }
}
