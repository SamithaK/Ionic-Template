import { Component, OnInit } from '@angular/core';
import { OfflineDBService } from 'src/app/core/services/offline-db.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
})
export class LoaderPage implements OnInit {

  constructor(private offlineDatabase: OfflineDBService, private nav: NavController) { }

  ngOnInit() {
    this.offlineDatabase.getDatabaseState().subscribe((state) => {
      console.log("db state ", state)
      if (state) {
        // if the db is ready
        this.init()
      }
    })
    this.nav.navigateForward("login")
  }
  init() {
    console.log("init this function to load the app")
  }

}
