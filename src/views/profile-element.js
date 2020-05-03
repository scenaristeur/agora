import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { namedNode } from '@rdfjs/data-model';


class ProfileElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      config: {type: Object}, // config : current loged user
      p_config : {type: Object}, // p_config : the user that the profile-element shows
      friends: {type: Array},
      followers: {type: Array},
      following: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Profile"
    this.config = {}
    this.p_config = {storage: "Loading..."}
    this.friends = []
    this.followers = []
    this.following = []
    this.fileClient = new SolidFileClient(solid.auth)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    .close {
      color: "#aaaaaa";
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: "#000";
      text-decoration: none;
      cursor: pointer;
    }
    </style>
    <div class="row">
    <div class="col">
    <div class="card" style="width: 18rem;">
    <i @click="${this.close}" class="close fas fa-window-close"></i>

    <img class="card-img-top" src="${this.p_config.photo}" alt="Card image cap">
    <div class="card-body">
    <h5 class="card-title"><b>${this.p_config.name}</b></h5>

    <p class="card-text">

    User  webId :<b>${this.p_config.webId}</b><br>
    Storage : <a
    href="https://scenaristeur.github.io/spoggy-simple/?source=${this.p_config.storage}"
    target="_blank" >${this.p_config.storage}</a><br>
    <!--stringVariable.substring(0, stringVariable.lastIndexOf('#'));-->
    Role: ${this.p_config.role}<br>
    Organisation: ${this.p_config.organization}<br>
    <br>
    <br>  Your WebId : ${this.config.webId}<br>
    </p>

    ${this.config.webId != null ?
      html`
      ${this.config.webId != this.p_config.webId ?
        html `<button class="btn btn-outline-info btn-sm" @click="${this.follow}"><i class="fas fa-user-plus"></i>Follow</button>
        `
        :html `
        <button class="brn btn-outline-primary btn-sm" @click="${this.edit}">Edit My Profile (WIP)</button>
        <button class="brn btn-outline-primary btn-sm" @click="${this.showConfig}">Configuration</button>

        `}
        `
        :html``
      }

      </div>
      </div>
      </div>

      <div class="col">
      <div class="card" style="width: 18rem;">
      <ul class="list-group list-group-flush">
      <li class="list-group-item">${this.friends.length} friends</li>
      <li class="list-group-item">${this.followers.length} followers</li>
      <li class="list-group-item">${this.following.length} following</li>
      </ul>
      </div>

      <!--   <div class="col">
      <div class="card" style="width: 18rem;"> -->

      <groups-view name="Groups">Loading groups</groups-view>

    <!--  </div>
      </div>-->


      </div>

      `;
    }


    /*
    <!--  <div class="row">
    <div class="col">
    ${this.p_config.friends.lengh} Friends
    </div>
    <div class="col">
    ${this.p_config.followers.lengh} Followers
    </div>
    <div class="col">
    ${this.p_config.following.lengh} Following
    </div>
    </div>-->
    */

    showConfig(){
      this.agent.send("App", {action: "showPanel", panel: "Config"})
      this.agent.send("Config", {action: "newConfig", config: this.config})
    }


    edit(){
      alert("// TODO: come back later ;-) ")
    }

    close(){
      this.agent.send("App", {action: "showPanel"})
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
            case "profileChanged":
            app.profileChanged(message.profile)
            break;
            case "configChanged":
            app.configChanged(message.config)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    init(){
      console.log("TODO check if user webId follow this profile")

    }

    configChanged(config){
      this.config = config
    }

    async  follow(){
      // Must create a follow Activity with accept ?
      //  alert("// TODO: come back later ;-) ")
      console.log("CONFIG", this.config)
      console.log("P_CONFIG", this.p_config)
      /*  let profile_followers = this.p_config.followers_folder+'index.ttl#this'
      console.log(profile_followers)*/
      let user_following = this.config.following_folder+'index.ttl#this'
      console.log(user_following)
      await solid.data[user_following].as$items.add(namedNode(this.p_config.webId))
      //  console.log("!!! Must first set authenticated agent to publisher in config")
      //  await solid.data[profile_followers].as$items.add(namedNode(this.config.webId))
      console.log(this.config.webId.split("/")[2])
      let followFile = this.p_config.followers_folder+this.config.webId.split("/")[2]+".ttl"

      try{
        await this.fileClient.createFile (followFile, "", "text/turtle")
        console.log(`${followFile}`)
      }catch(e){
        alert(e)
      }



      /*
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
  */


}



async profileChanged(profile){
  console.log("USER",profile)
  this.p_config = profile
  this.p_config.pti = await solid.data[this.p_config.webId].publicTypeIndex
  for await (const subject of solid.data[this.p_config.pti].subjects){
    if(this.p_config.pti != `${subject}`)
    /*let s = `${subject}`
    console.log(s)*/
    if (`${subject}`.endsWith('#Agora')){
      let instance  = await solid.data[`${subject}`].solid$instance
      this.p_config.instance = `${instance}`
      let inbox = await solid.data[this.p_config.instance].as$inbox
      this.p_config.inbox = `${inbox}`
      let outbox = await solid.data[this.p_config.instance].as$outbox
      this.p_config.outbox = `${outbox}`
      let followers_folder = await solid.data[this.p_config.instance].as$followers
      this.p_config.followers_folder = `${followers_folder}`
      let following_folder = await solid.data[this.p_config.instance].as$following
      this.p_config.following_folder = `${following_folder}`
      let liked = await solid.data[this.p_config.instance].as$liked
      this.p_config.liked = `${liked}`
      let disliked = await solid.data[this.p_config.instance].as$disliked
      this.p_config.disliked = `${disliked}`
    }
  }
  let storage = await solid.data[this.p_config.webId].storage
  this.p_config.storage = `${storage}`
  this.p_config.organization =  await solid.data[this.p_config.webId]["http://www.w3.org/2006/vcard/ns#organization-name"]
  this.p_config.role =  await solid.data[this.p_config.webId]["http://www.w3.org/2006/vcard/ns#role"]
  /*  this.friends = this.p_config.friends || []
  this.followers = this.p_config.followers || []
  this.following = this.p_config.following || []*/

  this.friends = []
  this.followers = []
  this.following = []


  for await (const friend of solid.data[this.p_config.webId].friends){
    let f = `${friend}`
    this.friends = [... this.friends, f]
  }

  //  this.p_config.followers_uri = this.p_config.followers_folder+"index.ttl#this"
  for await (const f_er of solid.data[this.p_config.followers_folder].ldp$contains){
    let fer = `${f_er}`
    this.followers = [... this.followers, fer]
  }

  this.p_config.following_uri = this.p_config.following_folder+"index.ttl#this"
  for await (const f_ing of solid.data[this.p_config.following_uri].as$items){
    let fing = `${f_ing}`
    this.following = [... this.following, fing]
  }


  console.log("P_PROFILE",this.p_config)
  this.requestUpdate()
}

}

customElements.define('profile-element', ProfileElement);
