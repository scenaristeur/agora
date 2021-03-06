import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

// test but no LIMIT, order, FILTER... import './test-rdfeasy-element.js'


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
      {name: "Flow", image: "./img/flow.png", text:"Show Public, Group & Personnal Activities."},
      {name: "Compose", image: "./img/compose.png", text:"Create & compose new Notes, Medias, Triples & Graphs!"},
      {name: "Organization", image: "./img/orga.png", text:"Build Teams to collaborate on projects."},
      {name: "Talk", image: "./img/talk.png", text:"A space to realtime exchanges! (TODO)"}]
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
      <button class="btn btn-outline-info"
      ?hidden="${this.webId == null}"
      title="${this.webId}"
      @click="${this.showProfile}">Profile</button>

      <button class="btn btn-outline-info" ?hidden="${this.webId == null}" @click="${this.showInbox}">Inbox</button>

      <!--  <button class="btn btn-outline-info" ?hidden="${this.webId == null}" @click="${this.showConfig}">Config</button>
      -->
      <!--      <nav-element name="Nav">Loading Nav</nav-element>-->
      v.a16  
      </header>

      <div class="container-fluid"  style="padding-left:0px;padding-right:0px">

      <!--

      <test-rdfeasy-element name="RdfEasy">Loading RDFeasy</test-rdfeasy-element>
      -->

      <!--
      PANEL : ${this.panel} for ${this.webId}
      -->
      <!--

      HIDDEN TEMPORARY FOR DEV-->
   <!--   <scroll-view root="https://agora.solid.community/public/agora/inbox/">Loading Scroll</scroll-view>-->
 <flux-element name="Flux" root="https://agora.solid.community/public/agora/inbox/" ?hidden="${this.panel != 'Flow'}">Loading Flux</flux-element>
     <friends-view name="Friends" ?hidden="${this.panel != 'Organization'}">Loading Organization</friends-view>
      <post-element name="Post" .share="${this.share}" ?hidden="${this.panel != 'Compose'}">Loading Post</post-element>
      <config-get-view name="Config" webId="${this.webId}" ?hidden="${this.webId == null || this.panel != "Config"}">Loading Config for ${this.webId}</config-get-view>
      <profile-element ?hidden="${this.panel != "Profile"}" name="Profile">Loading Profil</profile-element>

      <inbox-view name="Inbox" ?hidden="${this.panel != 'Inbox'}">Loading Inbox</inbox-view>

      <!--  <activity-element name="Shared_activity"
      ?hidden="${this.panel != 'SharedActivity' }">Loading activity...
      </activity-element>-->
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

    showProfile(){
      this.panel = "Profile"
      this.agent.send("Profile", {action: "profileChanged", profile:{webId: this.webId}})
    }

    showConfig(){
      this.panel = "Config"
      this.agent.send("Config", {action: "newConfig", config:{webId: this.webId}})
    }

    showInbox(){
      this.panel = "Inbox"
      //  this.agent.send("Inbox", {action: "newConfig", config:{webId: this.webId}})
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
      let shared_activity = null
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || null
      this.share.text = parsedUrl.searchParams.get("text") || null
      this.share.url = parsedUrl.searchParams.get("url") || null
      if (this.share.title != null || this.share.text != null || this.share.url != null){
        this.share.show = true
        this.panel = "Share"
      }else{
        this.query = parsedUrl.searchParams.get("query") || null
        shared_activity = parsedUrl.searchParams.get("activity") || null
      }
      console.log(this.share)
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }
      if (shared_activity != null){
        console.log("Single activity Shared")
        this.showPanel("SharedActivity")
        this.agent.send("Shared_activity", {action: "SharedActivity", activity: shared_activity})
      }

    }
  }

  customElements.define('app-view', AppView);
