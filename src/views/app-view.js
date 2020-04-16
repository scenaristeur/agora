import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class AppView extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Modele"
    this.webId = "NN"

  }


  render() {

    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element<br>
    wI ${this.webId} WI
    </div>
    `;
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated(){
    super.firstUpdated()
    console.log("FU")
    console.log(this.agent)
  }

  webIdChanged(webId){
    super.webIdChanged(webId)
    console.log("supercharger")
    this.agent.send("Stats", {action: "test", value:"HELLLLLLLO"})
  }

}

customElements.define('app-view', AppView);
