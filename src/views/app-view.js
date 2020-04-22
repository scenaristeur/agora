import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class AppView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      share: {type: Object},
      panel: {type: String},
      webId: {type: String},
      query: {type: String},
      panels: {type: Array},
      agoraPod: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.debug = false
    this.webId = null
    this.query = null
    this.share = {}
    this.agoraPod = "https://agora.solid.community/profile/card#me"
    this.panel = "Flow"
    this.panels = [
      {name: "Flow", image: "/img/flow.png", text:"Show Public, Group & Personnal Activities."},
      {name: "Compose", image: "/img/compose.png", text:"Create & compose new Notes, Medias, Triples & Graphs!"},
      {name: "Organization", image: "/img/orga.png", text:"Build Teams to collaborate on projects."},
      {name: "Talk", image: "/img/talk.png", text:"A space to realtime exchanges!"}]
      this.onLoad()

    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">
      <fab-element name="Fab" ?hidden="${this.webId == null}">Loading Fab for ${this.webId}</fab-element>
      <store-element name="Store">Store Loading</store-element>
      <div ?hidden = "${!this.debug}">
      Hello from<b>${this.name}</b><br>
      WebId : ${this.webId}<br>

      </div>

      <header>
      <button class="btn btn-outline-info"  @click="${this.showDefault}">Agora</button>
      <button class="btn btn-outline-info" panel="Info" @click="${this.showFromAtt}">Help</button>
      <login-element name="Login">Loading Login</login-element>
      <!--      <nav-element name="Nav">Loading Nav</nav-element>-->
      </header>

      <div class="container-fluid">
      <!--
      PANEL : ${this.panel} for ${this.webId}-->
      <!---->
      <!--

      HIDDEN TEMPORARY FOR DEV-->
      <flux-element name="Flux" agoraPod="${this.agoraPod}" ?hidden="${this.panel != 'Flow'}">Loading Flux</flux-element>
      <friends-view name="Friends" ?hidden="${this.panel != 'Organization'}">Loading Organization</friends-view>
      <post-element name="Post" .share="${this.share}" ?hidden="${this.panel != 'Compose'}">Loading Post</post-element>
      <config-get-view name="Config" webId="${this.webId}" ?hidden="${this.webId == null || this.panel != "Config"}">Loading Config for ${this.webId}</config-get-view>
      <profile-element ?hidden="${this.panel != "Profile"}" name="Profile">Loading Profil</profile-element>
      <!---->

      <!-- DEFAULT -->
      <div class="row" ?hidden="${this.panel != 'Default'}">
      ${this.panels.map((p, i) =>
        html `
        <div class="col-md-6">
        <panel-element name="${p.name}" .p="${p}">Loading ${p.name}</panel-element>
        </div>
        `)
      }
      </div>
      <!-- -->


      <!-- SHARE -->
      <div ?hidden="${this.panel != 'Share'}">
      ${this.webId != null
        ?html `SHARE PANEL   share : ${JSON.stringify(this.share)}<br>`
        :html` YOU MUST LOGIN TO SHARE
        `
      }
      </div>
      <!-- QUERY -->
      <div ?hidden="${this.query == null}">
      must show activity with uri ${this.query}
      </div>

      <!-- INFO -->
      <info-element name="Info" ?hidden="${this.panel != 'Info'}">Loading Info</info-element>
      <!---->

      </div>

      <!--      <log-element name="Log">Loading Log</log-element>-->
      `;
    }

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
            case "initFromStore":
            app.initFromStore(message.store)
            break;
            case "showPanel":
            app.showPanel(message.panel)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    webIdChanged(webId){
      this.webId = webId
    }
    initFromStore(store){
      console.log("STORE in app",store)
      store.info == true ? this.panel = "Info" : ""
    }

    showPanel(panel = "Default"){
      this.panel = panel
      //
    }

    showFromAtt(e){
      this.panel = e.target.getAttribute("panel")
    }

    showDefault(){
      this.panel = "Default"
      //
    }

    onLoad() {
      var parsedUrl = new URL(window.location.toString());
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || null
      this.share.text = parsedUrl.searchParams.get("text") || null
      this.share.url = parsedUrl.searchParams.get("url") || null
      if (this.share.title != null || this.share.text != null || this.share.url != null){
        this.share.show = true
        this.panel = "Share"
      }else{
        this.query = parsedUrl.searchParams.get("query") || null
      }
      console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }

    }
  }

  customElements.define('app-view', AppView);
