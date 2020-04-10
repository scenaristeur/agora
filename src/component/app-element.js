import { LitElement, html } from 'lit-element';

class AppElement extends LitElement {

  static get properties() {
    return {
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "world"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container">
    Hello <b>${this.something}</b> from app-element
    <button class="btn btn-primary">HEllo</button>
    </div>
    `;
  }

}

customElements.define('app-element', AppElement);
