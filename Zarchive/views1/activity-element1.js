import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)
import './object-element.js'


class ActivityElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url: {type: String},
      activity: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Activity"
    this.url = ""
    this.activity = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container">

    <div class="row" id="${this.url}">
    Summary : ${this.activity.summary} /     Target : <a href="${this.activity.target}"
    target="_blank">${this.localName(this.activity.target)}</a>
    <br>
    </div>
    <div class="row">
    <object-element name="${this.name+'_object'}" url="${this.activity.object}">
    Loading object {this.activity.object}...</object-element>
    </div>
    </div>
    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    //  console.log(this.agent)
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
    //  this.init()
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //  console.log(`${propName} changed. oldValue: ${oldValue}`);
      if (`${propName}` == "url" && this.url != "undefined"){
        this.init()
      }
    });
  }

  async init(){
    //console.log(this.url)
    this.activity.object = await solid.data[this.url].as$object
    this.activity.target = await solid.data[this.url].as$target
    this.activity.summary = await solid.data[this.url].as$summary
    this.requestUpdate()
  }

  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }

}

customElements.define('activity-element', ActivityElement);
