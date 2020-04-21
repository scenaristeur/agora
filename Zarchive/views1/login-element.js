import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//import { BaseView } from './base-view.js';
//import * as auth from 'solid-auth-client';
////let data = solid.data
//console.log("LDFK+LEX",data)

class LoginElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      destinataires: {type: String}
    };
  }

  constructor() {
    super();
    this.webId = null
    this.destinataires = [
      'App','Config', 'ConfigGet', 'Fab', 'Post', 'PostTabs', 'Profile', 'ProfileCartouche', 'Friends']
    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">

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
      var app = this;
      this.agent = new HelloAgent(this.name);
      console.log(this.agent)
      this.agent.receive = function(from, message) {
        console.log("messah",message)
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
      solid.auth.trackSession(async function(session) {
        if (!session){
          app.webId=null
          console.log("WWWWWWWWWWWWWGGGGGGGGGGGGGGG",app.webId)
          app.agent.sendMulti(app.destinataires,  {action:"webIdChanged", webId: app.webId});
        }
        else{
          app.webId = session.webId
          console.log("WWWWWWWWWWWWWGGGGGGGGGGGGGGG",app.webId)
          app.agent.sendMulti(app.destinataires, {action:"webIdChanged", webId: app.webId});
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
      solid.auth.logout().then(() => alert('Goodbye '+wi+' !'));
    }

    async popupLogin() {
      let session = await solid.auth.currentSession();
      let popupUri = './dist-popup/popup.html';
      //  let popupUri = 'https://solid.community/common/popup.html';
      if (!session)
      session = await solid.auth.popupLogin({ popupUri });
    }
  }

  customElements.define('login-element', LoginElement);
