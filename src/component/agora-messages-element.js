import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";
//import * as auth from 'solid-auth-client';
import './agora-activity-element.js'

class AgoraMessagesElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraPod: {type: String},
      activities: {type: String},
      log: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "AgoraMessages"
    this.agoraPod = "https://agora.solid.community/profile/card#me"
    this.activities = []
    this.log = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container fluid">

    POD : ${this.agoraPod}<br>
    Activities : ${this.activities.length}</br>

    ${this.activities.length == 0 ?
      html ` L O A D I N G <br>
      A G O R A &nbsp;&nbsp; A C T I V I T I E S<br>
      P L E A S E&nbsp;&nbsp;W A I T...
      <br><br>
      ${this.log}

      `
      :html`
      <ul class="list-group list-group-flush">
      ${this.activities.map((a,i) => html `
        <li class="list-group-item">
        <agora-activity-element name = "${'Activity_'+i}" .activity="${a}">Loading activity...</agora-activity-element>
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
      let inbox = await data[instance].solid$inbox
      this.log = 'Inbox : '+inbox
      //    console.log(`${inbox}`)

      let activities = []
      for await (const subject of data[inbox].subjects){
        //    console.log(`${subject}`)
        if(`${subject}` != inbox){
          let a = {}
          a.url = `${subject}`+'#this'
          let published = new Date(await data[a.url].as$published)
          a.published = `${published}`
          a.timestamp = published.getTime()
          activities.push(a)
          app.log = "Activities : "+activities.length
        }
      }
      console.log(activities)
      this.log = "Sort Activities"
      activities.sort(function(a, b){
        return a.timestamp > b.timestamp;
      });
      this.activities = activities
      this.log = "Ready"
    }

  }

  customElements.define('agora-messages-element', AgoraMessagesElement);
