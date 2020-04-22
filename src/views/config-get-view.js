import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

import * as SolidFileClient from "solid-file-client"
import { namedNode } from '@rdfjs/data-model';

class ConfigGetView extends LitElement {

  static get properties() {
    return {
      name: { type: String },
      config: {type: Object},
      log: {type: String},
      aclInbox: {type: String},
      textColor: {type: String},
      debug: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.name = "Config GET"
    this.config = {}
    this.log = "Init"
    this.textColor = "text-primary"
    this.debug = false
    this.aclInboxContent = `@prefix : <#>.
    @prefix acl: <http://www.w3.org/ns/auth/acl#>.
    @prefix inbox: <./>.
    @prefix c: </profile/card#>.

    :Append
    a acl:Authorization;
    acl:accessTo <./>;
    acl:agentClass acl:AuthenticatedAgent;
    acl:default <./>;
    acl:mode acl:Append.
    :ControlReadWrite
    a acl:Authorization;
    acl:accessTo <./>;
    acl:agent c:me;
    acl:default <./>;
    acl:mode acl:Control, acl:Read, acl:Write.
    :Read
    a acl:Authorization;
    acl:accessTo <./>;
    acl:default <./>;
    acl:mode acl:Read.`
  }

  render() {
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    config : ${JSON.stringify(this.config)}</br>
    </div>

    <h4>Configuration</h4>
    Log : <span class="${this.textColor}">${this.log}</span><br><br>
    <button class="btn btn-danger" @click="${this.checkConfig}">RE-check configuration from POD</button>


    <ul class="list-group">
    ${Object.entries(this.config).map(([key, value]) =>
      html`
      <li class="list-group-item ${value == "undefined" ? "list-group-item-danger list-group-item-action" : "list-group-item-success"}">
      ${key} : <small><a href="${value}" target="_blank">${value}</a></small></li>
      `) }
      </ul>


      <div id="modal1" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
      <div class="modal-header">
      <h5 class="modal-title">${this.log}</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="${this.hideModal}">
      <span aria-hidden="true">&times;</span>
      </button>
      </div>
      <div class="modal-body">
      <form>

      <div style="overflow-x:auto">
      <div class="form-group row">
      <label class="col-sm-2 col-form-label" for="pathInput">Path</label>
      <div class="col-sm-9">
      <input type="text" class="form-control" id="pathInput"
      placeholder="Path"
      value="${this.path}"
      @input="${this.pathChanged}">
      </div>
      </div>

      <div class="form-group row">
      <label for="staticInbox" class="col-sm-2 col-form-label">Inbox</label>
      <div class="col-sm-9">
      <input type="text" readonly class="form-control-plaintext" id="staticInbox" >
      </div>
      </div>

      <div class="form-group row">
      <label for="staticOutbox" class="col-sm-2 col-form-label">Outbox</label>
      <div class="col-sm-9">
      <input type="text" readonly class="form-control-plaintext" id="staticOutbox" >
      </div>
      </div>
      </div>
      </form>

      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-primary" @click="${this.createFolders}">Save changes</button>
      <button type="button" class="btn btn-secondary"
      data-dismiss="modal" @click="${this.hideModal}">Close</button>
      </div>
      </div>
      </div>
      </div>
      `;
    }

    newConfig(config){
      console.log("")
      this.config = config
      this.checkConfig()
    }

    async checkConfig(){
      this.textColor = "text-primary"
      this.log = "Checking PublicTypeIndex"
      this.config.date = new Date();
      this.config.status = "unknown"
      this.config.origin = "pod"
      this.config.pti= "undefined"
      let pti = await solid.data[this.config.webId].publicTypeIndex
      this.config.pti = `${pti}`
      this.log = "Checking Instances"
      this.config.instance= "undefined"
      for await (const subject of solid.data[this.config.pti].subjects){
        if(this.config.pti != `${subject}`)
        /*let s = `${subject}`
        console.log(s)*/
        this.log = "Checking Agora Instance"

        if (`${subject}`.endsWith('#Agora')){
          let instance  = await solid.data[`${subject}`].solid$instance
          this.config.instance = `${instance}`
          this.log = "Checking Inbox"
          this.config.inbox= "undefined"
          let inbox = await solid.data[this.config.instance].as$inbox
          this.config.inbox = `${inbox}`
          this.log = "Checking Outbox"
          this.config.outbox= "undefined"
          let outbox = await solid.data[this.config.instance].as$outbox
          this.config.outbox = `${outbox}`
          this.log = "Checking Followers"
          this.config.followers= "undefined"
          let followers = await solid.data[this.config.instance].as$followers
          this.config.followers = `${followers}`
          this.log = "Checking Following"
          this.config.following= "undefined"
          let following = await solid.data[this.config.instance].as$following
          this.config.following = `${following}`
          this.log = "Checking Liked"
          this.config.liked= "undefined"
          let liked = await solid.data[this.config.instance].as$liked
          this.config.liked = `${liked}`
          this.log = "Cool, your configuration seems OK"
          await this.checkAcl()
        }
      }

      console.log(Object.values(this.config))
      if( Object.values(this.config).includes("undefined")){
        this.log = this.log +" CONFIGURATION NOT OK"
        this.textColor = "text-danger"
        this.config.status = "KO"
        this.agent.send("App", {action: "showPanel", panel: "Config"})
        this.openConfigBox()
      }else{
        this.log = "CONFIGURATION OK"
        this.config.status = "OK"
        this.textColor = "text-success"
        this.agent.send("Store", {action: "setStorage", values: {config: this.config}})
        this.agent.send("App", {action: "showPanel"})
      }
    }

    async checkAcl(){
      let app = this
      this.log = "ACL INBOX & FOLLOWERS VERIFICATION"
      this.config.acl_inbox= "undefined"
      this.config.acl_followers= "undefined"
      let inboxacl = this.config.inbox+".acl"
      let followersacl = this.config.followers+".acl"
      console.log(inboxacl)
      console.log(followersacl)
      let fc = new SolidFileClient(solid.auth)

      await fc.createFile (inboxacl, this.aclInboxContent, "text/turtle") .then (success => {
        this.log = "Created "+inboxacl
        this.config.acl_inbox = inboxacl
      }, err => {
        this.log = err
        alert(err + "... Are you sure you grant AGORA to FULL CONTROL ? see HELP !")
        this.log = err +"... Are you sure you grant AGORA to FULL CONTROL ? Please see HELP !"
      });

      await fc.createFile (followersacl, this.aclInboxContent, "text/turtle") .then (success => {
        this.log = "Created "+followersacl
        this.config.acl_followers = followersacl
      }, err => {
        this.log = err
        alert(err + "... Are you sure you grant AGORA to FULL CONTROL ? see HELP !")
        this.log = err +"... Are you sure you grant AGORA to FULL CONTROL ? Please see HELP !"
      });



    }

    async openConfigBox(){
      console.log(this.config.pti)
      this.storage = await solid.data[this.config.webId].storage
      console.log(`${this.storage}`)
      this.path = this.storage+"public/agora/"
      console.log(this.path)
      this.showModal()
      await this.requestUpdate()
      this.pathChanged()
    }

    showModal(){
      console.log("show")
      this.shadowRoot.getElementById("modal1").style.display = "block"
    }

    hideModal(){
      this.shadowRoot.getElementById("modal1").style.display = "none"
    }

    async createFolders(){

      if (!this.path.includes(this.storage+"public/")){
        alert("Error the path must be in your /public folder")
        this.path = this.storage+"public/agora/"
        this.shadowRoot.getElementById("pathInput").value = this.path
        console.log(this.path)
        await this.requestUpdate()
        this.pathChanged()
      }else{
        this.hideModal()
        this.log = "Creating Folders"
        let fc = new SolidFileClient(solid.auth)
        console.log(this.fc)
        let root = this.path
        let inbox = this.shadowRoot.getElementById("staticInbox").value
        let outbox = this.shadowRoot.getElementById("staticOutbox").value
        console.log(root,inbox, outbox)

        this.log = "Creating Inbox Folder"

        let file = inbox+".acl"
        await fc.createFile (file, this.aclInboxContent, "text/turtle") .then (success => {
          this.log = "Created "+file
        }, err => {
          this.log = err
          alert(err)
        });

        try{
          this.log = "outbox Folder creation : "+outbox

          if( !(await fc.itemExists(outbox)) ) {
            await fc.createFolder(outbox) // only create if it doesn't already exist
          }
          this.log = "outbox/objects Folder creation : "+outbox+"objects/"
          if( !(await fc.itemExists(outbox+"objects/")) ) {
            await fc.createFolder(outbox+"objects/") // only create if it doesn't already exist
          }
          this.log = "outbox/activities Folder creation : "+outbox+"activities/"
          if( !(await fc.itemExists(outbox+"activities/")) ) {
            await fc.createFolder(outbox+"activities/") // only create if it doesn't already exist
          }
        }catch(e){
          this.log=e
          alert(e)
        }


        try{
          if( !(await fc.itemExists(root+"followers/")) ) {
            await fc.createFolder(root+"followers/") // only create if it doesn't already exist
          }
        }catch(e){
          this.log=e
          alert(e)
        }

        try{
          if( !(await fc.itemExists(root+"following/")) ) {
            await fc.createFolder(root+"following/") // only create if it doesn't already exist
          }
        }catch(e){
          this.log=e
          alert(e)
        }

        try{
          if( !(await fc.itemExists(root+"liked/")) ) {
            await fc.createFolder(root+"liked/") // only create if it doesn't already exist
          }
        }catch(e){
          this.log=e
          alert(e)
        }

        try{

          let id = "#Agora"
          let inst_uri = this.config.pti+id
          let inst_index = root+'index.ttl#this'
          this.log = "Instance Creation : ",inst_uri
          await solid.data[inst_uri].solid$forClass.add(namedNode('https://www.w3.org/ns/activitystreams#Collection'))
          await solid.data[inst_uri].solid$instance.set(namedNode(inst_index))
          //  await solid.data[inst_uri].rdfs$label.add("Activity Streams Collection")
          this.log = "Index Creation : ",inst_index
          await solid.data[inst_index].as$inbox.add(namedNode(inbox))
          await solid.data[inst_index].as$outbox.set(namedNode(outbox))
          await solid.data[inst_index].as$following.set(namedNode(root+'following/'))
          await solid.data[inst_index].as$followers.set(namedNode(root+'followers/'))
          await solid.data[inst_index].as$liked.set(namedNode(root+'liked/'))
          this.log = "YAHOOOOOOOOOOO, AGORA IS READY, AND WELL CONFIGURED !!!"
        }
        catch(e){
          this.log = "Can not create PublicTypeIndex Instance "
          alert(e)
        }

      }
      this.checkConfig()
    }

    pathChanged(){
      let pathInput =  this.shadowRoot.getElementById("pathInput").value
      this.path = pathInput.endsWith("/") ? pathInput : pathInput+"/"
      console.log(this.path)
      this.shadowRoot.getElementById("staticInbox").value = this.path+"inbox/"
      this.shadowRoot.getElementById("staticOutbox").value = this.path+"outbox/"
    }

    firstUpdated(){
      var app = this;
      this.agent = new HelloAgent(this.name);
      //  console.log(this.agent)
      this.agent.receive = function(from, message) {
        //  console.log("messah",message)
        if (message.hasOwnProperty("action")){
          //  console.log(message)
          switch(message.action) {
            case "newConfig":
            app.newConfig(message.config)
            break;
            case "configChanged":
            app.configChanged(message.config)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
      //app.agent.send("Store", {action:"getConfig"});
    }

    configChanged(config){
      console.log("CONFIG CHANGED", config)
      if (config != undefined && config.webId == this.config.webId){
        config.origin = "store"
        this.config = config
        if (this.config.status == "OK"){
          this.agent.send("App", {action: "showPanel"})
        }
      }else{
        this.agent.send("App", {action: "showPanel", panel: "Config"})
        this.checkConfig()
      }
    }

    /*    webIdChanged(webId){
    console.log("CONFIG GET ",webId)
    this.config.webId = webId
    if (webId != null){
    this.log = "Logged"
    this.agent.send("Store", {action: "getConfig"})

    //  this.checkConfig()
  }else{
  this.config = {}
  this.log = "Not Logged"
}
}*/

}

customElements.define('config-get-view', ConfigGetView);
