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
    this.hidden = false
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">


    <div ?hidden="${this.hidden}" class="jumbotron">
    <h1 class="display-4">Agora</h1>
    <p class="lead">
    The DecentraliShare app !<br>
    <b>Agora</b> is an POC to use ActivityPub
    (<a href="https://en.wikipedia.org/wiki/ActivityPub" target="_blank">En</a>)
    (<a href="https://fr.wikipedia.org/wiki/ActivityPub" target="_blank">Fr</a>)
    on top of the Solid Platform.</p>
    <hr class="my-4">

    <p>  If you want to use Agora, you must configure your POD.</p>
    <p>
    Agora needs to HIGH CONTROL of your POD to set authorizations on data created.<br>
    Although Agora limits its interaction to a specific folder of your POD,
    if you don't want Agora to access your entire favorite POD,
    you can <a class="btn btn-info btn-sm" href="https://solid.inrupt.com/get-a-solid-pod" target="_blank">create a new POD</a>
    </p>

    <p>
    To conform to ActivityPub, one user (you) must have two folders (inbox & outbox).<br>
    We decided to put them in your /public/ folder in a /shighl_test/ sub-folder (arbitrary for the moment & you can change it in the profil/config panel).<br>
    In that /shighl_test/ folder there is an "index.ttl" that reference "inbox" & "outbox" folder
    & that is referenced in your <b>publicTypeIndex</b> as a <b>Shighl</b> instance.<br><br>
    Some specials authorizations are set to the /inbox/ & /outbox/ folders:
    <ul>
    <li>
    <b>/inbox/</b> folder where you receive notifications of other users actions.
    <br>You keep full CONTROL and Authenticated Agent (Everyone with a POD) is a Submitter to your /inbox/  (they can write but not read)
    </li>
    <li>
    <b>/outbox/</b> folder where <b>activities</b> & <b>objects</b> that you create are stored.<br>
    You keep full CONTROL and authorizations for data stored in /activities/ & /objects/ sub-folders
    are set when you create that activities/objects,
    according to the recipient of that activity (Public, or a specific POD)
    </li>
    </ul>

    <br>
    </p>

    <p><b>To allow Agora to configure your POD,
    you must accept that this app can "CONTROL" your POD.</b><br>
    This can be done when you login for the first time
    on an app hosted on https://scenaristeur.github.io/
    by checking the last line of the authorization
    <br><br>
    <a href="./img/checkControl.png"
    target="_blank">
    <img src="./img/checkControl.png"
    class="img-fluid img-thumbnail"
    alt="Add https://scenaristeur.github.io to trustedApps">
    </a>
    <br>
    <br>
    If you miss it or if you have already logged on https://scenaristeur.github.io/ app but did not allow "CONTROL"
    you can add it in the preference of your POD by checking all 4 "Access Modes".
    <br><br>
    <a href="./img/trustedApps.png"
    target="_blank">
    <img src="./img/trustedApps.png"
    class="img-fluid img-thumbnail"
    alt="Add https://scenaristeur.github.io to trustedApps">
    </a>
    <br>
    </p>

    <p>
    At the end of the configuration, you should see a structure like this one on your POD (this example show you structure & some data in each )
    (followers, followning, liked are not ready, WIP).
    <br><br>
    <a href="./img/agora_folder.png"
    target="_blank"><img src="./img/agora_folder.png"
    class="img-fluid img-thumbnail"
    max-height="300px"
    alt="Add https://scenaristeur.github.io to trustedApps">
    </a>

    <p class="lead">
    If all is OK for you,
    <button class="btn btn-info" @click="${this.toggleHidden}">Toggle Help</button> and Login.
    <!--  <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>-->
    </p>
    </div>

    <button class="btn btn-info" ?hidden="${!this.hidden}" @click="${this.toggleHidden}">Help</button>

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
