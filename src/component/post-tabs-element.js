import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

//import { PodHelper } from '../tools/pod-helper.js';
/*import { fetchDocument } from 'tripledoc';*/
import { solid, schema, rdf, rdfs } from 'rdf-namespaces';
import { namedNode } from '@rdfjs/data-model';
import  data  from "@solid/query-ldflex";

import * as auth from 'solid-auth-client';
import * as SolidFileClient from "solid-file-client"
import { v4 as uuidv4 } from 'uuid';


import './note-element.js'
import './media-element.js'
import './graph-element.js'
import './triple-element.js'


class PostTabsElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      subelements: {type: String},
      requetes: {type: Object},
      responses: {type: Array},
      agoraNotesListUrl: { type: String},
      webId: {type: String},
      info: {type: String},
      replyTo: {type: Object},
      friends: {type: Array}
    };
  }

  constructor() {
    super();
    this.fileClient = new SolidFileClient(auth)
    this.webId = null
    this.subelements = ["Note", "Media", "Triple"] //, "Media", "Triple"] , "Graph"
    this.requetes = {}
    this.responses = []
    this.info = ""
    this.replyTo = {}
    this.friends = []
    //  this.agoraNotesListUrl = "https://agora.solid.community/public/notes.ttl"
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    body {font-family: Arial;}

    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }

    /* Style the buttons inside the tab */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 5px 8px;
      transition: 0.3s;
      font-size: 17px;
    }

    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }

    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }

    /* Style the tab content */
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
      width: 100%;
    }
    </style>
    <div class="container">
    <div class="row">

    ${this.replyTo.url != null ?
      html `
      TODO<br>
      replyTo url  ${this.replyTo.url}<br>
      replyTo attributedTo  ${this.replyTo.attributedTo} <br>
      replyTo name  ${this.replyTo.name} <br>

      <label class="sr-only" for="title">Reply to</label>
      <div class="input-group mb-2">
      <div class="input-group-append">
      <div class="input-group-text">Reply to</div>
      </div>
      <input id="reply" class="form-control" type="text" value="${this.replyTo.url}" style="text-align:right;"  placeholder="ReplyTo">
      </div>
      `
      :html``
    }

    <label class="sr-only" for="title">Title</label>
    <div class="input-group mb-2">

    <input id="title" class="form-control" type="text" value="${this.title}" placeholder="Title">

    </div>
    </div>


    <div class="row"><!--style="height:50vh"-->
    <div id="Note" class="tabcontent" style="display:block;height: 40vh">
    <note-element name="Note"></note-element>
    </div>

    <div id="Media" class="tabcontent" style="height: 40vh">
    <media-element name="Media"></media-element>
    </div>

    <div id="Triple" class="tabcontent" style="height: 40vh">
    <triple-element name="Triple"></triple-element>
    </div>

    <div id="Graph" class="tabcontent" style="height: 40vh">
    <h3 class="text-primary">Graph</h3>
    <p class="text-primary">todo.</p>
    <graph-element name="Graph"></graph-element>
    </div>

    <div class="tab">
    <button class="tablinks active" tabName='Note' @click="${this.openTab}"><i class="far fa-sticky-note"></i></button>
    <button class="tablinks" tabName='Media' @click="${this.openTab}"><i class="fas fa-photo-video"></i></button>
    <button class="tablinks" tabName='Triple' @click="${this.openTab}"><i class="fas fa-receipt"></i></button>
    <!--<button class="tablinks" tabName='Graph' @click="${this.openTab}"><i class="fas fa-dice-d20"></i></button>-->
    </div>

    </div>

    <div class="row">
    <label class="sr-only" for="title">Tags</label>
    <div class="input-group mb-2">
    <div class="input-group-append">
    <div class="input-group-text">Tags</div>
    </div>
    <input id="tags" class="form-control" type="text" placeholder="tags, comma separated">
    </div>
    </div>


    <div class="row">

    <select id="recipients" class="custom-select" > <!--multiple-->
    <option disabled>Select Multi Recipient</option>
    <option  value="#me">Personnal (Me)</option>
    <option selected value="https://www.w3.org/ns/activitystreams#Public">Public (Agora)</option>
    ${this.friends.map(f =>
      html `
      <option value="${f.webId}"> ${f.name} </option>
      `)}
      <option value="someone" disabled>Someone Else (todo)</option>
      </select>



      </div>


      <div class="buttons">
      <div class="row">
      <!--  <div class="col-8">
      <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="agora_pub" name="agora_pub" checked>
      <label class="text-primary" for="agora_pub">
      Push to Agora
      </label>
      </div>
      </div>-->
      <div class="col">
      <button type="button" class="btn btn-primary" primary @click=${this.addNote}>
      Send <i class="far fa-paper-plane"></i></button>
      </div>
      <!--
      <button type="button" class="cancel btn btn-primary" @click="${this.toggleWrite}"><i class="fas fa-window-close"></i> </button>-->
      </div>
      </div>






      <!--
      <div class="buttons">

      <div class="row">
      <div class="col-5">
      <button type="button" class="btn btn-primary" primary @click=${this.addNote}><i class="far fa-paper-plane"></i></button>
      <button type="button" class="cancel btn btn-primary" @click="${this.toggleWrite}"><i class="fas fa-window-close"></i> </button>
      </div>
      <div class="col">

      </div>
      </div>
      </div>-->
      </div>
      `;
    }


    addNote(){
      var title = this.shadowRoot.getElementById('title').value.trim();
      if (title.length == 0){
        alert ("Don't you want to provide a  beautiful title to your wonder post ?")
      }else{
        var id = new Date().toISOString ()
        this.requetes[id] = this.subelements.length
        console.log(this.requetes)
        var mess = {action: "askContent", id : id}
        this.agent.sendMulti(this.subelements, mess)
        this.toggleWrite()
      }
    }

    toggleWrite(){
      this.agent.send("Post", {action: "toggleWrite"})
    }


    openTab(e) {
      var node = e.target
      if (node.nodeName == "I"){
        node = e.target.parentNode
      }
      var tabName = node.getAttribute('tabName')
      var i, tabcontent, tablinks;
      tabcontent = this.shadowRoot.querySelectorAll(".tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = this.shadowRoot.querySelectorAll(".tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      this.shadowRoot.getElementById(tabName).style.display = "block";
      node.className += " active";
    }

    firstUpdated(){
      var app = this;
      //  this.ph = new PodHelper();
      this.agent = new HelloAgent(this.name);
      this.agent.receive = function(from, message) {
        if (message.hasOwnProperty("action")){
          switch(message.action) {
            case "reponseContent":
            app.reponseContent(from, message);
            break;
            case "webIdChanged":
            app.webIdChanged(message.webId);
            break;
            case "setReplyTo":
            app.setReplyTo(message);
            break;
            case "configChanged":
            app.configChanged(message.config);
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    configChanged(config){
      this.config = config
      this.friends = config.friends || []
    }

    async setReplyTo(message){
      if (message.replyTo != undefined){
        this.replyTo ={}
        this.replyTo.url  = message.replyTo
        let attributedTo = await data[this.replyTo.url].as$attributedTo
        let name = await data[`${attributedTo}`].vcard$fn || `${friend}`.split("/")[2].split('.')[0];
        this.replyTo.attributedTo = `${attributedTo}`
        this.replyTo.name = `${name}`
        console.log(this.replyTo)
        this.requestUpdate()
      }else{
        this.replyTo = {}
      }
    }

    webIdChanged(webId){
      console.log(webId)
      this.webId = webId
    }

    reponseContent(from, message){
      console.log(from, message)
      this.requetes[message.id]--
      // si toutes reponses
      this.responses.push({from:from, message: message})
      if (this.requetes[message.id] == 0){
        console.log("UPDATE")
        delete this.requetes[message.id]
        this.preparePost()
      }
    }



    async preparePost(){
      var app = this
      console.log("CONFIG",this.config)
      console.log("OUTBOX", this.config.outbox)
      let recipient_select = this.shadowRoot.getElementById("recipients")
      let recipients = Array(...recipient_select.options).reduce((acc, option) => {
        if (option.selected === true) {
          acc.push(option.value);
        }
        return acc;
      }, []);
      //  console.log("RECIPIENTS",recipients)
      console.log(this.responses)
      var title = this.shadowRoot.getElementById('title').value.trim();
      var tags = this.shadowRoot.getElementById('tags').value.split(',');
      //  var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
      var inReplyTo = null;
      if (this.shadowRoot.getElementById('reply') != null){
        inReplyTo = this.shadowRoot.getElementById('reply').value.trim();
      }
      this.shadowRoot.getElementById('title').value = ""
      this.shadowRoot.getElementById('tags').value = ""
      this.storage = await data.user.storage

      // TREAT OBJECTS
      let dateObj = new Date();
      let date = dateObj.toISOString()
      //    let to = act.object.target == "Public" ? "https://www.w3.org/ns/activitystreams#Public" : act.object.target;

      let objects = []

      this.responses.forEach(async function(r){
        //object create

        let object_Id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        //    let object_uri = outbox+"objects/"+object_Id+"/index.ttl#this"
        let object_file = app.config.outbox+"objects/"+object_Id+".ttl"
        let object_uri = object_file+"#this"
        switch (r.message.type) {
          case "Note":
          if(r.message.content.length >0){
            objects.push({uri: object_uri})
            console.log("CREATE NOTE WITH", r.message.content, object_uri)
            await data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
            await data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(title)
            await data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(r.message.content)
            await data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
            await data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(app.config.webId))

          }
          break;
          case "Image":
          case "Video":
          case "Audio":
          case "Document":
          if(r.message.content != undefined){
            objects.push({uri: object_uri})
            var file = r.message.content
            var contentType = file.contentType
            var newFilename = r.message.newFilename
            var classe = r.message.type
            console.log("CREATE DOCUMENT WITH",r.message, object_uri)
          }
          break;
          case "Triple":
          if(r.message.content.length > 0){
            objects.push({uri: object_uri})
            content = r.message.content
            console.log("CREATE DOCUMENT WITH",r.message, object_uri)
          }

          break;
          default:
          console.log(r.message.type , "non traite")
        }

      })

      this.responses = []
      console.log("TODO : ACL FILES & REPLYTO")
      console.log("OBJECTS",objects)
      /*
      if (to == "https://www.w3.org/ns/activitystreams#Public"){
      console.log("Send to Agora")
      to = "https://agora.solid.community/profile/card#me"
    }
    */

    //activity create
    let activity_Id = uuidv4();
    //      let activity_uri = outbox+"activities/"+activity_Id+"/index.ttl#this"
    let activity_file = app.config.outbox+"activities/"+activity_Id+".ttl"
    let activity_uri = activity_file+"#this"

    await data[activity_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
    await data[activity_uri]['https://www.w3.org/ns/activitystreams#summary'].add(title)
    await data[activity_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
    await data[activity_uri].rdfs$label.add(title)

    objects.forEach(async function(o, i) {
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#object'].add(namedNode(o.uri))
      recipients.forEach(async function(to, i) {
        console.log("TO",to)
        if (to == "#me"){
          await data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(app.config.webId))
        }else{
          await data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(to))
        }
        if (to == "https://www.w3.org/ns/activitystreams#Public"){
          await data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode("https://agora.solid.community/profile/card#me"))
        }
      });
    });

    recipients.forEach(async function(to, i) {
      console.log("TO",to)
      if (to == "#me"){
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(app.config.webId))
      }else{
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(to))
      }
      if (to == "https://www.w3.org/ns/activitystreams#Public"){
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode("https://agora.solid.community/profile/card#me"))
      }
    });

    console.log("Activity OK",activity_uri)



  }





  async preparePost2(){
    var app = this
    console.log(this.responses)
    var date = new Date(Date.now())
    var id = date.getTime()
    var title = this.shadowRoot.getElementById('title').value.trim();
    var tags = this.shadowRoot.getElementById('tags').value.split(',');
    var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
    var inReplyTo = null;
    if (this.shadowRoot.getElementById('reply') != null){
      inReplyTo = this.shadowRoot.getElementById('reply').value.trim();
    }
    this.shadowRoot.getElementById('title').value = ""
    this.shadowRoot.getElementById('tags').value = ""
    this.storage = await data.user.storage
    var userActivity = this.storage+"public/spoggy/activity.ttl#"+id
    console.log("Creation ", userActivity)
    await data[userActivity].as$name.set(title)
    await data[userActivity].rdfs$label.set(title)
    await data[userActivity].schema$dateCreated.set(date.toISOString())
    await data[userActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
    inReplyTo!= null && inReplyTo.length > 0 ? await data[userActivity].as$inReplyTo.add(namedNode(inReplyTo)) : "";

    if (agora_pub == true){
      var agoraActivity = "https://agora.solid.community/public/spoggy/activity.ttl#"+id
      await data[agoraActivity].as$name.add(title)
      await data[agoraActivity].rdfs$label.add(title)
      await data[agoraActivity].schema$dateCreated.add(date.toISOString())
      await data[agoraActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
      await data[agoraActivity].as$actor.add(namedNode(app.webId))
      await data[agoraActivity].as$target.add(namedNode(userActivity))
      inReplyTo!= null &&  inReplyTo.length > 0 ? await data[agoraActivity].as$inReplyTo.add(namedNode(inReplyTo)) : "";
    }

    this.responses.forEach(async function(r){
      switch (r.message.type) {
        case "Note":
        if (r.message.content.length > 0){
          var userNote = app.storage+"public/Notes/"+id+".ttl"
          var content = r.message.content
          await data[userNote].schema$text.add(content);
          await data[userNote].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
          await data[userActivity].schema$text.add(content);
          await data[userActivity].as$object.add(namedNode(userNote))

          if (agora_pub == true){
            await data[agoraActivity].schema$text.add(content);
            await data[agoraActivity].as$object.add(namedNode(userNote))
          }
        }
        break;
        case "Image":
        case "Video":
        case "Audio":
        case "Document":
        if(r.message.content != undefined){
          var file = r.message.content
          var contentType = file.contentType
          var newFilename = r.message.newFilename
          var classe = r.message.type
          var userMedia = app.storage+"public/spoggy/"+classe+"/"+newFilename
          console.log("creation ",userMedia)
          await app.sendFile(userMedia, file, contentType)
          await  data[userActivity].as$object.add(namedNode(userMedia))
          await  data[agoraActivity].as$object.add(namedNode(userMedia))
        }
        break;
        case "Triple":
        if(r.message.content.length >0){
          content = r.message.content
        }
        break;
        default:
        console.log(r.message.type , "non traite")
      }
    })
    this.responses = []
  }

  async preparePost1(){
    var app = this
    //  app.webId = this.ph.getPod("webId")
    //  console.log(this.webId)
    console.log(this.responses)
    var date = new Date(Date.now())
    var id = date.getTime()
    var title = this.shadowRoot.getElementById('title').value.trim();
    var tags = this.shadowRoot.getElementById('tags').value.split(',');
    this.shadowRoot.getElementById('title').value = ""
    this.shadowRoot.getElementById('tags').value = ""
    this.storage = await data.user.storage


    var userActivity = this.storage+"public/spoggy/activity.ttl#"+id
    console.log("Creation ", userActivity)
    await  data[userActivity].rdfs$label.add(title)
    await  data[userActivity].schema$dateCreated.add(date.toISOString())

    await data[userActivity].as$name.add(title)
    await data[userActivity].as$generator.add(window.location.origin)
    await data[userActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
    console.log(userActivity+ " -- >created")
    await data[app.storage+"public/spoggy/tags.ttl"].rdfs$label.add("Tags")

    var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
    if (agora_pub == true){
      console.log("Creation ", userActivity)
      var agoraActivity = "https://agora.solid.community/public/spoggy/activity.ttl#"+id
      await data[agoraActivity].schema$dateCreated.add(date.toISOString())
      await data[agoraActivity].rdfs$label.add(title)
      await data[agoraActivity].as$name.add(title)
      await data[agoraActivity].as$target.add(namedNode(userActivity))
      await data[agoraActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Add'))
      await data[agoraActivity].schema$creator.add(namedNode(app.webId))
      await data[agoraActivity].as$actor.add(namedNode(app.webId))
      console.log(agoraActivity+ " -- >created")
    }

    tags.forEach(async function(t){
      var taguri = app.storage+"public/spoggy/tags.ttl#"+t.trim();
      await  data[userActivity].as$tag.add(namedNode(taguri))
      //    console.log(taguri+ " -- >created")
    })

    //  var path = this.storage+"public/Notes/"+id+".ttl"
    //  console.log(data)
    //  var tit = await  data[path].rdfs$label.add("title ONE")
    //  var cont = await data[path].schema$text.add("content ONE");


    this.responses.forEach(async function(r){
      switch (r.message.type) {
        case "Note":
        var userNote = app.storage+"public/spoggy/Notes/"+id+".ttl"
        var content = r.message.content
        await data[userNote].rdfs$label.add(title)
        await data[userNote].schema$text.add(content);
        await data[userNote].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
        //!!! as$Note ne fonctionne pas
        await  data[userActivity].as$attachment.add(namedNode(userNote))
        await data[userActivity].schema$text.add(content);

        var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
        if (agora_pub == true){
          //!!! as$Note ne fonctionne pas
          await  data[agoraActivity].as$object.add(namedNode(userNote))
          await data[agoraActivity].schema$text.add(content);
        }


        break;
        case "Image":
        case "Video":
        case "Audio":
        case "Document":
        if(r.message.content != undefined){
          var file = r.message.content
          var contentType = file.contentType
          var newFilename = r.message.newFilename
          var classe = r.message.type
          var userMedia = app.storage+"public/spoggy/"+classe+"/"+newFilename
          console.log("creation ",userMedia)
          await app.sendFile(userMedia, file, contentType)
          await  data[userActivity].as$attachment.add(namedNode(userMedia))
          if (agora_pub == true){
            //!!! as$Note ne fonctionne pas
            await  data[agoraActivity].as$object.add(namedNode(userMedia))
          }

        }
        break;
        default:
        console.log(r.message.type , "non traite")
      }
    })

    await data[app.storage+"public/spoggy/tags.ttl"].rdfs$label.add("Tags")
    tags.forEach(async function(t){
      var taguri = app.storage+"public/spoggy/tags.ttl#"+t.trim();
      await  data[userActivity].as$tag.add(namedNode(taguri))
      //    console.log(taguri+ " -- >created")
    })

    this.responses = []
    //  this.updatePod(data)

  }



  sendFile(uri, file, contentType){
    this.fileClient.createFile(uri, file, contentType)
    .then(
      success =>{
        console.log(success)
        //  this.agent.send("Messages", {action: "info", status: "Save file OK", file: success})
      },
      err => {
        console.log(err)
      });
    }

  }

  customElements.define('post-tabs-element', PostTabsElement);
