import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalService {
  private serverUrl = environment.signalUrl;

  connect(): void {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.serverUrl)
      .build();

    connection.start().then(function () {
      console.log('SignalR Connected!');
      connection.invoke("ToBroadcast", "hello from angular");
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("FromBroardcast", (param) => {
      console.log(param);
    });
  }

}