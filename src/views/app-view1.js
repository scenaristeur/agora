import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class AppView extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      webId: {type: String},
      share: {type: String},
      agoraPod: {type: String},
      page: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.webId = ""
    this.share = {}
    this.agoraPod = ""
    this.page = "flux"
    this.onLoad()

  }


  render() {

    return html`
    <store-element name="Store">Loading Store</store-element>
    <div class="row">
    <info-element name="Info">Loading Info</info-element>
    </div>

    Page : ${this.page}
    <div class="row">
    <div class="col-sm">
    ${this.webId != null?
      html`
      <profil-cartouche-element name="ProfilCartouche" webId="${this.webId}">Loading</profil-cartouche-element>
      <!--<post-basic-element name="PostBasic" .share="${this.share}">Loading</post-basic-element>-->
      <post-element name="Post" .share="${this.share}">Loading Post</post-element>

      `
      :html``}

      <login-element name="Login">Loading</login-element>
      </div>
      <div class="col-sm-4 col-md-6">
      <div ?hidden="${this.webId == null || this.page != "userProfile"}" >
      <user-profile-view name="UserProfile">Loading userProfile</user-profile-view>
      </div>


      <div ?hidden="${this.webId == null || this.page != "config"}" >
      <config-get-view name="ConfigGet">Loading Config Get</config-get-view>
      <!--      <config-set-view name="ConfigSet">Loading Config Set</config-set-view>-->
      </div>
      <profile-element ?hidden="${this.page != "profile"}" name="Profile">Loading Profil</profile-element>
      <flux-element name="Flux" ?hidden="${this.page !="flux"}" agoraPod="${this.agoraPod}">Loading</flux-element>
      </div>
      <div class="col-sm">
      <!--  <config-element name="Config">Loading</config-element> -->


      <!--      <menu-element name="Menu">Loading</menu-element>-->

      </div>

      </div>
      <fab-element name="Fab" ?hidden="${this.webId == null}">Loading FAb<</fab-element>
      <!--    <app-old-element name="AppOld">Loading App old</app-old-element>
      -->

      `;
    }

    createRenderRoot() {
      return this;
    }

    firstUpdated(){
      super.firstUpdated()
    }

    webIdChanged(webId){
      super.webIdChanged(webId)
      //  this.page = "config"
      console.log("supercharger")
    }

    onLoad() {
      var parsedUrl = new URL(window.location.toString());
      //  console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || ""
      this.share.text = parsedUrl.searchParams.get("text") || ""
      this.share.url = parsedUrl.searchParams.get("url") || ""
      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
      //console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }

    }

  }

  customElements.define('app-view', AppView);
