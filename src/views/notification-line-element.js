import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";
import './activity-element.js'

class NotificationLineElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      notification: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "NotificationLine"
    this.notification = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div timestamp="${this.notification.timestamp}"
    url="${this.notification.url}">


    <div class="row">
    <div class="col-3">
    <button  class="btn btn-outline-info btn-sm" webId="${this.notification.attributedTo}" @click="${this.showProfile}">
    ${this.notification.creatorName}</button>
    <small><p class="font-weight-light">${this.delay(this.notification.published)}</p></small>

    </div>

    <div class="col">
    <activity-element name="${this.name+'_activity'}"
    url="${this.notification.link}">Loading activity ${this.notification.link}...
    </activity-element>
    </div>
    </div>


    </div>
    `;
  }


  delay(published){
    let diff = new Date().getTime() - new Date(published).getTime()
    let minute = 1000 * 60;
    let minutes = Math.floor(diff/minute);
    let heures = Math.floor(minutes/60);
    let jours = Math.floor(heures/24);
    let mois = Math.floor(jours/31); //*
    let annees = Math.floor(mois/12);
    let duree = ""
    annees > 0 ? duree+= annees+"y" :
    mois > 0 ? duree+= mois+"m" :
    jours > 0 ? duree += jours+"j":
    heures > 0 ? duree += heures+"h":
    minutes > 0 ? duree += minutes+"m":
    duree = diff/1000+ "s";
    return duree
  }

  showProfile(e){
    let webId = e.target.getAttribute("webId")
    console.log(webId)
    this.agent.send("App", {action: "pageChanged", page: "profile"})
    this.agent.send("Profile", {action: "profileChanged", webId: webId})
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    //  console.log(this.agent)
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
    //    console.log(this.notification.url)
    this.notification.attributedTo = await data[this.notification.url].as$attributedTo
    this.notification.summary = await data[this.notification.url].as$summary
    this.notification.type = await data[this.notification.url].as$type
    let link = await data[this.notification.url].as$link
    this.notification.link = `${link}`
    this.notification.creatorName = await data[this.notification.attributedTo].vcard$fn || `${this.notification.attributedTo}`.split("/")[2].split('.')[0];
    //  console.log(this.notification)
    this.requestUpdate()
  }


  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    //console.log(ln)
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }

}

customElements.define('notification-line-element', NotificationLineElement);
