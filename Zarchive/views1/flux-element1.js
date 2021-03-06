import { html } from 'lit-element';
import { BaseView } from './base-view.js';
//let data = solid.data
//console.log("LDFK+LEX",data)
////import * as auth from 'solid-auth-client';
import './notification-line-element.js'


class FluxElement extends BaseView {

  static get properties() {
    return {
      name: {type: String},
      agoraPod: {type: String},
      notifications: {type: String},
      log: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Flux"
    this.agoraPod = ""
    this.notifications = []
    this.log = {}
  }

  render(){
    return html`
    <div class="container-fluid">
    POD : ${this.agoraPod}<br>
    Notifications : ${this.notifications.length}</br>

    ${this.notifications.length == 0 ?
      html ` L O A D I N G <br>
      A G O R A &nbsp;&nbsp; N O T I F I C A T I O N S<br>
      P L E A S E&nbsp;&nbsp;W A I T...
      <br><br>
      ${this.log}

      `
      :html`
      <ul class="list-group list-group-flush">
      ${this.notifications.map((n,i) => html `
        <li class="list-group-item" id="${this.name}">
        <notification-line-element id="${'Notification'+i}"
        name = "${'Notification'+i}"
        .notification="${n}">Loading notification...</notification-line-element>
        </li>
        `)}
        </ul>
        `
      }

      </div>
      `;
    }

    firstUpdated(){
      super.firstUpdated()
      this.init()
    }

    async init(){
      let app = this
      this.log = "Agora Pod : "+this.agoraPod
      //      console.log(this.agoraPod)
      let pti_url = await solid.data[this.agoraPod].solid$publicTypeIndex
      this.log = 'Pti url : '+pti_url
      //    console.log(`${pti_url}`)
      let instance = await solid.data[pti_url+"#Agora"].solid$instance
      this.log = 'Instance url : '+instance
      //    console.log(`${instance}`)
      let inbox = await solid.data[instance].as$inbox
      this.log = 'Inbox : '+inbox
      //    console.log(`${inbox}`)

      let notifications = []
      for await (const subject of solid.data[inbox].subjects){
        //    console.log(`${subject}`)
        if(`${subject}` != inbox){
          let n = {}
          n.url = `${subject}`+'#this'
          let published = new Date(await solid.data[n.url].as$published)
          n.published = `${published}`
          n.timestamp = published.getTime()
          notifications.push(n)
          app.log = "Notifications : "+notifications.length
        }
      }
      //  console.log(notifications)
      this.log = "Sort Notifications"
      notifications.sort(function(a, b){
        return a.timestamp < b.timestamp;
      });
      this.notifications = notifications
      this.log = "Ready"
    }

  }

  customElements.define('flux-element', FluxElement);
