import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";

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
    <div class="col">
    ${this.notification.summary}
    </div>

    <div class="col">
    <a href="${this.notification.type}"
    title="${this.notification.type}"
    target="_blank">${this.localName(this.notification.type)}</a>
    </div>

    <div class="col">
    ${new Date(this.notification.published).toLocaleString()}
    </div>
    </div>

    <div class="row">
    <div class="col-3">
    <a  class="btn btn-outline-primary" href="${this.notification.attributedTo}" target="_blank">
    ${this.notification.creatorName}</a>
    </div>

    <div class="col">
    ${this.notification.link}
    </div>
    </div>


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
    //    console.log(this.notification.url)
    this.notification.attributedTo = await data[this.notification.url].as$attributedTo
    this.notification.summary = await data[this.notification.url].as$summary
    this.notification.type = await data[this.notification.url].as$type
    this.notification.link = await data[this.notification.url].as$link
    this.notification.creatorName = await data[this.notification.attributedTo].vcard$fn
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
