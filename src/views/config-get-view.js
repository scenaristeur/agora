import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class ConfigGetView extends BaseView {

  static get properties() {
    return {
      name: { type: String }
    };
  }

  constructor() {
    super();
    this.name = "Config GET"
  }

  render() {
    return html`
    <h1>Modele</h1>
    <p>
    Please check your URL. ${this.name}
    </p>
    `;
  }

  firstUpdated(){
    super.firstUpdated()
  }

}

customElements.define('config-get-view', ConfigGetView);
