import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class NotificationLineElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      notification: {type: Object},
      creator: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "NotificationLine"
    this.notification = {}
    this.creator = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div timestamp="${this.notification.timestamp}"
    url="${this.notification.url}">


    <div class="row">
    <div class="col-2">
    ${this.creator.photo != "undefined"?
    html`<img class="rounded-circle ml-0" width="32px"
    src="//images.weserv.nl/?url=${this.creator.photo}&w=32&h=32"
    title="${this.creator.name}"
    alt="no image"
    webId="${this.creator.webId}"
    @click="${this.showProfile}">`
    :html`<i class="fas fa-user-circle fa-2x"
    title="${this.creator.name}"
    webId="${this.creator.webId}"
    @click="${this.showProfile}"></i>`
  }

  <p class="text-muted small">${this.delay(this.notification.published)}</p>
  </div>

  <div class="col">
  <small class="text-muted" webId="${this.notification.attributedTo}"
  @click="${this.showProfile}">
  ${this.creator.name}
  </small>
  <activity-element name="${this.name+'_activity'}"
  url="${this.notification.link}">Loading activity ${this.notification.link}...
  </activity-element>
  </div>
  </div>


  </div>
  `;
}


showProfile(){
  this.agent.send("App", {action: "showPanel", panel: "Profile"})
  this.agent.send("Profile", {action: "profileChanged", profile: this.creator})
}

delay(published){
  let diff = new Date().getTime() - new Date(published).getTime()
  let minute = 1000 * 60;
  let minutes = Math.floor(diff/minute);
  let heures = Math.floor(minutes/60);
  let jours = Math.floor(heures/24);
  let mois = Math.floor(jours/31);
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
  this.creator.webId = await solid.data[this.notification.url].as$attributedTo
  this.notification.summary = await solid.data[this.notification.url].as$summary
  this.notification.type = await solid.data[this.notification.url].as$type
  let link = await solid.data[this.notification.url].as$link
  this.notification.link = `${link}`
  this.creator.name = await solid.data[this.creator.webId].vcard$fn || `${this.creator.webId}`.split("/")[2].split('.')[0];
  let photo = await solid.data[this.creator.webId].vcard$hasPhoto
  this.creator.photo = `${photo}` //!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"

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
