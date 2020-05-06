import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class NotificationLineElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url: {type: String},
      notification: {type: Object},
      creator: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "NotificationLine"
    this.url = {}
    this.notification = {}
    this.creator = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
<!--    <link href="css/fontawesome/css/all.css" rel="stylesheet">-->
<style>
.chat_ib h5{ font-size:15px; color:#464646; margin:0 0 8px 0;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color:#989898; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
img{ max-width:100%;}
</style>
<div class="chat_list">
    <div class="chat_people">
            <div class="chat_img"
            webId="${this.creator.webId}"
            @click="${this.showProfile}">
             <img class="rounded-circle" src="${this.creator.photo}" webId="${this.creator.webId}" alt="load pic"> </div>
            <div class="chat_ib">
              <h5>${this.creator.name}<span class="chat_date">${this.delay(this.notification.published)}</span></h5>
              <!--<p>Test, which is a new approach to have all solutions
                astrology under one roof.</p>-->
                <p>
                <activity-element name="${this.name+'_activity'}"
                url="${this.notification.link}">Loading activity ${this.notification.link}...
                </activity-element>
                </p>
            </div>
          </div>
        </div>




  <!--  <div class="row" timestamp="${this.notification.timestamp}"
    url="${this.notification.url}">
    <div class="col-4">
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
    @click="${this.showProfile}"></i>`}

 <p class="text-muted small">${this.delay(this.notification.published)}</p>

  </div>

  <div class="col-8">
  <small class="text-muted" webId="${this.notification.attributedTo}"
  @click="${this.showProfile}">
  ${this.creator.name}
  </small>
  <activity-element name="${this.name+'_activity'}"
  url="${this.notification.link}">Loading activity ${this.notification.link}...
  </activity-element>
  </div>
  </div>
-->
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
  this.notification.url = this.url
  // console.log(this.notification.url)
  let published = new Date(await solid.data[this.notification.url].as$published)
  this.notification.published = `${published}`
  this.notification.timestamp = published.getTime()
  this.creator.webId = await solid.data[this.notification.url].as$attributedTo
  this.notification.summary = await solid.data[this.notification.url].as$summary
  this.notification.type = await solid.data[this.notification.url].as$type
  let link = await solid.data[this.notification.url].as$link
  this.notification.link = `${link}`
  this.creator.name = await solid.data[this.creator.webId].vcard$fn || `${this.creator.webId}`.split("/")[2].split('.')[0];
  let photo = await solid.data[this.creator.webId].vcard$hasPhoto
  this.creator.photo = `${photo}` //!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"

  //console.log(this.notification)
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
