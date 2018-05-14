import { BLE } from '@ionic-native/ble';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              private toastCtrl: ToastController,
              private ble: BLE,
              private ngZone: NgZone) { 
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    if (this.ble.isEnabled) {
      this.ble.enable();
    }
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 8000).subscribe(
      device => { this.ngZone.run(()=>{this.onDeviceDiscovered(device);});}, 
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
      console.log(JSON.stringify(this.devices));
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.navCtrl.push(DetailPage, {device: device});
  }

}
