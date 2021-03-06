import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)


class FriendView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      f_webId: {type: String},
      f_photo: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Friend"
    this.f_webId = ""
    this.f_photo = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="card">
    ${this.f_photo.length > 0 ?
    html`<img class="rounded-circle card-img-top" src="//images.weserv.nl/?url=${this.f_photo}&w=150&h=150" title="${this.f_photo}" alt="no image">`
    :html`<i class="fas fa-user-circle fa-2x" title="${this.f_name}"></i>`
  }

<!--    <img class="card-img-top" src="//images.weserv.nl/?url=${this.f_photo}&w=150&h=150"  alt="${this.f_name}">-->
    <div class="card-body">
    <!--  <h5 class="card-title">${this.f_name}</h5>
    <p class="card-text"> ${this.f_webId} With supporting text below as a natural lead-in to additional content.</p>-->
    <button class="btn btn-outline-info btn-sm" webId="${this.f_webId}"
    @click="${this.showProfile}">${this.f_name}</button>
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

showProfile(e){
  let webId = e.target.getAttribute("webId")
  //  console.log(webId)
  this.agent.send("App", {action: "pageChanged", page: "profile"})
  this.agent.send("Profile", {action: "profileChanged", webId: webId})
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
  this.init()
}

async init(){
  let name = await solid.data[`${this.f_webId}`].vcard$fn || `${this.f_webId}`.split("/")[2].split('.')[0];
  let photo = await solid.data[`${this.f_webId}`].vcard$hasPhoto || "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  this.f_name = `${name}`
  this.f_photo = `${photo}`!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
  this.requestUpdate()
}

}

customElements.define('friend-view', FriendView);
