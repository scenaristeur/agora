import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ToastElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Toast"
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

    <button @click="${this.toast0Open}">Default toast</button>

    <button @click="${this.toast1Open}">Styled toast</button>
    <button @click="${this.toast2toggle}">Persistent toast</button>

    <paper-toast id="toast0" text="This toast auto-closes after 3 seconds"></paper-toast>

    <paper-toast id="toast1" class="fit-bottom" text="This toast is red and fits bottom!"></paper-toast>

    <paper-toast id="toast2" duration="0" text="This toast will stay opened until you close it, or open another toast.">
    <button @click="${this.toast2toggle}" class="btn btn-outline-warning">Close now!</button>
    </paper-toast>



    `;
  }

  toast0Open(){
    this.shadowRoot.getElementById("toast0").open()
  }

  toast1Open(){
    this.shadowRoot.getElementById("toast1").open()
  }

  toast2toggle(){
    this.shadowRoot.getElementById("toast2").toggle()
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

customElements.define('toast-element', ToastElement);
