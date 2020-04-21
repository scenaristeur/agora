import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AppView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      share: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.debug = true

    this.share = {}
      this.onLoad()
      console.log("LOAD APP")
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">
    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    ${JSON.stringify(this.share)}
    </div>
    <store-element name="Store">Store Loading</store-element>




    <header>
    <!--      <nav-element name="Nav">Loading Nav</nav-element>-->
    </header>


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

  onLoad() {
    var parsedUrl = new URL(window.location.toString());
    console.log(parsedUrl)
    this.share.title = parsedUrl.searchParams.get("title") || ""
    this.share.text = parsedUrl.searchParams.get("text") || ""
    this.share.url = parsedUrl.searchParams.get("url") || ""
    //      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
    if (this.share.title.length + this.share.text.length + this.share.url.length > 0){
    //  this.panel = "Compose" // : this.share.length = false;
      this.share.show = true
    }
    console.log(this.share)
    if (parsedUrl.searchParams.get("oldapi")) {
      alert("Your browser is using the deprecated 'url_template' Web Share "
      + "Target API.");
    }

  }

  customElements.define('app-view', AppView);
