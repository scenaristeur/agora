import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class ProfileElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String}, // webId : current loged user
      p_config : {type: Object}, // p_webId : the user that the profile-element shows
    };
  }

  constructor() {
    super();
    this.name = "Profile"
    this.webId = null
    this.p_config = {}
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
    <h5 class="card-title">Username: ${this.p_config.name}</h5>

    <p class="card-text">
    Your WebId : ${this.webId}<br>
    User  webId :<b>${this.p_config.webId}</b><br>
    <!--    Photo: ${this.p_config.photo}<br>
    Role: ${this.p_config.role}<br>
    Organisation: ${this.p_config.organisation}<br>-->
    More : Some quick example text to build on the card title and make up the bulk of the card's content.
    </p>

    ${this.webId != null ?
      html`
      ${this.webId != this.p_config.webId ?
        html `<button class="btn btn-primary" @click="${this.follow}">Follow</button>
        `
        :html `
        <button class="brn btn-primary" @click="${this.edit}">Edit My Profile (WIP)</button>
        `}
        `
        :html`<login-element name="Login1">Login</login-element>`
      }

      </div>
      </div>
      `;
    }

    close(){
      this.agent.send("App", {action: "pageChanged", page: "default"})
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
            case "profileChanged":
            app.profileChanged(message.webId)
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

    webIdChanged(webId){
      this.webId = webId
    }
    configChanged(config){
      this.config = config
    }

    async  follow(){
      // Must create a follow Activity with accept ?

      let profile_followers = this.p_config.followers+'index.ttl#this'
      console.log(profile_followers)
      let user_following = this.config.following+'index.ttl#this'
      console.log(user_following)
      await data[user_following].as$items.add(namedNode(this.p_config.webId))
      console.log("!!! Must first set authenticated agent to publisher in config")
      await data[profile_followers].as$items.add(namedNode(this.config.webId))
    }



    async profileChanged(webId){
      this.p_config = {}
      this.p_config.webId = webId
      this.p_config.pti = await data[this.p_config.webId].publicTypeIndex
      for await (const subject of data[this.p_config.pti].subjects){
        if(this.p_config.pti != `${subject}`)
        /*let s = `${subject}`
        console.log(s)*/
        if (`${subject}`.endsWith('#Shighl')){
          let instance  = await data[`${subject}`].solid$instance
          this.p_config.instance = `${instance}`
          //  let inbox = await data[this.p_config.instance].as$inbox
          //  this.p_config.inbox = `${inbox}`
          //  let outbox = await data[this.p_config.instance].as$outbox
          //  this.p_config.outbox = `${outbox}`
          let followers = await data[this.p_config.instance].as$followers
          this.p_config.followers = `${followers}`
          //  let following = await data[this.p_config.instance].as$following
          //  this.p_config.following = `${following}`
          //  let liked = await data[this.p_config.instance].as$liked
          //  this.p_config.liked = `${liked}`
        }
      }
      console.log(this.p_config)
    }

  }

  customElements.define('profile-element', ProfileElement);
