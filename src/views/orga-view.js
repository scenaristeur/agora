import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class OrgaView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Orga"
    this.webId = null
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="card shadow mb-4">
    <div class="card-header py-3">
    <h6 class="m-0 font-weight-bold text-primary">${this.name}</h6>
    </div>
    <div class="card-body">
    <div class="text-center">
    <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="img/orga.png" alt="">
    </div>
            <p>R${this.webId}R</p>
            <p>${this.webId!=null}</p>
    <p>Build Teams to Collabore on Projects</p>
    <!--  <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on unDraw &rarr;</a>
    -->
    <friends-view name="Friends" ?hidden="${this.webId!=null}">Loading friends</friends-view>
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
  }

}

customElements.define('orga-view', OrgaView);
