import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class NotFoundView extends BaseView {
  render() {
    return html`
      <h1>View not found!</h1>
      <p>
        Please check your URL.
      </p>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
