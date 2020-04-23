import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)
import { namedNode } from '@rdfjs/data-model';


class ProfileElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      config: {type: Object}, // config : current loged user
      p_config : {type: Object}, // p_config : the user that the profile-element shows
    };
  }

  constructor() {
    super();
    this.name = "Profile"
    this.config = {}
    this.p_config = {storage: "Loading..."}
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
        `}
        `
        :html``
      }

      </div>
      </div>
      `;
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
      let profile_followers = this.p_config.followers+'index.ttl#this'
      console.log(profile_followers)
      let user_following = this.config.following+'index.ttl#this'
      console.log(user_following)
      await solid.data[user_following].as$items.add(namedNode(this.p_config.webId))
      console.log("!!! Must first set authenticated agent to publisher in config")
      await solid.data[profile_followers].as$items.add(namedNode(this.config.webId))
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
          let followers = await solid.data[this.p_config.instance].as$followers
          this.p_config.followers = `${followers}`
          let following = await solid.data[this.p_config.instance].as$following
          this.p_config.following = `${following}`
          let liked = await solid.data[this.p_config.instance].as$liked
          this.p_config.liked = `${liked}`
        }
      }
      let storage = await solid.data[this.p_config.webId].storage
      this.p_config.storage = `${storage}`
this.p_config.organization =  await solid.data[this.p_config.webId]["http://www.w3.org/2006/vcard/ns#organization-name"]
this.p_config.role =  await solid.data[this.p_config.webId]["http://www.w3.org/2006/vcard/ns#role"]

      console.log("P_PROFILE",this.p_config)
      this.requestUpdate()
    }

  }

  customElements.define('profile-element', ProfileElement);
