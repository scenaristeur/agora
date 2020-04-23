import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

import  './post-dialog-element.js'; //https://gist.github.com/ErikHellman/9e17f2ea6a78669294ef2af4bc3f5878

class PostElement extends LitElement {

  static get properties () {
    return {
      name: {type: String},
      dialogVisible: {type: Boolean},
      webId: {type: String},
      share: {type: Object}
    }
  }

  constructor () {
    super()
    this.dialogVisible = false
    this.webId = null
    this.share = {}
  }

  render () {
    console.log('Dialog visible:', this.dialogVisible)
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/offcanvas.css" rel="stylesheet">

    ${this.webId != null ?
      html`
      <div>
      <button type="button"
      class="btn btn-primary btn-sm"
      @click="${this.toggleDialog.bind(this)}"><i class="fa fa-pen"></i></button>

      ( Write Note, Load Media , then go back to Agora/Flow panel, and refresh manually, Sorry the auto refresh is Work in progress )
      <post-dialog-element ?opened="${this.dialogVisible}"
      @dialog.accept="${this.closeDialog.bind(this)}"
      @dialog.cancel="${this.closeDialog.bind(this)}"
      .share="${this.share}">
      </post-dialog-element>
      </div>
      `
      :html`
      <div class="btn btn-sm btn-outline-info">
      You must login to post a spog!
      </div>
      `

    }

    `
  }

  toggleDialog (e) {
    this.dialogVisible = !this.dialogVisible
    //  console.log(this.dialogVisible)
    var messRep = {action:"setReplyTo" }
    this.agent.send("PostTabs", messRep)
  }

  closeDialog (e) {
    //  console.log(e)
    this.dialogVisible = false
  }



  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "toggleWrite":
          app.toggleWrite(message);
          break;
          case "webIdChanged":
          app.webIdChanged(message.webId);
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.share.show == true ? this.toggleWrite() : "";
  }

  toggleWrite(message){
    console.log(message)
    this.toggleDialog(message)
  }

  webIdChanged(webId){
    this.webId = webId
  }

}

customElements.define('post-element', PostElement);
