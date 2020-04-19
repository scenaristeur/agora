import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class StoreElement extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      store: {type: Object},
      debug: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "Store"
    this.store = {}
    this.debug = false
  }

  render() {
    return html`
    <div ?hidden="${!this.debug}"
    <p>
    ${this.name} <br>
    <button @click="${this.cleanStorage}">Clean</button><br><br>

    Info hidden = ${this.store.infoHidden}<br>
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
            case "getInfoHidden":
            app.getInfoHidden()
            break;
            case "getConfig":
            app.getConfig(from)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }
    this.readStorage()
    this.getInfoHidden("Info")
    this.getConfig("Config")
  }

  getConfig(from){
    this.agent.sendMulti([from, "PostTabs", "Profile", "Friends"], {action: "configChanged", config: this.store.config})
  }

  getInfoHidden(from){
    this.agent.send("Info", {action: "hiddenChanged", hidden: this.store.infoHidden})
  }

  readStorage(){
    this.store = JSON.parse(localStorage.getItem("agora")) || {}
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
