import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class NavElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "Nav"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#" panel="Init" @click="${this.showPanel}">Agora</a>
    <button @click="${this.toggle}" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent" @click="${this.toggle}">
    <ul class="navbar-nav mr-auto">
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Flow" @click="${this.showPanel}">Flow</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Compose" @click="${this.showPanel}">Compose</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Organization" @click="${this.showPanel}">Organization</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Talk" @click="${this.showPanel}">Talk</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Profile" @click="${this.showPanel}">Profile</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#" panel="Config" @click="${this.showPanel}">Config</a>
    </li>


    <li class="nav-item">
    <a class="nav-link" href="#" panel="Info" @click="${this.showPanel}">Help</a>
    </li>
    <!--  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Something else here</a>
    </div>
    </li>
    <li class="nav-item">
    <a class="nav-link disabled" href="#">Disabled</a>
    </li>-->
    <li>
    <login-element name="Login"></login-element>
    </li>
    <li>
    <!--    <profile-cartouche-element name="ProfileCartouche" webId="${this.webId}"></profile-cartouche-element>-->
    </li>

    </ul>
    <form class="form-inline my-2 my-lg-0">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
    </div>
    </nav>
    `;
  }

  toggle(){
    //  console.log(this.shadowRoot.getElementById("navbarSupportedContent").classList)
    this.shadowRoot.getElementById("navbarSupportedContent").classList.toggle("collapse")
  }

  showPanel(e){
    this.agent.send("App", {action: "panelChanged", panel: e.target.getAttribute("panel")})
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

customElements.define('nav-element', NavElement);
