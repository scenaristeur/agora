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
    this.webId = null
    this.share = {}
    this.agoraPod = ""
    this.page = "flux"
    this.onLoad()

  }


  render() {

    return html`

    <div class="container">
    <fab-element name="Fab" ?hidden="${this.webId == null}">Loading FAb<</fab-element>
    <div class="row " style=" background-color: rgba(100,100,0,0.1);">

    <info-element name="Info">Loading Info</info-element>
    <login-element name="Login">Loading</login-element>
    <post-element name="Post" .share="${this.share}">Loading Post</post-element>
  <!--  <div ?hidden="${this.webId == null}">
    <profile-cartouche-element name="ProfileCartouche" webId="${this.webId}">Loading</profile-cartouche-element>
    </div>-->
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
    <config-get-view name="ConfigGet">Loading Config Get</config-get-view>
    <!--      <config-set-view name="ConfigSet">Loading Config Set</config-set-view>-->
    </div>
    <profile-element ?hidden="${this.page != "profile"}" name="Profile">Loading Profil</profile-element>


    <flux-element name="Flux" agoraPod="${this.agoraPod}">Loading Flux</flux-element>
    </div>
    <div class="col-md"  ?hidden="${this.webId == null}">

    <friends-view name="Friends">Loading friends</friends-view>
    </div>
    </div>
    <div class="row" style="height: 20vh; background-color: rgba(255,0,0,0.1);">
    Page : ${this.page}
    </div>
    <fab-element name="Fab">Loading Fab</fab-element>
    </div>
    `}

    render1() {

      return html`
<!--      <store-element name="Store">Loading Store</store-element>-->
      <div class="row">
      <info-element name="Info">Loading Info</info-element>
      </div>

      Page : ${this.page}
      <div class="row">
      <div class="col-sm">
      ${this.webId != null?
        html`
    <!--    <profile-cartouche-element name="ProfileCartouche" webId="${this.webId}">Loading</profile-cartouche-element>-->
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
