import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class StatsView extends BaseView {
  render() {
    return html`
      <h1>Stats</h1>
      <p>
        Please check your URL.
      </p>
    `;
  }
}

customElements.define('stats-view', StatsView);
