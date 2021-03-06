import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

import  './post-dialog-element.js'; //https://gist.github.com/ErikHellman/9e17f2ea6a78669294ef2af4bc3f5878

class PostElement extends LitElement {

  static get properties () {
    return {
      name: {type: String},
      dialogVisible: {type: Boolean},
      webId: {type: String}
    }
  }

  constructor () {
    super()
    this.dialogVisible = false
    this.webId = null
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
      <button type="button" class="btn btn-primary btn-sm" @click="${this.toggleDialog.bind(this)}"><i class="fa fa-pen"></i></button>
      <post-dialog-element ?opened="${this.dialogVisible}"
      @dialog.accept="${this.closeDialog.bind(this)}"
      @dialog.cancel="${this.closeDialog.bind(this)}">
      </post-dialog-element>
      </div>
      `
      :html`
      <div class="d-flex align-items-center p-3 my-3 text-white-50 bg-purple rounded shadow-sm">
      <!--<img class="mr-3" src="Offcanvas%20template%20%C2%B7%20Bootstrap_fichiers/bootstrap-outline.svg" alt="" width="48" height="48">-->
      <div class="lh-100">
      <h6 class="mb-0 text-white lh-100">
      <div class="row">
      You must login to post a spog!
      </div>
      </h6>
      <!--    <small>Since 2011</small>-->
      </div>
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
