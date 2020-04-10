import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ModeleElement extends LitElement {

  static get properties() {
    return {
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "modele"
  }

  render(){
    return html`
    Hello <b>${this.something}</b> from app-element
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

customElements.define('modele-element', ModeleElement);
