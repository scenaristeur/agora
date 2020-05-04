import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class WebsocketElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url : {type: String},
      debug : {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "Websocket"
    this.url = ""
    this.debug = false
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    url : ${this.url}<br>
    <!--  config : ${JSON.stringify(this.config)}</br>-->
    </div>

    <div class="container-fluid">

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
          case "urlChanged":
          app.urlChanged(message.url)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };

  }

  urlChanged(url){
    console.log(url)
    this.url = url
    this.subscribe()
  }


  async subscribe(){
    var app = this
    const d = new Date();
    let month = ("0" + (d.getUTCMonth() + 1)).slice(-2); //months from 1-12
    let day = ("0" + d.getUTCDate()).slice(-2);
    let year = d.getUTCFullYear();

    console.log("websocket_url",this.url)
    //this.path = this.inbox+[year, month, day, "index.ttl#this"].join("/")
    var websocket = "wss://"+this.url.split('/')[2];
    var url = this.url+[year,month,day,"index.ttl"].join('/')

    app.socket = new WebSocket(websocket);
    app.socket.onopen = function() {

      //      var now = d.toLocaleTimeString(app.lang)
      this.send('sub '+url);
      console.log("subscribe to ",websocket, url)
      //  app.agent.send('Messages',  {action:"info", info: now+"[souscription] "+url});
    };
    app.socket.onmessage = function(msg) {
      console.log(msg)
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        //  app.notification("nouveau message Socialid")
        //app.openLongChat()
        console.log(msg.data)
        app.agent.send("Flux", {action: "websocketMessage", url : url})
      }
    };
  }

}

customElements.define('websocket-element', WebsocketElement);
