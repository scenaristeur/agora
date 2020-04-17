import { html } from 'lit-element';
import { BaseView } from './base-view.js';
import * as auth from 'solid-auth-client';
//import data from "@solid/query-ldflex";

class LoginElement extends BaseView {

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
    super.firstUpdated()
    let app = this
    auth.trackSession(async function(session) {
      if (!session){
        app.webId=null
        app.agent.sendMulti(['App','Config', 'ConfigGet', 'Fab', 'Post', 'PostTabs', 'Profile'],  {action:"webIdChanged", webId: app.webId});
      }
      else{
        app.webId = session.webId
        app.agent.sendMulti(['App','Config', 'ConfigGet', 'Fab', 'Post', 'PostTabs', 'Profile'], {action:"webIdChanged", webId: app.webId});
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
