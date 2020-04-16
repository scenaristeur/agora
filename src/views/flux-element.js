import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class FluxElement extends BaseView {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "Flux"
  }

  render(){
    return html`
  <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
    </div>
    `;
  }

  firstUpdated(){
}

}

customElements.define('flux-element', FluxElement);
