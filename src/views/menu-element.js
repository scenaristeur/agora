import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class MenuElement extends BaseView {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "Menu"
  }

  render(){
    return html`
    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
    </div>
    `;
  }

  firstUpdated(){
    super.firstUpdated()
  }

}

customElements.define('menu-element', MenuElement);
