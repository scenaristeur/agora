import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";


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

    ${this.friends.map((f, i) => html`
      <div class="col-sm-4">
      <friend-view name="${"Friend_"+i}" f_webId=${f}>Loading Friend</friend-view>
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

    async webIdChanged(webId){
      this.webId = webId
      if (webId != null){
        this.getFriends()
      }else{
        this.friends = []
      }
    }

    async getFriends(){
      let friends = []
      for await (const f of data[this.webId].friends){
        friends = [... friends, `${f}`]
      }
      this.friends = friends
    }

  }

  customElements.define('friends-view', FriendsView);
