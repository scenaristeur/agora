import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ProfilCartoucheElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Profil Cartouche"
    this.webId = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <button class="btn btn-sm btn-outline-primary" @click="${this.editProfil}">${this.webId}</button>
    `;
  }

  editProfil(){
    console.log("EDIT PROFIL",this.webId)
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

customElements.define('profil-cartouche-element', ProfilCartoucheElement);
