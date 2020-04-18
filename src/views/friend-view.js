import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class FriendView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      friend: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Friends"
    this.friend = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="card">
    <img class="card-img-top" src="https://solid.github.io/solid-ui/src/icons/noun_15059.svg" alt="Card image cap">
    <div class="card-body">
    <h5 class="card-title">${this.friend.name}</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
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

customElements.define('friend-view', FriendView);
