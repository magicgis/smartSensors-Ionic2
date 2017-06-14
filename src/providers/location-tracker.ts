import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import * as Leaflet from "leaflet";

@Injectable()
export class LocationTracker {

  public watch: any;
  private _radius: number = 700;
  private _latLng: any;
  private _circle: any;
  private _marker: any;


  constructor(public zone: NgZone,
              public backgroundGeolocation: BackgroundGeolocation,
              public geolocation: Geolocation) {

  }

  startTracking(latlng: any) { // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this._marker = Leaflet.marker(latlng)
      .bindPopup("Você");
    this._circle = Leaflet.circle(latlng, this.radius);

    this._latLng = latlng;

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.latLng = {lat: location.latitude, lng: location.longitude};
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options)
                                  .filter((p: any) => p.code === undefined)
                                  .subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.latLng = {lat: position.coords.latitude, lng: position.coords.longitude};
      });

    });
  }

  stopTracking() {
    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this._circle.setRadius(value);
  }

  set latLng(latlng) {
    this._latLng = latlng;
    this._circle.setLatLng(latlng);
    this._marker.setLatLng(latlng);
  }

  get latLng()
  {
    return this._latLng;
  }

  get circle() {
    return this._circle;
  }
  get marker() {
    return this._marker;
  }
}
