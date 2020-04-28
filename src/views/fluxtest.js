import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as SolidFileClient from "solid-file-client"

class FluxElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      counter: {type: Number},
      agoraPod: {type: String},
      date: {type: Object},
      offset: {type: Number},
      notifications: {type: Array},
      end: {type: Object},
      loop: {type: Object},
      chargees: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Flux"
    this.agoraPod = ""
    this.counter = 0
    this.offset = 0
    this.debug = true
    let dateObj = new Date();
    this.date = {}
    this.date.month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
    this.date.day = ("0" + dateObj.getUTCDate()).slice(-2);
    this.date.year = dateObj.getUTCFullYear();
    this.notifications = []
    this.chargees = []
    this.loop = new Date();
    this.end = new Date("04/26/2020"); // 09 AVRIL
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
      height: 550px;
      overflow-y: scroll;
    }
    </style>

    <div class="container-fluid">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    <!--    config : ${JSON.stringify(this.config)}</br>-->
    counter : ${this.counter}<br>
    offset: ${this.offset}<br>
    notifications: ${this.notifications.length}<br>
    date: ${this.loop}
    </div>

    <div id="scroller">
    <div id="sentinel">Loading messages...</div>
    </div>
    </div>

    <websocket-element name="WebsocketFlux">Loading Websocket</websocket-element>
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
          case "websocketMessage":
          app.websocketMessage(message.url)
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

    this.init()
  }

  async websocketMessage(ws_url){
    console.log(ws_url)
    let url = ws_url+"#this"
    await solid.data.clearCache()
    let notifications = this.notifications
    for await (const notif of solid.data[url]['https://www.w3.org/ns/activitystreams#item']){
      //    console.log(`${notif}`)

      if (!notifications.includes(`${notif}`)){
        notifications.push(`${notif}`)
        //  this.scroller.appendChild(this.sentinel);
        //  this.addItem(`${notif}`)
        var newItem1 = document.createElement('notification-line-element');
        newItem1.classList.add('item');
        //newItem1.textContent = i+' Item ' + this.counter++;
        newItem1.setAttribute("url", `${notif}`)
        newItem1.setAttribute("name", "Notif_"+notifications.length)
        this.scroller.prepend(newItem1);

      }

    }
    this.notifications = notifications
    //  console.log("NEW ! ", this.notifications)
  }


  async init(){
    console.log("PATH")
    await this.initPath()
    console.log("OBSERVER")
    this.initObserver()
    //  console.log("NOTIF")
    //  this.getNotif()
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
    this.inbox = await solid.data[instance].as$inbox
    this.log = 'Inbox : '+this.inbox
    this.agent.send("WebsocketFlux", {action: "urlChanged", url: `${this.inbox}`})
  }


  addItem(i){
    //console.log("add ",i)
    /*var newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.textContent = i+' Item ' + this.counter++;
    this.scroller.appendChild(newItem);*/

    var newItem1 = document.createElement('notification-line-element');
    newItem1.classList.add('item');
    //newItem1.textContent = i+' Item ' + this.counter++;
    newItem1.setAttribute("url", i)
    newItem1.setAttribute("name", "Notif_"+this.notifications.length)
    this.scroller.appendChild(newItem1);

  }



async loadItems(c){
  let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
  let day = ("0" + this.loop.getUTCDate()).slice(-2);
  let year = this.loop.getUTCFullYear();

  let path = this.inbox+[year, month, day, "index.ttl#this"].join("/")
let chargees = []
  if( await this.fc.itemExists(path) ) {
    for await (const notif of solid.data[path]['https://www.w3.org/ns/activitystreams#item']){
      chargees.push(`${notif}`)
    }
  }
  this.chargees = chargees
/*
  for (let i = 0 ; i<c; i++){
  this.chargees = [...this.chargees, path]
}*/
  console.log(this.chargees)

  console.log("CHARGEES LENGTH",this.chargees.length)
  this.scroller.appendChild(app.sentinel);

  while(this.chargees.length > 0){
    let current = this.chargees.pop()
    console.log("current",current, "chargees length",this.chargees.length)
    this.addItem(current)
  }


  var newDate = this.loop.setDate(this.loop.getDate() - 1);
  this.loop = new Date(newDate);
  console.log("Changement de date",this.loop)

}


  async  loadItems4(c) {
    let app = this
    console.log("Chargement de ",c)

    while(this.loop >= this.end && this.chargees < c){
      this.sentinel.innerHTML = "Loading "+this.loop.toLocaleDateString()
      let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
      let day = ("0" + this.loop.getUTCDate()).slice(-2);
      let year = this.loop.getUTCFullYear();
      let path = this.inbox+[year, month, day, "index.ttl#this"].join("/")

      /* for (let i = 0 ; i<c; i++){
      this.chargees = [...this.chargees, path]
    }*/

    if( await this.fc.itemExists(path) ) {
      for await (const notif of solid.data[path]['https://www.w3.org/ns/activitystreams#item']){
        console.log(`${notif}`)
        this.chargees = [...this.chargees, `${notif}`]
        this.addItem(`${notif}`)
      }
    }


    var newDate = this.loop.setDate(this.loop.getDate() - 1);
    this.loop = new Date(newDate);

    console.log("CHARGEES LENGTH",this.chargees.length)

    while(this.chargees.length > 0){
      let current = this.chargees.pop()
      console.log("current",current, "chargees length",this.chargees.length)
      this.addItem(current)
    }

  }

  if(this.loop < this.end){
    this.sentinel.innerHTML = "No older message"
  }

}


async  loadItems3(c) {
  let app = this
  console.log("Chargement de ",c)
  while(this.loop >= this.end){
    console.log("loading notif from",this.loop)
    if (this.chargees.length != 0){
      console.log("chargees.length", chargees.length)
      while (this.chargees.length > 0)
      {
        // do stuff to each element stored in current
        let current = this.chargees.pop()
        console.log(this.chargees.length, current)
        this.addItem(current)
      }
    }else{
      let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
      let day = ("0" + this.loop.getUTCDate()).slice(-2);
      let year = this.loop.getUTCFullYear();

      let path = this.inbox+[year, month, day, "index.ttl#this"].join("/")

      if( await this.fc.itemExists(path) ) {
        for await (const notif of solid.data[path]['https://www.w3.org/ns/activitystreams#item']){
          this.chargees = [... this.chargees, `${notif}`]
        }
      }

      var newDate = this.loop.setDate(this.loop.getDate() - 1);
      this.loop = new Date(newDate);
      console.log("Changement de date",this.loop)
    }
  }

}

async  loadItems2(c) {
  let app = this

  if (this.chargees.length == 0){
    console.log("CHARGEES VIDES", this.chargees.length)
    while(this.loop >= this.end && c > 0){ //
      console.log(this.loop, c);
      this.sentinel.innerHTML = "Loading "+this.loop.toLocaleDateString()
      let month = ("0" + (this.loop.getUTCMonth() + 1)).slice(-2); //months from 1-12
      let day = ("0" + this.loop.getUTCDate()).slice(-2);
      let year = this.loop.getUTCFullYear();

      let path = this.inbox+[year, month, day, "index.ttl#this"].join("/")
      console.log("PATH",path)
      //  let notifications = this.notifications

      //  await solid.data.clearCache()
      if( await this.fc.itemExists(path) ) {
        for await (const notif of solid.data[path]['https://www.w3.org/ns/activitystreams#item']){
          console.log(`${notif}`)

          if (!this.chargees.includes(`${notif}`)){
            //  notifications.push(`${notif}`)
            this.chargees = [... this.chargees, `${notif}`]
            console.log(this.chargees)
            app.scroller.appendChild(app.sentinel);
            this.addItem(`${notif}`)
          }else{
            console.log(("deja include", this.chargees.length))
          }
          c--
        }
      }else{
        console.log("DON't EXIST : ",path)
      }
      //  this.notifications = notifications
      //  console.log(this.notifications)

      //this.addItem(`${notif}`)
      console.log("C : ",c)

      var newDate = this.loop.setDate(this.loop.getDate() - 1);
      this.loop = new Date(newDate);

    }
  }else{
    console.log("CHARGEES ",this.chargees)
  }

  if(this.loop < this.end){
    this.sentinel.innerHTML = "No older message"
  }
  /*    let d = new Date();
  d.setDate(d.getDate() - this.offset);
  console.log("new date",d, this.offset, this.notifications.length)
  console.log(new Date(d) > new Date('15/04/2020 00:00'))

  while (new Date(d) > new Date('15/04/2020 00:00')){
  this.offset++
  this.loadItems(n)
}*/
}


loadItems1(n) {
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

async getNotifORI(){
  let app = this
  let notifications = []
  for await (const subject of solid.data[this.inbox].subjects){
    //    console.log(`${subject}`)
    if(`${subject}` != this.inbox){
      let n = {}
      n.url = `${subject}`+'#this'
      /* */
      notifications.push(n)
      app.log = "Notifications : "+notifications.length
    }
  }
  //console.log(notifications)
  this.notifications = notifications
}

async getNotif1(){
  let notifications = []
  let dateObj = new Date();
  this.date = {}
  this.date.month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
  this.date.day = ("0" + dateObj.getUTCDate()).slice(-2);
  this.date.year = dateObj.getUTCFullYear();

  this.path = this.inbox+[this.date.year, this.date.month, this.date.day, "index.ttl#this"].join("/")
  console.log(this.path)

  for await (const notif of solid.data[this.path]['https://www.w3.org/ns/activitystreams#item']){
    console.log(`${notif}`)
    //  if(`${subject}` != inbox){
    let n = {}
    n.url = `${notif}`
    /* */

    notifications.push(n)
    //  this.addItem(n.url)
    //  app.log = "Notifications : "+notifications.length
    //  }
  }
  console.log(notifications)
  //  this.notifications = notifications
  //  this.load()
}

/*  load(){
this.offset++
let d = new Date();
d.setDate(d.getDate() - this.offset);
console.log("new date",d)
while(this.offset < 4){
this.load()
}
}*/


}

customElements.define('flux-element', FluxElement);
