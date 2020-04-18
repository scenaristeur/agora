import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class FriendsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      friends: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Friends"
    this.friends = []
    this.friends.push({name:"one"})
    this.friends.push({name:"one"})
    this.friends.push({name:"one"})
    this.friends.push({name:"one"})
    this.friends.push({name:"one"})
    this.friends.push({name:"one"})
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">

    <div class="card text-center">
    <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs">
    <li class="nav-item">
    <a class="nav-link active" href="#">Friends</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Following</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Followers</a>
    </li>
    </ul>
    </div>
    <div class="card-body">

    <div class="row" style="overflow-y:scroll;position:relative;height: 300px;">

    ${this.friends.map(f => html`
      <div class="col-sm-12">
      <friend-view name="Friend" .friend=${f}>Loading Friend</friend-view>
      </div>
      `)}


    </div>

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

customElements.define('friends-view', FriendsView);
