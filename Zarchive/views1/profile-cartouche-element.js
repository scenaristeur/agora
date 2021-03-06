import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)


class ProfileCartoucheElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      username: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Profile Cartouche"
    this.webId = null
    this.username = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="dropdown" ?hidden="${this.webId == null}">
    <button class="btn btn-sm btn-outline-primary dropdown-toggle"
    type="button" data-toggle="dropdown"
    @click="${this.toggleMenu}">
    ${this.username}
    </button>
    <div class="dropdown-menu" id="menu" >
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="profile">Profile</button>
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="config">Config</button>
    <button class="dropdown-item" type="button" @click="${this.toggleMenu}" id="flux">Public Flow</button>
    </div>
    </div>

    `;
  }


  toggleMenu(e){
    let id = e.target.getAttribute("id")
    console.log(this.agent)
    if (id != null){
      this.agent.send("App", {action: "pageChanged", page: id})
      if(id == "profile"){
        this.agent.send("Profile", {action: "profileChanged", webId: this.webId})
      }
    }
    this.shadowRoot.getElementById("menu").classList.toggle("d-block")
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    app.agent.send("Store", {action:"getConfig"});

    //  this.init()
  }

  configChanged(config){
    this.webIdChanged(config.webId)
  }

  async webIdChanged(webId){
    console.log(webId)
    this.webId = webId
    this.username = await solid.data[webId].vcard$fn  || webId.split("/")[2].split('.')[0];
  }

}

customElements.define('profile-cartouche-element', ProfileCartoucheElement);
