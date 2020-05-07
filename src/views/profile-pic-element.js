import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ProfilePicElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      photo: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "ProfilePic"
    this.webId = ""
    this.photo = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    .chat_img {
      float: left;
      width: 11%;
    }
    img{ max-width:100%;}
    </style>

    <div class="container-fluid">
    wi : ${this.webId}<br>
    ph: ${this.photo}
    <div class="chat_img"
    webId="${this.webId}"
    @click="${this.showProfile}">
    <img class="rounded-circle" src="${this.photo}" webId="${this.webId}" alt="."> </div>
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
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  //  this.init()
  }

  async updated(){
    console.log(`${this.webId}`)
    let photo = await solid.data[`${this.webId}`].vcard$hasPhoto
    this.photo = `${photo}` //!= "undefined" ? `${photo}` : "https://solid.github.io/solid-ui/src/icons/noun_15059.svg"
    //this.requestUpdate()
  }

}

customElements.define('profile-pic-element', ProfilePicElement);
