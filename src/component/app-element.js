import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import './agora-messages-element.js'
import './login-element.js'
import './friends-element.js'
import './config-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraPod: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "world"
    this.agoraPod = "https://agora.solid.community/profile/card#me"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container">
    Hello <b>${this.name}</b> from app-element



<agora-messages-element name="AgoraMessages" agoraPod="${this.agoraPod}">Loading Agora Messages</agora-messages-element>
<login-element name="Login">Loading Login</login-element>


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
//  this.init()
}

async init(){
  console.log(this.agoraPod)
  const rdf = new RDFeasy(auth)
  console.log(rdf)
  let nom =   await rdf.value(this.agoraPod,`
    SELECT ?name WHERE { <> vcard:fn ?name. }`)
  console.log("TEST accès POD, NOM :",nom)
}

}

customElements.define('app-element', AppElement);
