import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class FluxElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      counter: {type: Number},
      agoraPod: {type: String},
      date: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Flux"
    this.agoraPod = ""
    this.number = 0
    this.debug = true
    let dateObj = new Date();
    this.date = {}
    this.date.month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    this.date.day = ("0" + dateObj.getUTCDate()).slice(-2);
    this.date.year = dateObj.getUTCFullYear();

  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <style>

    .item {
      background: #FFF;
      border: 1px solid #666;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #sentinel {
      width: 1px;
      height: 1px;
    }

    #scroller {
      height: 400px;
      overflow-y: scroll;
    }
    </style>

    <div class="container-fluid">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    <!--    config : ${JSON.stringify(this.config)}</br>-->
    counter : ${this.counter}
    </div>

    <div id="scroller">
    <div id="sentinel"></div>
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
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };

    this.scroller = this.shadowRoot.querySelector('#scroller');
    this.sentinel = this.shadowRoot.querySelector('#sentinel');
    this.counter = 1;
    console.log(this.scroller, this.sentinel)
    this.initObserver()
    this.initPath()
  }


  async initPath(){
    this.log = "Agora Pod : "+this.agoraPod
    //console.log(this.agoraPod)
    let pti_url = await solid.data[this.agoraPod].solid$publicTypeIndex
    this.log = 'Pti url : '+pti_url
    //console.log(`${pti_url}`)
    let instance = await solid.data[pti_url+"#Agora"].solid$instance
    this.log = 'Instance url : '+instance
    //console.log(`${instance}`)
    let inbox = await solid.data[instance].as$inbox
    this.log = 'Inbox : '+inbox

    this.path = inbox+[this.date.year, this.date.month, this.date.day, "index.ttl#this"].join("/")
    console.log(this.path)
    this.getNotif()
  }

async getNotif(){
    console.log(this.path)
    let notifications = []
    for await (const notif of solid.data[this.path]['https://www.w3.org/ns/activitystreams#item']){
      console.log(`${notif}`)
    //  if(`${subject}` != inbox){
        let n = {}
        n.url = `${notif}`
        /* */
        notifications.push(n)
      //  app.log = "Notifications : "+notifications.length
    //  }
    }
    console.log(notifications)
  //  this.notifications = notifications



  }


  loadItems(n) {
    console.log("LOAD",n)
    for (var i = 0; i < n; i++) {
      var newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.textContent = 'Item ' + this.counter++;
      this.scroller.appendChild(newItem);
    }
  }

  initObserver(){
    let app = this
    var intersectionObserver = new IntersectionObserver(entries => {
      // If the browser is busy while scrolling happens, multiple entries can
      // accumulate between invocations of this callback. As long as any one
      // of the notifications reports the sentinel within the scrolling viewport,
      // we add more content.
      if (entries.some(entry => entry.intersectionRatio > 0)) {
        app.loadItems(10);
        // appendChild will move the existing element, so there is no need to
        // remove it first.
        app.scroller.appendChild(app.sentinel);
        app.loadItems(5);
        //ChromeSamples.setStatus('Loaded up to item ' + counter);
      }
    });
    intersectionObserver.observe(app.sentinel);
  }

}

customElements.define('flux-element', FluxElement);
