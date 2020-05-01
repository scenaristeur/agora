import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class InfoElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "Info"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">


    <div class="jumbotron">
    <h1 class="display-4">Agora</h1>
    <p class="lead">
    The DecentraliShare app !<br>
    <b>Agora</b> is an POC to use ActivityPub
    (<a href="https://en.wikipedia.org/wiki/ActivityPub" target="_blank">En</a>)
    (<a href="https://fr.wikipedia.org/wiki/ActivityPub" target="_blank">Fr</a>)
    on top of the Solid Platform.</p>
    <hr class="my-4">

    To configure your POD you must take a look at the
    <a href="https://github.com/scenaristeur/agora/wiki/Agora" target="_blank" class="btn btn-info">Help & configuration on Wiki</a>

    <p>
    If you have any question or suggestion, feel free to ask on
    <a href="https://forum.solidproject.org/" target="_blank">Solid Community Forum</a>,
    or on <a href="https://github.com/scenaristeur/agora/blob/master/README.md"
    target="_blank">Agora project</a> repository.
    </p>

    <p><b>Last, but not least :</b> if you install Agora on your device, you can use it as a "Share with..." app... ;-) </p>
    <p class="lead">
    If all is OK for you,
    <button class="btn btn-info" @click="${this.showPanel}">Close Help</button> and Login.
    <!--  <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>-->
    </p>
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

          default:
          console.log("Unknown action ",message)
        }
      }
    };

  }

  showPanel(){
    this.agent.send("App", {action: "showPanel"})
    console.log("hide")
    let values = []
    values.info = false
    this.agent.send("Store", {action: "setStorage", values: values})
  }

}

customElements.define('info-element', InfoElement);
