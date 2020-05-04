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
    this.messages = []
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
    console.log(this.config.inbox)
    let d = new Date();
    let month = ("0" + (d.getUTCMonth() + 1)).slice(-2); //months from 1-12
    let day = ("0" + d.getUTCDate()).slice(-2);
    let year = d.getUTCFullYear();

    this.path = this.config.inbox+[year, month, day, "index.ttl#this"].join("/")
    console.log(this.path)
    this.subscribe()
    this.todayMessages()
  }


  async todayMessages(){
    let messages = this.messages

    await solid.data.clearCache()
    for await (const message of solid.data[this.path].as$item){
      let m = `${message}`
      console.log(m)
      !messages.includes(m) ? messages = [... messages, m] : "";
      console.log(messages)
    }
    this.messages =  []
    this.messages = messages
    console.log("Messages",this.messages)
  }


  async subscribe(){
    var app = this
    var websocket = "wss://"+this.path.split('/')[2];

    app.socket = new WebSocket(websocket);
    app.socket.onopen = function() {

      //      var now = d.toLocaleTimeString(app.lang)
      this.send('sub '+app.path);
      console.log("subscribe to INBOX",websocket, app.path)
      //  app.agent.send('Messages',  {action:"info", info: now+"[souscription] "+url});
    };
    app.socket.onmessage = function(msg) {
      console.log(msg)
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        //  app.notification("nouveau message Socialid")
        //app.openLongChat()
        console.log(msg.data)
        app.todayMessages()
        //  app.agent.send("Flux", {action: "websocketMessage", url : url})
      }
    };
  }

  async updateMessages1(){
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
