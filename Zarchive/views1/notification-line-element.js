import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
////let data = solid.data
//console.log("LDFK+LEX",data)
//import './activity-element.js'
//let data = solid.data
//console.log("LDFK+LEX",data)

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
    <div class="col-2">
    ${this.notification.photo != "undefined"?
    html`<img class="rounded-circle ml-0" width="32px"
    src="//images.weserv.nl/?url=${this.notification.photo}&w=32&h=32"
    title="${this.notification.creatorName}"
    alt="no image"
    webId="${this.notification.attributedTo}"
    @click="${this.showProfile}">`
    :html`<i class="fas fa-user-circle fa-2x"
    title="${this.notification.creatorName}"
    webId="${this.notification.attributedTo}"
    @click="${this.showProfile}"></i>`
  }

  <p class="text-muted small">${this.delay(this.notification.published)}</p>
  </div>

  <div class="col">
  <small class="text-muted">${this.notification.creatorName}</small>
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
  this.notification.attributedTo = await solid.data[this.notification.url].as$attributedTo
  this.notification.summary = await solid.data[this.notification.url].as$summary
  this.notification.type = await solid.data[this.notification.url].as$type
  let link = await solid.data[this.notification.url].as$link
  this.notification.link = `${link}`
  this.notification.creatorName = await solid.data[this.notification.attributedTo].vcard$fn || `${this.notification.attributedTo}`.split("/")[2].split('.')[0];
  let photo = await solid.data[this.notification.attributedTo].vcard$hasPhoto
  this.notification.photo = `${photo}` //!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"

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
