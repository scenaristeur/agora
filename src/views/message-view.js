import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class MessageView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      //  config: {type: Object},
      uri: {type: String},
      attributedTo: {type: String},
      label: {type: String},
      summary: {type: String},
      published: {type: String},
      type: {type: String},
      link: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Message"
    this.debug = false
    //  this.config = {}
    this.uri = ""
    this.attributedTo = ""
    this.label = ""
    this.summary = ""
    this.published = ""
    this.type = ""
    this.link = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    message uri : ${this.uri}<br>
    </div>

    <div class="container-fluid">

    message uri : ${this.uri}<br>
    attributedTo : ${this.attributedTo}<br>
    label : ${this.label}<br>
    summary : ${this.summary}<br>
    published : ${this.published}<br>
    type : ${this.type}<br>
    link : ${this.link}<br>

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
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.init()
  }

  async init(){
    console.log(this.uri)
    let at = await solid.data[this.uri].as$attributedTo
    this.attributedTo = `${at}`
    let label = await solid.data[this.uri].rdfs$label
    this.label = `${label}`
    let su = await solid.data[this.uri].as$summary
    this.summary = `${su}`
    let pu = await solid.data[this.uri].as$published
    this.published = `${pu}`
    let ty = await solid.data[this.uri].as$type
    this.type = `${ty}`
    let li = await solid.data[this.uri].as$link
    this.link = `${li}`
  
  }

  configChanged(config){
    this.config = config
    console.log(this.config)
  }

}

customElements.define('message-view', MessageView);
