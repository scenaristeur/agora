import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";
//import * as auth from 'solid-auth-client';
import './notification-line-element.js'

class AgoraInboxElement extends LitElement {

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
    this.name = "AgoraInbox"
    this.agoraPod = "https://agora.solid.community/profile/card#me"
    this.notifications = []
    this.log = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
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
      var app = this;
      this.agent = new HelloAgent(this.name);
      console.log(this.agent)
      this.agent.receive = function(from, message) {
        //  console.log("messah",message)
        if (message.hasOwnProperty("action")){
          //  console.log(message)
          switch(message.action) {
            case "webIdChanged":
            app.webIdChanged(message.webId)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
      this.init()
    }

    async init(){
      let app = this
      this.log = "Agora Pod : "+this.agoraPod
      //      console.log(this.agoraPod)
      let pti_url = await data[this.agoraPod].solid$publicTypeIndex
      this.log = 'Pti url : '+pti_url
      //    console.log(`${pti_url}`)
      let instance = await data[pti_url+"#Shighl"].solid$instance
      this.log = 'Instance url : '+instance
      //    console.log(`${instance}`)
      let inbox = await data[instance].as$inbox
      this.log = 'Inbox : '+inbox
      //    console.log(`${inbox}`)

      let notifications = []
      for await (const subject of data[inbox].subjects){
        //    console.log(`${subject}`)
        if(`${subject}` != inbox){
          let n = {}
          n.url = `${subject}`+'#this'
          let published = new Date(await data[n.url].as$published)
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

  customElements.define('agora-inbox-element', AgoraInboxElement);
