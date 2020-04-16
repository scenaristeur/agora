import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class AppView extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      webId: {type: String},
      share: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.webId = ""
    this.share = {}
    this.onLoad()

  }


  render() {

    return html`

    <div class = "row">
    <div class="col-sm">
    ${this.webId != null?
      html`
      <profil-cartouche-element name="ProfilCartouche" webId=${this.webId}>Loading</profil-cartouche-element>
      <post-basic-element name="PostBasic" .share="${this.share}">Loading</post-basic-element>
      `
      :html`-`}

      <login-element name="Login">Loading</login-element>
      </div>
      <div class="col-sm-4 col-md-6">
      <flux-element name="Flux">Loading</flux-element>
      </div>
      <div class="col-sm">
      <menu-element name="Menu">Loading</menu-element>
      </div>

      </div>

      <hr>
      OLD APP TEST
      <!--    <app-old-element name="AppOld">Loading App old</app-old-element>
      -->


      Hello <b>${this.name}</b> from app-element<br>
      wI ${this.webId} WI
      <button id="test" class="btn btn-primary" @click="${this.click}">BB</button>
      </div>
      `;
    }

    createRenderRoot() {
      return this;
    }

    firstUpdated(){
      super.firstUpdated()
      console.log("FU")
      console.log(this.agent)
    }

    webIdChanged(webId){
      super.webIdChanged(webId)
      console.log("supercharger")
      this.agent.send("Stats", {action: "test", value:"HELLLLLLLO"})
    }

    onLoad() {
      console.log(this)
      console.log("SHADOW",document.getElementById("test"))
      var parsedUrl = new URL(window.location.toString());
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || ""
      this.share.text = parsedUrl.searchParams.get("text") || ""
      this.share.url = parsedUrl.searchParams.get("url") || ""
      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
      console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }
    }

  }

  customElements.define('app-view', AppView);
