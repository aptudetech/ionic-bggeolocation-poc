import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
// eslint-disable-next-line max-len
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

   config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };


  constructor(private activatedRoute: ActivatedRoute, private backgroundGeoLocation : BackgroundGeolocation,
              private toastController:ToastController) {
    this.backgroundGeoLocation.configure(this.config)
      .then(()=>{
        this.backgroundGeoLocation.on(BackgroundGeolocationEvents.location)
          .subscribe(async (location: BackgroundGeolocationResponse)=>{
        console.log('Locations', location.latitude+','+location.longitude);
        console.log('Speed', location.speed); // Tracks the speed of user

            const toast = await this.toastController.create({
              message: 'Locations: '+location.latitude+','+location.longitude,
              duration: 2000
            });
            toast.present();
            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            //this.backgroundGeoLocation.finish(); // FOR IOS ONLY
      });
    });
  }


  start() {
    this.backgroundGeoLocation.start();
  }
  stop() {
    this.backgroundGeoLocation.stop();
  }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
