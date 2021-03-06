import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class InfoElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      hidden: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "Info"
    this.hidden = true
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <button class="btn btn-primary" ?hidden="${!this.hidden}" @click="${this.toggleHidden}">Help</button>
    <div class="container-fluid" ?hidden="${this.hidden}">
    <button class="btn btn-primary" @click="${this.toggleHidden}">Toggle Help</button>
    Hi, <b>Agora</b> is an POC to use ActivityPub system
    on top of the Solid Platform.<br><br>
    <ul>
    <li>
    First part show you the Notes that have already been published on Agora's public POD.
    </li>
    <li>
    If you want to use ActivityPub system, you must configure your POD (or create another POD for tests).<br>
    To conform to ActivityPub, one user (you) must have two folders : <br>
    <ul>
    <li>
    <b>/inbox/</b> folder where you receive notifications of other users actions.
    </li>
    <li>
    <b>/outbox/</b> folder where <b>activities</b> & <b>objects</b> that you create are stored.
    </li>
    </ul>
    We decided to put them in your /public/ folder in a /shighl_test/ sub-folder (arbitrary for the moment).
    <br>
    You can change that directory in the <b>Config Panel</b><br>
    In that /shighl_test/ folder there is an "index.ttl" that reference "inbox" & "outbox" folder & that is referenced in your <b>publicTypeIndex</b> as a <b>Shighl</b> instance.<br><br>
    Some specials authorizations are set to the /inbox/ & /outbox/ folders: <br>
    <ul>
    <li>
    /inbox/ : You keep full CONTROL and Authenticated Agent (Everyone with a POD) as a Submitter to your /inbox/
    </li>
    <li>
    /outbox/ : You keep full CONTROL and authorization of files stored in /activities/ & /objects/ sub-folders
    are set when you create that activities/objects,
    according to the recipient of that activity (Public, or a specific POD)<br>
    </li>

    </ul>

    <br>

    If you want, Agora can configure your POD for you.<br>
    To use the automatic configuration,
    you must accept that this app can "CONTROL" your POD.<br>
    This can be done checking the last line of the authorization
    when you login for the first time on an app hosted on https://scenaristeur.github.io/<br>
    <a href="./img/checkControl.png" target="_blank"><img src="./img/checkControl.png"  class="img-fluid img-thumbnail" alt="Add https://scenaristeur.github.io to trustedApps"/>
    </a>
    <br>
    If you miss it or if you have already logged on https://scenaristeur.github.io/ app but did not allow "CONTROL"
    you can add it in the preference of your POD. <br>
    (check your POD preferences).<br>
    <a href="./img/trustedApps.png" target="_blank"><img src="./img/trustedApps.png"  class="img-fluid img-thumbnail" alt="Add https://scenaristeur.github.io to trustedApps"/>
    </a>
    <br>
    <b>
    If you are afraid that Agora or other https://scenaristeur.github.io/ apps can control your POD,
    please create another test POD that is less sensible.</b><br>
    </li>
    </ul>
    <hr>

    <button class="btn btn-primary" @click="${this.toggleHidden}">Toggle Help</button>

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
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  toggleHidden(){
    this.hidden = !this.hidden
  }

}

customElements.define('info-element', InfoElement);
