import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

import './login-element.js'
import './post-basic-element.js'
import './flux-element.js'
import './menu-element.js'
import './profil-cartouche-element.js'
import './app-old-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      share: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.webId = ""
    this.share = {}
    this.onLoad()
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">
    <div class="row">Header</div>

    <div class="container">

    <div class = "row">
    <div class="col-sm">
    ${this.webId != null?
      html`
      <profil-cartouche-element name="ProfilCartouche" webId=${this.webId}>Loading</profil-cartouche-element>
      <post-basic-element name="PostBasic" .share="${this.share}">Loading</post-basic-element>
      `
      :html`-`}

      <login-element name="Login">Loading</login-element>
      </div>
      <div class="col-sm-4 col-md-6">
      <flux-element name="Flux">Loading</flux-element>
      </div>
      <div class="col-sm">
      <menu-element name="Menu">Loading</menu-element>
      </div>

      </div>
      </div>
      </div>

      </hr>
      OLD APP TEST
      <app-old-element name="AppOld">Loading App old</app-old-element>


      `;
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

    }

    webIdChanged(webId){
      this.webId = webId
    }

    onLoad() {
      var parsedUrl = new URL(window.location.toString());
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || ""
      this.share.text = parsedUrl.searchParams.get("text") || ""
      this.share.url = parsedUrl.searchParams.get("url") || ""
      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
      console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }
    }


  }

  customElements.define('app-element', AppElement);
