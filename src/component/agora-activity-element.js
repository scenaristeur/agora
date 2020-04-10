import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AgoraActivityElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      activity: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "AgoraActivity"
    this.activity = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container fluid">
    Hello <b>${this.name}</b> from app-element
    <br>
    ${this.activity.timestamp} : ${this.activity.published} / ${this.activity.url}
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
  }

}

customElements.define('agora-activity-element', AgoraActivityElement);
