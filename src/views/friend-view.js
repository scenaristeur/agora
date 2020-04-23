import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class FriendView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      f_webId: {type: String},
      friend: {type: Object},
    };
  }

  constructor() {
    super();
    this.name = "Friend"
    this.f_webId = ""
    this.friend = {webId:"", name:"", photo: ""}
  }

  render1(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="card" style="width: 18rem;">
    <img class="card-img-top" src="..." alt="Card image cap">
    <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
    </div>
    `}



  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="card bg-light m-3" style="width: 8rem;">
    ${this.friend.photo.length > 0 ?
      html`<img class="rounded-circle card-img-top"
      src="//images.weserv.nl/?url=${this.friend.photo}&w=100&h=100"
      style="height:5rem,width:5rem"
      title="${this.friend.photo}"
      alt="no image">`
      :html`<i class="fas fa-user-circle fa-2x" title="${this.friend.name}"></i>`
    }

    <!--    <img class="card-img-top" src="//images.weserv.nl/?url=${this.friend.photo}&w=150&h=150"  alt="${this.friend.name}">-->
    <div class="card-body p-1">
    <!--  <h5 class="card-title">${this.friend.name}</h5>
    <p class="card-text"> ${this.friend.webId} With supporting text below as a natural lead-in to additional content.</p>-->
    <button class="btn btn-outline-info btn-sm" webId="${this.friend.webId}"
    @click="${this.showProfile}">${this.friend.name}</button>
    </div>
    </div>
    `;
  }

  /* test photo
  ${this.f_photo.length > 0 ?
  html`<img class="rounded-circle user_img_msg" src="//images.weserv.nl/?url=${this.f_photo}&w=144&h=144" title="${this.f_photo}" alt="no image">`
  :html`<i class="fas fa-user-circle fa-2x" title="${this.f_name}"></i>`
}
*/

showProfile(){
  //  let webId = e.target.getAttribute("webId")
  console.log("CLICKED friend",this.friend)
  this.agent.send("App", {action: "showPanel", panel: "Profile"})
  this.agent.send("Profile", {action: "profileChanged", profile: this.friend})
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
        case "webIdChanged":
        app.webIdChanged(message.webId)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };
  this.friend.webId = this.f_webId

  this.init()
}

async init(){
  let name = await solid.data[`${this.f_webId}`].vcard$fn || `${this.f_webId}`.split("/")[2].split('.')[0];
  let photo = await solid.data[`${this.f_webId}`].vcard$hasPhoto || "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  this.friend.name = `${name}`
  this.friend.photo = `${photo}`!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  //  console.log("friend", this.friend, this.f_webId)

  this.requestUpdate()
}

}

customElements.define('friend-view', FriendView);
