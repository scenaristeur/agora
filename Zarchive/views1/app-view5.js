import { html } from 'lit-element';
import { BaseView } from './base-view.js';

class AppView extends BaseView {

  static get properties() {
    return {
      name: {type: String},
      panel: {type: String},
      panels: {type: Array},
      agoraPod : {type: String},
      share: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.panel = ""//, "Help"
    this.agoraPod = ""
    this.share = {}
    this.panels = [
      {name: "Flow", image: "/img/flow.png", text:"Show Public, Group & Personnal Activities."},
      {name: "Compose", image: "/img/compose.png", text:"Create & compose new Notes, Medias, Triples & Graphs!"},
      {name: "Organization", image: "/img/orga.png", text:"Build Teams to collaborate on projects."},
      {name: "Talk", image: "/img/talk.png", text:"A space to realtime exchanges!"}]
      this.onLoad()
    }

    createRenderRoot() {
      return this;
    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">
      <div class="container-fluid">

      <fab-element name="Fab" ?hidden="${this.webId == null}">Loading Fab</fab-element>
      <info-element name="Info" ?hidden="${this.panel != 'Info'}">Loading Info</info-element>
      <!--    Pan${this.panel}L -->
      <div class="row" ?hidden="${this.panel != 'Init'}">
      ${this.panels.map((p, i) =>
        html `
        <div class="col-md-6">
        <div class="card shadow mb-4" >
        <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">${p.name}</h6>
        </div>
        <div class="card-body">
        <div class="text-center">
        <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="${p.image}" alt="">
        </div>
        <p>${p.text}</p>
        <button class="btn btn-outline-info"  panel="${p.name}" @click="${this.showPanel}">${p.name}</button>
        </div>
        </div>
        </div>
        `)
      }
      </div>


      <div class="row" ?hidden="${this.panel == 'Init' || this.panel == 'Info'}">
      <div class="col">
      <div class="card shadow mb-4" >
      <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">${this.panel}</h6>
      </div>
      <div class="card-body">
      <!--<div class="text-center">
      <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="" alt="">
      </div>
      <p></p>-->
      ${this.panel}

      <flux-element name="Flux" agoraPod="${this.agoraPod}" ?hidden="${this.panel != 'Flow'}">Loading Flux</flux-element>
      <friends-view name="Friends" ?hidden="${this.panel != 'Organization'}">Loading Organization</friends-view>
      <post-element name="Post" .share="${this.share}" ?hidden="${this.panel != 'Compose'}">Loading Post</post-element>
      <config-view name="Config" webId="${this.webId}" ?hidden="${this.webId == null || this.panel != "Config"}"></config-view>
      <profile-element ?hidden="${this.panel != "Profile"}" name="Profile">Loading Profil</profile-element>
      <profile-element ?hidden="${this.panel != "Profile"}" name="Profile">Loading Profil</profile-element>
  <!--    <button class="btn btn-outline-info"  panel="" @click=""></button>-->
      </div>
      </div>
      </div>



      </div>

      </div>
      `;
    }


    onLoad() {
      var parsedUrl = new URL(window.location.toString());
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || ""
      this.share.text = parsedUrl.searchParams.get("text") || ""
      this.share.url = parsedUrl.searchParams.get("url") || ""
      //      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
      if (this.share.title.length + this.share.text.length + this.share.url.length > 0){
        this.panel = "Compose" // : this.share.length = false;
        this.share.show = true
      }else{
        this.panel = "Init"
      }
      console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }

    }

    showPanel(e){
      this.panel =e.target.getAttribute("panel")
      //
    }
    panelChanged(panel){
      console.log(panel)
      panel != "last" ? this.panel = panel : this.panel = this.lastPanel

    }
    /*
    firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
    //  console.log("messah",message)
    if (message.hasOwnProperty("action")){
    //  console.log(message)
    switch(message.action) {
    case "webIdChanged":
    app.webIdChanged(message.webId)
    break;
    default:
    console.log("Unknown action ",message)
  }
}
};
}*/

firstUpdated(){
  super.firstUpdated()
}

webIdChanged(webId){
  super.webIdChanged(webId)
  console.log(webId)
  if (webId != null){
    this.lastPanel = this.panel
    this.panel = "Config"
  }else{
    this.panel = "Init"
  }
}

}

customElements.define('app-view', AppView);
