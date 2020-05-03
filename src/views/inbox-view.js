import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class InboxView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      messages: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Inbox"
    this.debug = false
    this.config = {}
    this.messages = ["message1", "message2"]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    #scroller {
      height: 550px;
      overflow-y: scroll;
    }
    </style>

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config : ${JSON.stringify(this.config)}<br>
    </div>

    <div class="container-fluid">
    Messages length : ${this.messages.length}


    <div class="col-12" id="scroller">
    <ul class="list-group">
    ${this.messages.map((m, i) => html`
      <li class="list-group-item">
      <message-view name="${"Message_"+i}" uri=${m}>Loading Message</message-view>
      </li>
      `
    )}
    </ul>

    </div>



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
  }

  configChanged(config){
    this.config = config
    console.log("INBOX CONFIG", this.config)
    this.updateMessages()
  }
  
  async updateMessages(){
    console.log(this.config.inbox)
    let messages = []
    this.messages =  []
    for await (const message of solid.data[this.config.inbox].ldp$contains){
      let m = `${message}`
      messages = [... messages, m]
    }

    this.messages = messages




  }

}

customElements.define('inbox-view', InboxView);
