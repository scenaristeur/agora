import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class AppView extends BaseView {

  static get properties() {
    return {
      name: { type: String },
      webId: {type: String},
      share: {type: String},
      agoraPod: {type: String},
      panel: {type: String},

      page: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.webId = null
    this.share = {}
    this.agoraPod = ""
    this.panel = null

    this.page = "flux"
    this.onLoad()

  }


  render() {

    return html`
    <div class="container">
    <div class="row">

    Panel : ${this.panel} /
    <post-element name="Post" .share="${this.share}">Loading Post</post-element>
    | Public | Chat | Friends | Profil | <info-element name="Info">Loading Info</info-element>
    <button @click={this.panel = "boo"}>PAN</button>

    </div>

    <fab-element name="Fab" ?hidden="${this.webId == null}">Loading Fab</fab-element>
    <div class="row" ?hidden="${this.panel!=null}">  <!-- style="height:50vh" -->
    <div class="col-sm">
    <flow-view name="Flow" webId="${this.webId}" agoraPod="${this.agoraPod}"><flow-view>
    </div>
    <div class="col-sm">
    <compose-view name="Compose" webId="${this.webId}" .share="${this.share}"></compose-view>
    </div>
    </div>
    <div class="row" ?hidden="${this.panel!=null}">
    <div class="col-sm">
    <orga-view name="Orga" webId="${this.webId}"><orga-view>
    </div>
    <div class="col-sm">
    <talk-view name="Talk" webId="${this.webId}"></talk-view>
    </div>

    </div>

    <div class="row"> <!--  style="height:50vh" -->
    <div class="col-sm">
    <config-view name="Config" webId="${this.webId}" ?hidden="${this.webId == null}"></config-view>
    </div>
    </div>
    <friends-view name="Friends">Loading friends</friends-view>
    <flux-element name="Flux" agoraPod="${this.agoraPod}">Loading Flux</flux-element>

    </div>

    `
  }


  panelChanged(panel){
    this.panel = panel
  }

  render1() {

    return html`

    <div class="container">

    <div class="row " style=" background-color: rgba(100,100,0,0.1);">
    <!--
    <info-element name="Info">Loading Info</info-element>
    <login-element name="Login">Loading</login-element>-->

    <!-- <div ?hidden="${this.webId == null}">
    <profile-cartouche-element name="ProfileCartouche" webId="${this.webId}">Loading</profile-cartouche-element>
    -->
    </div>
    <div class="row" style="background-color: rgba(0,255,0,0.1);">
    <!--  <div class="col-md">
    Search
    <br>

    </div>-->
    <div class="col-md">
    <!--  <div ?hidden="${this.webId == null || this.page != "userProfile"}" >
    <user-profile-view name="UserProfile">Loading userProfile</user-profile-view>
    </div>-->

    <div ?hidden="${this.webId == null || this.page != "config"}" >
    <!--      <config-set-view name="ConfigSet">Loading Config Set</config-set-view>-->
    </div>



    </div>
    <div class="col-md"  ?hidden="${this.webId == null}">


    </div>
    </div>
    <div class="row" style="height: 20vh; background-color: rgba(255,0,0,0.1);">
    Page : ${this.page}
    </div>
    </div>
    `}


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
