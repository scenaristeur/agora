import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ComposeView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      share: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Compose"
    this.webId = null
    this.share = {}
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
    <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="img/compose.png" alt="">
    </div>
<!--    <p>${this.webId}</p>-->

    <p>Create & compose new Notes, Medias, Triples & Graphs!</p>
    <post-element name="Post" .share="${this.share}">Loading Post</post-element>
    <!--  <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on unDraw &rarr;</a>
    -->  </div>
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

customElements.define('compose-view', ComposeView);