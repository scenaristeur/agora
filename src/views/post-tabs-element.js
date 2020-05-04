import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { namedNode } from '@rdfjs/data-model';

import { v4 as uuidv4 } from 'uuid';


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
      config: {type: Object},
      share: {type: Object},
      confidentialite: {type: Array},
      title: {type: String},
      log: {type: String},
      debug: {type: Boolean},
      friends: {type: Array},
      followers: {type: Array},
      groups: {type: Array},
      confid: {type: String}
    };
  }

  constructor() {
    super();
    this.debug = false
    this.fileClient = new SolidFileClient(solid.auth)
    this.webId = null
    this.subelements = ["Note", "Media", "Triple"] //, "Media", "Triple"] , "Graph"
    this.requetes = {}
    this.responses = []
    this.info = ""
    this.replyTo = {}
    this.config = {}
    this.share = {}
    this.friends = []
    this.followers = []
    this.groups = []
    this.confidentialite = [
      {level: "Public", selected: true, value: "public", description: "Everyone", icon:"fas fa-globe"},
      //  {level: "Not listed", value: "not_listed", description: "Not listed in public ?", icon: "fas fa-lock-open"},
      {level: "Me (test)", value: "me", description: "Only me", icon: "fas fa-lock"},
      {level: "Friends", value: "friends", description: "Only your friends", icon: "fas fa-lock"},
      {level: "Followers (todo)", value: "followers", description: "Only your followers", icon: "fas fa-lock"},
      {level: "Groups (todo)", value: "groups", description: "One of your groups", icon: "fas fa-lock-open"},
    //  {level: "Direct (todo)", value: "direct", description: "Only listed users", icon: "fas fa-envelop"}
    ]
    this.confid = "public"
    this.log = ""
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

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    config : ${JSON.stringify(this.config)}</br>
    </div>

    <div class="container">
    <div class="row">

    ${this.replyTo.url != null ?
      html `
      TODO<br>
      replyTo url  ${this.replyTo.url}<br>
      replyTo attributedTo  ${this.replyTo.attributedTo} <br>
      replyTo name  ${this.replyTo.name} <br>

      <label class="sr-only" for="reply">Reply to</label>
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
    <note-element name="Note" .share="${this.share}"></note-element>
    </div>

    <div id="Media" class="tabcontent" style="height: 40vh">
    <media-element name="Media"></media-element>
    </div>

    <div id="Triple" class="tabcontent" style="height: 40vh">
    <triple-element name="Triple"></triple-element>
    </div>

    <!--  <div id="Graph" class="tabcontent" style="height: 40vh">
    <h3 class="text-primary">Graph</h3>
    <p class="text-primary">todo.</p>
    <graph-element name="Graph"></graph-element>
    </div>-->

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

    <select id="confid" class="custom-select" @change="${this.change}" @input="${this.input}" @select="${this.select}"> <!--multiple-->
    ${this.confidentialite.map(c =>
      html`
      <option

      value="${c.value}" title="${c.description}">
      ${c.level}
      </option>
      `
    )}
    </select>
    <hr>

    Confid : ${this.confid}

    <select id="friends" ?hidden="${this.confid!='friends'}" class="custom-select" multiple>
    <option disabled>Select Multi Recipient</option>

    ${this.friends.map(f =>
      html `
      <option selected value="${f}">${f}</option>
      `)}
      </select>

      <select id="followers" ?hidden="${this.confid!='followers'}" class="custom-select" multiple>
      <option disabled>Select Multi Recipient</option>

      ${this.followers.map(f =>
        html `
        <option selected value="${f}">${f}</option>
        `)}
        </select>

        <select id="groups" ?hidden="${this.confid!='groups'}" class="custom-select" multiple>
        <option disabled>Select Multi Recipient</option>

        ${this.groups.map(g =>
          html `
          <option value="${g}">${g}</option>
          `)}
          </select>



        </div>


        <div class="buttons">
        <div class="row">
        <!--  <div class="col-4">
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="agora_pub" name="agora_pub" checked>
        <label class="text-primary" for="agora_pub">
        Push to Agora
        </label>
        </div>
        </div>-->
        <div class="col-4">
        Log : ${this.log}
        </div>
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



      /*  input(e){
      console.log(e.target.value)
    }*/

    change(e){
      this.confid = e.target.value
      console.log(e.target.value)
      console.log(this.config)
    }


    addNote(){
      this.log = "Add Note"
      var id = new Date().toISOString ()
      this.requetes = []
      var title = this.shadowRoot.getElementById('title').value.trim();
      if (title.length == 0){
        alert ("Don't you want to provide a  beautiful title to your wonder post ?")
      }else{


        this.requetes[id] = this.subelements.length
        console.log(this.requetes)
        this.log = "Ask SubElements Content"
        var mess = {action: "askContent", id : id}
        this.agent.sendMulti(this.subelements, mess)

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
      console.log(this.agent)
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
      if(this.share.title != "undefined" && this.share.title != null){
        this.title = this.share.title
      }
      this.agent.send("Store", {action: "getConfig"}) //nedded because of lazy loading of this element
    }

    configChanged(config){
      console.log("CONFIG CHANGED",config)
      this.config = config
      this.friends = this.config.friends || []
      this.followers = this.config.followers || []
      this.groups = this.config.groups || []
      //      this.requestUpdate()
    }

    async setReplyTo(message){
      console.log(message)
      if (message.replyTo != undefined){
        this.replyTo ={}
        this.replyTo.url  = message.replyTo
        let attributedTo = await solid.data[this.replyTo.url].as$attributedTo
        let name = await solid.data[`${attributedTo}`].vcard$fn || `${friend}`.split("/")[2].split('.')[0];
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



      let agora_pub = false
      let recipients = []
      switch (this.confid) {
        case "public":
        //  recipients = ["https://agora.solid.community/profile/card#me"]
        agora_pub = true
        break;
        case "me":
        recipients = [this.config.webId]
        break;
        case "friends":
        let friends_select = this.shadowRoot.getElementById("friends")
        recipients = Array(...friends_select.options).reduce((acc, option) => {
          if (option.selected === true) {
            acc.push(option.value);
          }
          return acc;
        }, []);
        console.log(recipients)
        break;
        case "followers":
        let followers_select = this.shadowRoot.getElementById("followers")
        recipients = Array(...followers_select.options).reduce((acc, option) => {
          if (option.selected === true) {
            acc.push(option.value);
          }
          return acc;
        }, []);
        console.log(recipients)
        break;
        case "groups":
        let groups_select = this.shadowRoot.getElementById("groups")
        recipients_group = Array(...followers_select.options).reduce((acc, option) => {
          if (option.selected === true) {
            acc.push(option.value);
          }
          return acc;
        }, []);
        console.log("must retrive each member of ", recipients_group)
        break;







        default:
        alert(this.confid + "non traité line 408")
      }


      console.log("RECIPIENTS",recipients)
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
      this.storage = await solid.data.user.storage

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
            objects.push({uri: object_uri, file: object_file})
            console.log("CREATE NOTE WITH", r.message.content, object_uri)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(title)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(r.message.content)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(app.config.webId))

          }
          break;
          case "Image":
          case "Video":
          case "Audio":
          case "Document":
          // https://www.w3.org/wiki/SocialCG/ActivityPub/MediaUpload must normally be uploaded to recipient endpoint
          if(r.message.content != undefined){
            var file = r.message.content
            var contentType = file.contentType
            var newFilename = r.message.newFilename
            var classe = r.message.type
            /*
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+r.message.type))
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(title)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(r.message.content)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(app.config.webId))
            */
            // no need to create an Object.ttl, replce by file ?
            let object_file = app.config.outbox+"objects/"+classe+"/"+newFilename
            let object_uri = object_file // pas de #this
            // var object_uri = app.storage+"public/spoggy/"+classe+"/"+newFilename
            console.log("CREATE DOCUMENT WITH",r.message, object_uri)
            await app.sendFile(object_file, file, contentType)
            //   await  data[userActivity].as$object.add(namedNode(userMedia))

            objects.push({uri: object_uri, file: object_file})
          }
          break;
          case "Triple":
          if(r.message.content.length > 0){
            objects.push({uri: object_uri, file: object_file})
            content = r.message.content
            console.log("CREATE DOCUMENT WITH",r.message, object_uri)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+r.message.type))
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(title)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
            await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(app.config.webId))
            //           await solid.data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(r.message.content)

            //write subject https://github.com/LDflex/LDflex/issues/53
            r.message.content.forEach(async function(triple, i) {
              //  console.log(triple)
              let subject = object_file+"#"+triple.subject
              let predicate = object_file+"#"+triple.predicate
              let object = object_file+"#"+triple.object
              //console.log(subject, predicate, object)
              await solid.data[subject][predicate].add(namedNode(object))
            });
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

    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#summary'].add(title)
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
    await solid.data[activity_uri].rdfs$label.add(title)

    /*  if (recipients.length== 0){
    await solid.data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(app.config.webId))
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(app.config.webId))
  }*/

  // ACL OBJECT
  let recipientsWebIds = []
  recipients.forEach((r, i) => {
    recipientsWebIds.push('<'+r+'>')
  });
  let aclStringWebIds = recipientsWebIds.join(', ')
  console.log("ACL STRING", aclStringWebIds)

  objects.forEach(async function(o, i) {
    app.setAcl(o, aclStringWebIds, agora_pub)
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#object'].add(namedNode(o.uri))
    recipients.forEach(async function(to, i) {
      if (o.uri.endsWith("#this")){
        await solid.data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(to))
      }
    })
    if (agora_pub == true){
      await solid.data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode("https://agora.solid.community/profile/card#me"))
      await solid.data[o.uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode("https://www.w3.org/ns/activitystreams#Public"))
    }
  });

  this.log = activity_uri+ "DONE"
  console.log("Activity OK",activity_uri)
  let activity = {url: activity_uri, file: activity_file}
  app.setAcl(activity, aclStringWebIds, agora_pub)





  /* ACL pour plusieurs createFolders
  @prefix : <#>.
  @prefix n0: <http://www.w3.org/ns/auth/acl#>.
  @prefix c: </profile/card#>.
  @prefix c0: <https://spoggy-test2.solid.community/profile/card#>.
  @prefix c1: <https://spoggy-test3.solid.community/profile/card#>.

  :ControlReadWrite
  a n0:Authorization;
  n0:accessTo <fa8740cc-8eaf-4ae8-8489-b4d96783d224.ttl>;
  n0:agent c:me;
  n0:mode n0:Control, n0:Read, n0:Write.
  :Read
  a n0:Authorization;
  n0:accessTo <fa8740cc-8eaf-4ae8-8489-b4d96783d224.ttl>;
  n0:agent c0:me, c1:me;
  n0:mode n0:Read.*/


  /* ACL plusieurs readers & public
  @prefix : <#>.
  @prefix n0: <http://www.w3.org/ns/auth/acl#>.
  @prefix c: </profile/card#>.
  @prefix c0: <https://spoggy-test2.solid.community/profile/card#>.
  @prefix c1: <https://spoggy-test3.solid.community/profile/card#>.
  @prefix n1: <http://xmlns.com/foaf/0.1/>.

  :ControlReadWrite
  a n0:Authorization;
  n0:accessTo <fa8740cc-8eaf-4ae8-8489-b4d96783d224.ttl>;
  n0:agent c:me;
  n0:mode n0:Control, n0:Read, n0:Write.
  :Read
  a n0:Authorization;
  n0:accessTo <fa8740cc-8eaf-4ae8-8489-b4d96783d224.ttl>;
  n0:agent c0:me, c1:me;
  n0:agentClass n1:Agent;
  n0:mode n0:Read.
  */





  if (agora_pub == true){
    this.log = "Add Public to recipients"
    console.log("PUBLIC",agora_pub)
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode("https://agora.solid.community/profile/card#me"))
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode("https://www.w3.org/ns/activitystreams#Public"))
    recipients.push("https://agora.solid.community/profile/card#me")
  }




  recipients.forEach(async function(to, i) {
    console.log("TO",to)
    app.log = "notification to "+to
    await solid.data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(to))

    // recipient notification
    let notification_Id = uuidv4();
    let pti = await solid.data[to].publicTypeIndex
    console.log(pti)

    let instanceTrouvee = false

    for await (const subject of solid.data[pti].subjects){
      let s = `${subject}`
      //  console.log(s)
      if(pti != `${subject}`){

        //  console.log(s)
        if (`${subject}`.endsWith('#Agora')){
          instanceTrouvee = true
          console.log(s)
          let instance  = await solid.data[`${subject}`].solid$instance
          let ib = await solid.data[`${instance}`].as$inbox
          let recip_inbox = `${ib}`
          let notification_uri = recip_inbox+notification_Id+".ttl#this"

          console.log(notification_uri)

          await solid.data[notification_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
          await solid.data[notification_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(app.config.webId))
          await solid.data[notification_uri]['https://www.w3.org/ns/activitystreams#summary'].add(title)
          await solid.data[notification_uri].rdfs$label.add(title)
          await solid.data[notification_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
          await solid.data[notification_uri]['https://www.w3.org/ns/activitystreams#link'].add(namedNode(activity_uri))
          app.log = notification_uri+ "DONE"

          //  var dateObj = new Date();
          //  var messageId = "#Msg"+dateObj.getTime()
          var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
          var day = ("0" + dateObj.getUTCDate()).slice(-2);
          var year = dateObj.getUTCFullYear();
          var path = recip_inbox+[year, month, day, ""].join("/")
          console.log(path)

          //  var url = path+"chat.ttl"+messageId
          //  this._lastPost = url
          //var date = dateObj.toISOString()
          var index = path+"index.ttl#this"
          console.log(date)
          //  console.log(url)
          console.log(index)
          //  await solid.data[index]['https://www.w3.org/ns/activitystreams#published'].add(date)
          await solid.data[index]['https://www.w3.org/ns/activitystreams#item'].add(namedNode(notification_uri))

        }
      }
    }

    instanceTrouvee == false ? alert("No Agora Instance found in "+to+" Public Type Index ") : "";
  });
  this.log = "Send OK"
  this.toggleWrite()
  this.agent.send("App", {action: "showPanel", panel: "Flow"})
}


async setAcl(o, aclStringWebIds, agora_pub){
  this.log = "Set ACL for ",o.file
  let aclString = `
  @prefix : <#>.
  @prefix acl: <http://www.w3.org/ns/auth/acl#>.
  @prefix c: </profile/card#>.

  :ControlReadWrite
  a acl:Authorization;
  acl:accessTo <${o.file}>;
  acl:agent c:me;
  acl:mode acl:Control, acl:Read, acl:Write.
  :Read
  a acl:Authorization;
  acl:accessTo <${o.file}>;
  ${aclStringWebIds.length > 0 ?   ` acl:agent ${aclStringWebIds};`  : "" }
  ${agora_pub == true ?   "acl:agentClass <http://xmlns.com/foaf/0.1/Agent> ;" : ""}
  acl:mode acl:Read.`

  //  console.log(aclString)
  try{
    await this.fileClient.createFile (o.file+'.acl', aclString, "text/turtle")
    this.log = o.file+'.acl Created'
  }catch(e){
    alert(e)
  }
}

/*
async sendFile(uri, file, contentType){
await this.fileClient.createFile(uri, file, contentType)
.then(
success =>{
console.log(success)
//  this.agent.send("Messages", {action: "info", status: "Save file OK", file: success})
},
err => {
console.log(err)
});
}*/

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
  this.storage = await solid.data.user.storage
  var userActivity = this.storage+"public/spoggy/activity.ttl#"+id
  console.log("Creation ", userActivity)
  await solid.data[userActivity].as$name.set(title)
  await solid.data[userActivity].rdfs$label.set(title)
  await solid.data[userActivity].schema$dateCreated.set(date.toISOString())
  await solid.data[userActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
  inReplyTo!= null && inReplyTo.length > 0 ? await solid.data[userActivity].as$inReplyTo.add(namedNode(inReplyTo)) : "";

  if (agora_pub == true){
    var agoraActivity = "https://agora.solid.community/public/spoggy/activity.ttl#"+id
    await solid.data[agoraActivity].as$name.add(title)
    await solid.data[agoraActivity].rdfs$label.add(title)
    await solid.data[agoraActivity].schema$dateCreated.add(date.toISOString())
    await solid.data[agoraActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
    await solid.data[agoraActivity].as$actor.add(namedNode(app.webId))
    await solid.data[agoraActivity].as$target.add(namedNode(userActivity))
    inReplyTo!= null &&  inReplyTo.length > 0 ? await solid.data[agoraActivity].as$inReplyTo.add(namedNode(inReplyTo)) : "";
  }

  this.responses.forEach(async function(r){
    switch (r.message.type) {
      case "Note":
      if (r.message.content.length > 0){
        var userNote = app.storage+"public/Notes/"+id+".ttl"
        var content = r.message.content
        await solid.data[userNote].schema$text.add(content);
        await solid.data[userNote].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
        await solid.data[userActivity].schema$text.add(content);
        await solid.data[userActivity].as$object.add(namedNode(userNote))

        if (agora_pub == true){
          await solid.data[agoraActivity].schema$text.add(content);
          await solid.data[agoraActivity].as$object.add(namedNode(userNote))
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
        await  solid.data[userActivity].as$object.add(namedNode(userMedia))
        await  solid.data[agoraActivity].as$object.add(namedNode(userMedia))
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
  this.storage = await solid.data.user.storage


  var userActivity = this.storage+"public/spoggy/activity.ttl#"+id
  console.log("Creation ", userActivity)
  await  solid.data[userActivity].rdfs$label.add(title)
  await  solid.data[userActivity].schema$dateCreated.add(date.toISOString())

  await solid.data[userActivity].as$name.add(title)
  await solid.data[userActivity].as$generator.add(window.location.origin)
  await solid.data[userActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
  console.log(userActivity+ " -- >created")
  await solid.data[app.storage+"public/spoggy/tags.ttl"].rdfs$label.add("Tags")

  var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
  if (agora_pub == true){
    console.log("Creation ", userActivity)
    var agoraActivity = "https://agora.solid.community/public/spoggy/activity.ttl#"+id
    await solid.data[agoraActivity].schema$dateCreated.add(date.toISOString())
    await solid.data[agoraActivity].rdfs$label.add(title)
    await solid.data[agoraActivity].as$name.add(title)
    await solid.data[agoraActivity].as$target.add(namedNode(userActivity))
    await solid.data[agoraActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Add'))
    await solid.data[agoraActivity].schema$creator.add(namedNode(app.webId))
    await solid.data[agoraActivity].as$actor.add(namedNode(app.webId))
    console.log(agoraActivity+ " -- >created")
  }

  tags.forEach(async function(t){
    var taguri = app.storage+"public/spoggy/tags.ttl#"+t.trim();
    await  solid.data[userActivity].as$tag.add(namedNode(taguri))
    //    console.log(taguri+ " -- >created")
  })

  //  var path = this.storage+"public/Notes/"+id+".ttl"
  //  console.log(data)
  //  var tit = await  solid.data[path].rdfs$label.add("title ONE")
  //  var cont = await solid.data[path].schema$text.add("content ONE");


  this.responses.forEach(async function(r){
    switch (r.message.type) {
      case "Note":
      var userNote = app.storage+"public/spoggy/Notes/"+id+".ttl"
      var content = r.message.content
      await solid.data[userNote].rdfs$label.add(title)
      await solid.data[userNote].schema$text.add(content);
      await solid.data[userNote].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
      //!!! as$Note ne fonctionne pas
      await  solid.data[userActivity].as$attachment.add(namedNode(userNote))
      await solid.data[userActivity].schema$text.add(content);

      var agora_pub = app.shadowRoot.getElementById('agora_pub').checked
      if (agora_pub == true){
        //!!! as$Note ne fonctionne pas
        await  solid.data[agoraActivity].as$object.add(namedNode(userNote))
        await solid.data[agoraActivity].schema$text.add(content);
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
        await  solid.data[userActivity].as$attachment.add(namedNode(userMedia))
        if (agora_pub == true){
          //!!! as$Note ne fonctionne pas
          await  solid.data[agoraActivity].as$object.add(namedNode(userMedia))
        }

      }
      break;
      default:
      console.log(r.message.type , "non traite")
    }
  })

  await solid.data[app.storage+"public/spoggy/tags.ttl"].rdfs$label.add("Tags")
  tags.forEach(async function(t){
    var taguri = app.storage+"public/spoggy/tags.ttl#"+t.trim();
    await  solid.data[userActivity].as$tag.add(namedNode(taguri))
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
