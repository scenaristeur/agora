import { html } from 'lit-element';
import { BaseView } from './base-view.js';
////let data = solid.data
//console.log("LDFK+LEX",data)
////import * as auth from 'solid-auth-client';
//import './notification-line-element.js'
//let data = solid.data
//console.log("LDFK+LEX",data)

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
    this.log = ""
  }

  render(){
    return html`

    <div class="row border" style="overflow-y:scroll;position:relative;height: 400px;">

    <div class="lead" ?hidden = "${this.notifications.length != 0}">
    Loading<br>Activities<br>from<br>${this.agoraPod}
    <br>${this.log}
    </div>
    <ul class="list-group list-group-flush">
    ${this.notifications.map((n,i) => html `
      <li class="list-group-item" id="${this.name}">
      <notification-line-element id="${'Notification'+i}"
      name = "${'Notification'+i}"
      .notification="${n}">Loading notification...</notification-line-element>
      </li>
      `)}
      </ul>


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
      //console.log(this.agoraPod)
      let pti_url = await solid.data[this.agoraPod].solid$publicTypeIndex
      this.log = 'Pti url : '+pti_url
      //console.log(`${pti_url}`)
      let instance = await solid.data[pti_url+"#Agora"].solid$instance
      this.log = 'Instance url : '+instance
      //console.log(`${instance}`)
      let inbox = await solid.data[instance].as$inbox
      this.log = 'Inbox : '+inbox
      //console.log(`${inbox}`)

      let notifications = []
      for await (const subject of solid.data[inbox].subjects){
    //    console.log(`${subject}`)
        if(`${subject}` != inbox){
          let n = {}
          n.url = `${subject}`+'#this'
          /* */
          notifications.push(n)
          app.log = "Notifications : "+notifications.length
        }
      }
      //console.log(notifications)
      this.notifications = notifications
    //  this.log = "Ready"
      this.notifications.forEach(async function(n)  {
        let published = new Date(await solid.data[n.url].as$published)
        n.published = `${published}`
        n.timestamp = published.getTime()
      });
    /*  console.log(notifications)
      this.log = "Sort Notifications"
      notifications.sort(function(a, b){
        return a.timestamp < b.timestamp;
      });
      this.notifications = notifications*/

    }

  }

  customElements.define('flux-element', FluxElement);
