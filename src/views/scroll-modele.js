import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"


class ScrollView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      messages: {type: Array},
      root: {type: String},
      loop: {type: Object},
      start: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Scroll"
    this.debug = true
    this.messages = []
    this.root = ""
    this.loop = new Date()
    this.start = new Date("04/15/2020");
    this.fc = new SolidFileClient(solid.auth)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    .item {
      background: #FFF;
      border: 1px solid #666;
      min-height: 100px;
      display: flex;
      align-items: center;
    }

    #sentinel {
      width: auto;
      height: 30px;
      background-color: red
    }

    #scroller {
      height: 550px;
      overflow-y: scroll;
    }
    </style>

    <div class="col-12" id="scroller">
    <div id="sentinel">Loading messages...</div>
    </div>

    <div ?hidden = "${!this.debug}">
    start : ${this.start.toLocaleString()}<br>
    loop : ${this.loop.toLocaleString()}<br>
    messages length : ${this.messages.length}<br>
    </div>
    `;
  }

  firstUpdated(){
    this.scroller = this.shadowRoot.querySelector('#scroller');
    this.sentinel = this.shadowRoot.querySelector('#sentinel');
    this.buildPath()
    this.subscribe()
    this.initObserver()
  }

  buildPath(){
    let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2);
    let day = ("0" + this.loop.getUTCDate()).slice(-2);
    let year = this.loop.getUTCFullYear();
    this.path = this.root+[year, month, day, "index.ttl#this"].join("/")
  }

  async checkNewMessage(url){
    await solid.data.clearCache()
    for await (const message of solid.data[url].as$item){
      if (!this.messages.includes(m)){
        this.addItem(m, true)
      }
    }
  }

  async loadMessages(){
    await solid.data.clearCache()
    if(this.loop > this.start ){
      this.sentinel.innerHTML = "Loading "+this.loop.toLocaleDateString()
      for await (const message of solid.data[this.path].as$item){
        let m = `${message}`
        this.addItem(m)
      }
    }else{
      this.sentinel.innerHTML = "No message before "+this.start.toLocaleDateString()
    }
  }

  addItem(i, prepend = false){
    this.moveScroller()
    var newItem1 = document.createElement('div');
    newItem1.classList.add('item');
    newItem1.textContent = i+' Item '
    newItem1.setAttribute("url", i)
    if (prepend == false){
      this.scroller.appendChild(newItem1);
      this.messages = [... this.messages,i]
    }else{
      this.scroller.prepend(newItem1);
      this.messages = [i, ...this.messages];
    }
  }

  async changeDate(){
    var newDate = this.loop.setDate(this.loop.getDate() - 1);
    this.loop = new Date(newDate);
    this.buildPath()
    if( !(await this.fc.itemExists(this.path)) && this.loop > this.start ) {
      await this.changeDate()
    }
  }

  initObserver(){
    let app = this
    var intersectionObserver = new IntersectionObserver(async function(entries) {
        if (entries.some(entry => entry.intersectionRatio > 0)) {
        await app.loadMessages()
        await app.changeDate()
        app.moveScroller()
        await app.loadMessages()
        while (app.messages.length < 10  && app.loop > app.start ){
          await app.changeDate()
          app.moveScroller()
          app.loadMessages()
        }
      }
    });
    intersectionObserver.observe(app.sentinel);
  }

  moveScroller(){
    this.scroller.appendChild(this.sentinel);
  }

  async subscribe(){
    var app = this
    let today = new Date()
    let month = ("0" + (today.getUTCMonth() + 1)).slice(-2);
    let day = ("0" + today.getUTCDate()).slice(-2);
    let year = today.getUTCFullYear();
    let ws_url = this.root+[year, month, day, "index.ttl#this"].join("/")
    var websocket = "wss://"+ws_url.split('/')[2];

    app.socket = new WebSocket(websocket);
    app.socket.onopen = function() {
      this.send('sub '+ws_url);
    };
    app.socket.onmessage = function(msg) {
      if (msg.data && msg.data.slice(0, 3) === 'pub') {
        app.checkNewMessage(ws_url)
      }
    };
  }
}

customElements.define('scroll-view', ScrollView);
