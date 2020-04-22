import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class StoreElement extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      store: {type: Object},
      debug: {type: Boolean},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Store"
    this.store = {}
    this.debug = false
    this.webId = null
  }

  render() {
    return html`

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    store : ${JSON.stringify(this.store)}</br>
    <p>
    ${this.name} <br>    <button @click="${this.cleanStorage}">Clean</button><br><br>
    </p>
    </div>
    `;
  }

  firstUpdated(){
    //  console.log(this.name)
    super.firstUpdated()
    if (this.name != null){
      var app = this;
      //  this.agent = new HelloAgent(this.name);
      console.log(this.agent)
      this.agent.receive = function(from, message) {
        //  console.log("messah",message)
        if (message.hasOwnProperty("action")){
          //  console.log(message)
          switch(message.action) {
            case "setStorage":
            app.setStorage(message.values)
            break;
            case "getConfig":
            app.getConfig(from)
            break;
            case "webIdChanged":
            app.webIdChanged(message.webId)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    this.readStorage()
    this.agent.send("App", {action: "initFromStore", store: this.store})
  }

  webIdChanged(webId){
    console.log("WEBID CHANGED",webId, this.webId)
    //  this.webId = webId
    if (webId != null){
      console.log("WEBID NON NULL",webId, this.webId)
      if (webId == this.webId){
        console.log("WEBID IDENTIQUE")
      }else{
        console.log("WEBID DIFFERENT", webId, this.webId)
        this.store.config.webId = webId
        this.store.config.status = "WebId has changed : ",+webId
        this.agent.send("App", {action: "showPanel", panel: "Config"})
        this.agent.send("Config", {action: "newConfig", config: this.store.config})

      }
    }else{
      console.log("WEBID CHANGED IS NULL",this.webId)
      this.store.config = {}
    }
    console.log(this.webId)
    this.populateStorage()
  }


  getConfig(from){
    this.agent.sendMulti([from, "PostTabs", "Profile", "Friends", "ProfileCartouche"], {action: "configChanged", config: this.store.config})
  }


  readStorage(){
    this.store = JSON.parse(localStorage.getItem("agora")) || {info: true, config: {}}
    console.log("STORE : ",this.store)
  }

  setStorage(values){
    console.log(values)

    for (let [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      this.store[key] = value
    }
    console.log(this.store)
    this.populateStorage()
  }

  populateStorage(){
    localStorage.setItem("agora",JSON.stringify(this.store))
    this.readStorage()
  }

  updateStorage(data){
    this.store = data
    this.populateStorage()
    this.readStorage()
  }

  cleanStorage(){
    localStorage.removeItem("agora")
    this.readStorage()
  }

}

customElements.define('store-element', StoreElement);
