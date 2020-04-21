import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class StatsView extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      message: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Modele"
    this.message = "un connu"
  }

  render() {
    return html`
    <h1>Stats</h1>
    <p>
    Please check your URL. ${this.message.value}
    </p>
    `;
  }

  firstUpdated(){
    super.firstUpdated()
    this.agent.send("App", {action:"webIdChanged", webId:"MonwebId"})
  }

  test(message){
    super.test(message)
    this.message = message
  }
}

customElements.define('stats-view', StatsView);
