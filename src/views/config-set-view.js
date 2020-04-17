import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class ConfigSetView extends BaseView {

  static get properties() {
    return {
      name: { type: String }
    };
  }

  constructor() {
    super();
    this.name = "Config SET"
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

customElements.define('config-set-view', ConfigSetView);
