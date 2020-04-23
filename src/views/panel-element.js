import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class PanelElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      p: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Panel"
    this.p = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <div class="card shadow mb-4" >
    <div class="card-header py-3">
    <h6 class="m-0 font-weight-bold text-primary">${this.p.name}</h6>
    </div>
    <div class="card-body">
    <div class="text-center">
    <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="height: 10rem;" src="${this.p.image}" alt="">
    </div>
    <p>${this.p.text}</p>
    <button class="btn btn-outline-info"  panel="${this.p.name}" @click="${this.showPanel}">${this.p.name}</button>
    </div>
    </div>

    `;
  }

  showPanel(e){
    let panel =e.target.getAttribute("panel")
    this.agent.send("App", {action: "showPanel", panel: panel})
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
  }

}

customElements.define('panel-element', PanelElement);
