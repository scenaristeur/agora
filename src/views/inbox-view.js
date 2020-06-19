import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"

class InboxView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      messages: {type: Array},
      loop: {type: Object},
      start: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Inbox"
    this.debug = false
    this.config = {}
    this.messages = []
    this.loop = new Date()
    this.start = new Date("04/15/2020");
    this.fc = new SolidFileClient(solid.auth)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    .item {
      background: #FFF;
      border: 1px solid #666;
      /*  height: 100px;*/
      display: flex;
      align-items: center;
      /*  justify-content: center;*/
    }

    #sentinel {
      width: auto;
      height: 30px;
      background-color: red
    }

    #scroller {
      height: 200px; /*550px;*/
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
    <div id="sentinel">Loading messages...</div>
    </div>
    <ul class="list-group">
    ${this.messages.map((m, i) => html`
      <li class="list-group-item">
      <message-view name="${"Message_"+i}" uri=${m}>Loading Message</message-view>
      </li>
      `
    )}
    </ul>

    </div>

    `;
  }

  async configChanged(config){
    this.config = config
    console.log("INBOX CONFIG", this.config)
    console.log(this.config.inbox)
    if (this.config.inbox != undefined){
      let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
      let day = ("0" + this.loop.getUTCDate()).slice(-2);
      let year = this.loop.getUTCFullYear();

      this.path = this.config.inbox+[year, month, day, "index.ttl#this"].join("/")

      if( !(await this.fc.itemExists(this.path)) && this.loop > this.start ) {
        await this.changeDate()
      }


      console.log(this.path)
      await this.subscribe()
      console.log("SUBSCRIBED")
      //  await this.todayMessages()
      //  console.log("TO DAY MESSAGES OK")
      await this.initObserver()
      console.log("INITOBSERVER OK")
    }
  }


  async todayMessages(){
    let newMessages = 0
    let messages = this.messages


    await solid.data.clearCache()
    for await (const message of solid.data[this.path].as$item){
      let m = `${message}`
      //  console.log(m)
      if(!messages.includes(m) ){
        messages = [... messages, m]
        await this.scroller.appendChild(this.sentinel);
        this.addItem(this.messages.length+ " "+ m)
      }else{
        console.log(m, "existe déjà")
      }


    }

    newMessages = messages.length - this.messages.length
    this.messages =  []
    this.messages = messages
    console.log("Messages All, new",this.messages, newMessages)
    return newMessages
  }

  async  loadItems(c) {
    console.log("LOAD",c, this.messages.length, this.path)
    let loadedMessages = 0
    //  this.todayMessages()
    for (let i=0;i < c; i++){
      //  this.addItem(i)
      console.log("AVANT",c, this.messages.length, this.path)

      let newMessages = await this.todayMessages()
      console.log(newMessages)
      loadedMessages += newMessages
      console.log("APRES",c, "LOADED", loadedMessages, this.messages.length, this.path)

      await this.changeDate()
    }

  }

  async changeDate(){
    var newDate = this.loop.setDate(this.loop.getDate() - 1);
    this.loop = new Date(newDate);
    let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
    let day = ("0" + this.loop.getUTCDate()).slice(-2);
    let year = this.loop.getUTCFullYear();

    this.path = this.config.inbox+[year, month, day, "index.ttl#this"].join("/")
    if( !(await this.fc.itemExists(this.path)) && this.loop > this.start ) {
      console.log("TEST",this.path )
      await this.changeDate()
    }



  }

  addItem(i){
    //console.log("add ",i)
    /*var newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.textContent = i+' Item ' + this.counter++;
    this.scroller.appendChild(newItem);*/

    //  var newItem1 = document.createElement('notification-line-element');
    var newItem1 = document.createElement('div');
    newItem1.classList.add('item');
    newItem1.textContent = i+' Item ' + this.counter++;
    newItem1.setAttribute("url", i)
    //  newItem1.setAttribute("name", "Notif_"+this.notifications.length)
    this.scroller.appendChild(newItem1);

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
    this.scroller = this.shadowRoot.querySelector('#scroller');
    this.sentinel = this.shadowRoot.querySelector('#sentinel');
    this.counter = 1;
    console.log(this.scroller, this.sentinel)

    //this.init()

  }

  async chargement(){
    if(this.loop > this.start){
      this.sentinel.innerHTML = "Loading "+this.loop.toLocaleDateString()
      await this.loadItems(5);
      console.log("CHARGEMENT  TERMINE")
      // appendChild will move the existing element, so there is no need to
      // remove it first.
      //await this.scroller.appendChild(this.sentinel);
      //  console.log("AJOUT SENTINEL TERMINE")
      //  await this.loadItems(5);
      //  console.log("CHARGEMENT 5 TERMINE")
    }else{
      this.sentinel.innerHTML = "No older message"
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
        app.chargement()
        console.log("CHARGEMENT TERMINE")
        //ChromeSamples.setStatus('Loaded up to item ' + counter);
      }
    });
    intersectionObserver.observe(app.sentinel);
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
