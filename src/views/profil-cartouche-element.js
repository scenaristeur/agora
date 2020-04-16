import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class ProfilCartoucheElement extends BaseView {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Profil Cartouche"
    this.webId = ""
  }

  render(){
    return html`
    <button class="btn btn-sm btn-outline-primary" @click="${this.editProfil}">${this.webId}</button>
    `;
  }

  editProfil(){
    console.log("EDIT PROFIL",this.webId)
  }

  firstUpdated(){
    super.firstUpdated()
  }

}

customElements.define('profil-cartouche-element', ProfilCartoucheElement);
