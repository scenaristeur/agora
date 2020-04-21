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
    <ul class="nav flex-column">
    <li class="nav-item">
    <button class="nav-link btn btn-outline-info" href="#">Home</button>
    </li>
    <li class="nav-item">
    <button class="nav-link" href="#">Profile</button>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Config</a>
    </li>
    <li class="nav-item">
    <a class="nav-link disabled" href="#">Disabled</a>
    </li>
    </ul>
    `;
  }

  firstUpdated(){
    super.firstUpdated()
  }

}

customElements.define('menu-element', MenuElement);
