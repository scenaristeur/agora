import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";


class ProfilCartoucheElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      username: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Profil Cartouche"
    this.webId = ""
    this.username = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="dropdown">
    <button class="btn btn-sm btn-outline-primary dropdown-toggle"
    type="button" data-toggle="dropdown"
    @click="${this.toggleMenu}">
    ${this.username}
    </button>
    <div class="dropdown-menu" id="menu" >
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="userProfile">Profile</button>
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="config">Config</button>
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="flux">Flux public</button>
    <!--    <button class="dropdown-item" type="button">Autres</button>-->
    </div>
    </div>

    <!--  <button class="btn btn-sm btn-outline-primary" @click="${this.editProfil}">${this.webId}</button>-->
    `;
  }


  toggleMenu(e){
    let id = e.target.getAttribute("id")
    if (id != null){
      this.agent.send("App", {action: "pageChanged", page: id})
    }
    this.shadowRoot.getElementById("menu").classList.toggle("d-block")
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

async webIdChanged(webId){
    this.username = await data[webId].vcard$fn  || webId.split("/")[2].split('.')[0];
  }

}

customElements.define('profil-cartouche-element', ProfilCartoucheElement);
