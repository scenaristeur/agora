import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import './agora-inbox-element.js'
import './login-element.js'
import './friends-element.js'
import './config-element.js'
import './post-panel-element.js'
import './inbox-element.js'
import './outbox-element.js'
import './info-element.js'
import './fab-element.js';
import './post-element.js';
import './profile-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraPod: {type: String},
      page: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "world"
    this.agoraPod = "https://agora.solid.community/profile/card#me"
    this.page = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <info-element name="Info">Loading Login</info-element>

    <div class="container">

    <login-element name="Login">Loading Login</login-element>
<br>
<a href="sharetarget.html">share target</a>
    <br>
    <profile-element name="Profile" ?hidden="${this.page != 'Profile'}">Loading Profile...</profile-element>
    <post-element name="Post"></post-element>
    <agora-inbox-element name="AgoraInbox" agoraPod="${this.agoraPod}">Loading Agora Inbox</agora-inbox-element>

    <!--    <post-panel-element name="PostPanel">Loading Post Panel</post-panel-element>-->
    <!--<inbox-element name="Inbox">Loading Inbox</inbox-element>
    <outbox-element name="Outbox">Loading Outbox</outbox-element>-->
    <config-element name="Config">Loading Config...</config-element>

    <fab-element name="Fab"></fab-element>

  <!--  <button class="btn btn-primary" @click="${this.install}">Install</button> -->

    </div>
    `;
  }

/*
install(){
//  buttonInstall.addEventListener('click', (e) => {
  // Hide the app provided install promotion
  hideMyInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  })
//});
}*/


  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "pageChanged":
          app.pageChanged(message.page)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    //  this.init()
  }

  pageChanged(page){
    console.log(page)
    this.page = page
  }

  async init(){
    console.log(this.agoraPod)
    const rdf = new RDFeasy(auth)
    console.log(rdf)
    let nom =   await rdf.value(this.agoraPod,`
      SELECT ?name WHERE { <> vcard:fn ?name. }`)
      console.log("TEST accès POD, NOM :",nom)
    }

  }

  customElements.define('app-element', AppElement);
