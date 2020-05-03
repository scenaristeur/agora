import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)


class FriendsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      friends: {type: Array},
      followers: {type: Array},
      following: {type: Array},
      tab: {type: String},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Friends"
    this.config = {}
    this.friends = []
    this.followers = []
    this.following = []
    this.tab = "friends"
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
    <a class="nav-link active" tab="friends" @click="${this.openTab}" href="#">${this.friends.length} Friends</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" tab="following" @click="${this.openTab}" href="#">${this.following.length} Following</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" tab="followers" @click="${this.openTab}" href="#">${this.followers.length} Followers</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" tab="groups" @click="${this.openTab}" href="#">Groups</a>
    </li>
    </ul>
    </div>

    <div style="overflow-y:scroll;position:relative;height: 80wh;">

    <div class="card-deck" ?hidden="${this.tab != "friends"}">
    ${this.friends.map((f, i) => html`
      <friend-view name="${"Friend_"+i}" f_webId=${f}>Loading Friend</friend-view>
      `
    )}
    </div>

    <div class="card-deck" ?hidden="${this.tab != "following"}">
    ${this.following.map((f, i) => html`
      <friend-view name="${"Following_"+i}" f_webId=${f}>Loading Following</friend-view>
      `
    )}
    </div>

    <div class="card-deck" ?hidden="${this.tab != "followers"}">
    ${this.followers.map((f, i) => html`
      <friend-view name="${"Follower_"+i}" f_webId=${f}>Loading Follower</friend-view>
      `
    )}
    </div>

    <div class="card-deck" ?hidden="${this.tab != "groups"}">
    <groups-view name="Groups">Loading groups</groups-view>
    </div>


    </div>

    </div>
    `;
  }
  /*

  ${this.following.map((f, i) => html`
  <friend-view name="${"Following_"+i}" f_webId=${f}>Loading Following</friend-view>
  `
)}

${this.followers.map((f, i) => html`
<friend-view name="${"Followers_"+i}" f_webId=${f}>Loading Followers</friend-view>
`
)}
*/
openTab(e){
  this.tab = e.target.getAttribute("tab")
  //console.log(this.tab)
  let tablinks = this.shadowRoot.querySelectorAll(".nav-link");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  e.target.classList.add("active")
}

configChanged(config){
  console.log("CONFIG",config)
  this.config = config
  //  this.getFollowers()
  //  this.getFollowing()
  this.friends = this.config.friends || []
  this.followers = this.config.followers || []
  this.following = this.config.following || []
  //console.log("HIIIHAAAA",this.followers)
}

firstUpdated(){
  var app = this;
  this.agent = new HelloAgent(this.name);
  //console.log(this.agent)
  this.agent.receive = function(from, message) {
    //  console.log("messah",message)
    if (message.hasOwnProperty("action")){
      //  console.log(message)
      switch(message.action) {
        case "configChanged":
        app.configChanged(message.config)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };
}

}

customElements.define('friends-view', FriendsView);
