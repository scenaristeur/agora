import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AppView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.debug = true
    this.config = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <style is="custom-style">
    #toast1 {
      --paper-toast-background-color: red;
      --paper-toast-color: white;
    }
    .yellow-button {
      text-transform: none;
      color: #eeff41;
    }
    </style>

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config : ${JSON.stringify(this.config)}<br>
    </div>

    <div class="container-fluid">
    <organizations-view name="Organizations"></organizations-view>
    <roles-view name="Roles"></roles-view>
    </div>
    <login-element name="Login"></login-element>
    <config-view name="Config"></config-view>
    <toast-element name="Toast">Loading Toast</toast-element>
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
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  configChanged(config){
    this.config = config
    console.log(this.config)
  }

}

customElements.define('app-view', AppView);
