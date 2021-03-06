import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import * as auth from 'solid-auth-client';
//import data from "@solid/query-ldflex";

class LoginElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.webId = null
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    ${this.webId == null ?
      html`
      <button type="button" class="btn btn-success" @click=${this.login}>Login</button>
      `
      : html`
      <button type="button" class="btn btn-sm btn-outline-danger" @click=${this.logout}>Logout</button>
      `
    }
    `;
  }

  firstUpdated(){
    var app = this
    this.agent = new HelloAgent(this.name);
    auth.trackSession(async function(session) {
      if (!session){
        app.webId=null
        app.agent.sendMulti(['App','Config', 'Fab', 'Post', 'PostTabs', 'Profile'],  {action:"webIdChanged", webId: app.webId});
      }
      else{
        app.webId = session.webId
        app.agent.sendMulti(['App','Config', 'Fab', 'Post', 'PostTabs', 'Profile'], {action:"webIdChanged", webId: app.webId});
      }
    })

    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "logout":
          app.logout(null)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  login() {
    this.popupLogin();
  }

  logout() {
    let wi = this.webId
    auth.logout().then(() => alert('Goodbye '+wi+' !'));
  }

  async popupLogin() {
    let session = await auth.currentSession();
    let popupUri = './dist-popup/popup.html';
  //  let popupUri = 'https://solid.community/common/popup.html';
    if (!session)
    session = await auth.popupLogin({ popupUri });
  }
}

customElements.define('login-element', LoginElement);
