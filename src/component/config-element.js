import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";
import * as auth from 'solid-auth-client';
import * as SolidFileClient from "solid-file-client"
import { namedNode } from '@rdfjs/data-model';


class ConfigElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      log: {type: String},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Config"
    this.log = "Not Logged"
    this.config = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container fluid">
    <h3>Configuration</h3>
    Configuration Log : ${this.log}<br>
    WebId: ${this.config.webId}<br>
    PublicTypeIndex: ${this.config.pti}<br>
    Shighl Instance: ${this.config.instance}<br>
    Inbox Folder: ${this.config.inbox}<br>
    Outbox Folder: ${this.config.outbox}<br>

    <button class="btn btn-primary" ?hidden="${this.webId == null}" @click="${this.showModal}">Open Config</button>

    <hr>
    </div>


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
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  webIdChanged(webId){
    this.config.webId = webId
    if (webId != null){
      this.log = "Logged"
      this.checkConfig()
    }else{
      this.config = {}
      this.log = "Not Logged"
    }
  }

  async checkConfig(){
    //  console.log(this.config.webId)
    /*TEST TO CHECK IF APP IS trustedApp
    for await (const trustedApp of data[this.config.webId].acl$trustedApp){
    console.log("ta",`${trustedApp}`)
    let origin = await data[trustedApp].acl$origin
    console.log(`${origin}`)
  }*/
  this.log = "Checking PublicTypeIndex"
  this.config.pti = await data[this.config.webId].publicTypeIndex
  this.log = "Checking Instances"
  for await (const subject of data[this.config.pti].subjects){
    if(this.config.pti != `${subject}`)
    /*let s = `${subject}`
    console.log(s)*/
    this.log = " Checking Shighl Instance"
    if (`${subject}`.endsWith('#Shighl')){
      let instance  = await data[`${subject}`].solid$instance
      this.config.instance = `${instance}`
      this.log = "Checking Inbox"
      let inbox = await data[this.config.instance].as$inbox
      this.config.inbox = `${inbox}`
      this.log = "Checking Outbox"
      let outbox = await data[this.config.instance].as$outbox
      this.config.outbox = `${outbox}`
      this.log = "Checking Followers"
      let followers = await data[this.config.instance].as$followers
      this.config.followers = `${followers}`
      this.log = "Checking Following"
      let following = await data[this.config.instance].as$following
      this.config.following = `${following}`
      this.log = "Checking Liked"
      let liked = await data[this.config.instance].as$liked
      this.config.liked = `${liked}`
      this.log = "Cool, your configuration seems OK"
    }
  }

  if(this.config.instance == null){
    this.log = "No Shighl Instance Found in your PublicTypeIndex"
    this.openConfigBox()
  }
  console.log("CONFIG",this.config)
  this.requestUpdate()
  await this.getFriends()
  this.agent.sendMulti(["PostTabs", "Profile"], {action: "configChanged", config: this.config})

}

async getFriends(){
  this.config.friends = []
  for await (const friend of data[this.config.webId].friends){
    console.log("FRIEND",`${friend}`)
    let f = {}
    let name = await data[`${friend}`].vcard$fn || `${friend}`.split("/")[2].split('.')[0];
    f.name = `${name}`

    f.webId = `${friend}`
    this.config.friends = [... this.config.friends, f]
  }
}

async openConfigBox(){
  console.log(this.config.pti)
  this.storage = await data[this.config.webId].storage
  console.log(`${this.storage}`)
  this.path = this.storage+"public/shighl_test/"
  console.log(this.path)
  this.showModal()
  await this.requestUpdate()
  this.pathChanged()
}

async createFolders(){

  if (!this.path.includes(this.storage+"public/")){
    alert("Error the path must be in your /public folder")
    this.path = this.storage+"public/shighl_test/"
    this.shadowRoot.getElementById("pathInput").value = this.path
    console.log(this.path)
    await this.requestUpdate()
    this.pathChanged()
  }else{
    this.hideModal()
    this.log = "Creating Folders"
    let fc = new SolidFileClient(auth)
    console.log(this.fc)
    let root = this.path
    let inbox = this.shadowRoot.getElementById("staticInbox").value
    let outbox = this.shadowRoot.getElementById("staticOutbox").value
    console.log(root,inbox, outbox)

    this.log = "Creating Inbox Folder"

    let aclInboxContent = `@prefix : <#>.
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



    let file = inbox+".acl"
    await fc.createFile (file, aclInboxContent, "text/turtle") .then (success => {
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

      let id = "#Shighl"
      let inst_uri = this.config.pti+id
      let inst_index = root+'index.ttl#this'
      this.log = "Instance Creation : ",inst_uri
      await data[inst_uri].solid$forClass.add(namedNode('https://www.w3.org/ns/activitystreams#Collection'))
      await data[inst_uri].solid$instance.set(namedNode(inst_index))
      //  await data[inst_uri].rdfs$label.add("Activity Streams Collection")
      this.log = "Index Creation : ",inst_index
      await data[inst_index].as$inbox.add(namedNode(inbox))
      await data[inst_index].as$outbox.set(namedNode(outbox))
      await data[inst_index].as$following.set(namedNode(root+'following/'))
      await data[inst_index].as$followers.set(namedNode(root+'followers/'))
      await data[inst_index].as$liked.set(namedNode(root+'liked/'))
      this.log = "YAHOOOOOOOOOOO, AGORA IS READY, AND WELL CONFIGURED !!!"
    }
    catch(e){
      this.log = "Can not create PublicTypeIndex Instance "
      alert(e)
    }




  }
}

hideModal(){
  this.shadowRoot.getElementById("modal1").style.display = "none"
}

showModal(){
  console.log("show")
  this.shadowRoot.getElementById("modal1").style.display = "block"
}

}

customElements.define('config-element', ConfigElement);
