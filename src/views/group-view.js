import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class GroupView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      uri: {type: String},
      group: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Group"
    this.debug = false,
    this.uri = ""
    this.group = {members: []}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    uri: ${this.uri}<br>
    group: ${JSON.stringify(this.group)}<br>
    <!--  config : ${JSON.stringify(this.config)}<br> -->
    </div>

    <div class="container-fluid">
    <b><a href="${this.group.uri}" target="_blank">${this.group.name}</a></b>
    <p>
    ${this.group.role}
    </p>

    ${this.group.members.map((m, i) => html`
      <friend-view name="${"Member_"+i}" f_webId=${m}>Loading Member</friend-view>

      `
    )}


    </div>
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
          default:
          console.log("Unknown action ",message)
        }
      }
    };
    this.init()
  }

  async init(){
    this.group.uri = this.uri
    let name = await solid.data[this.uri].vcard$title
    let role = await solid.data[this.uri].vcard$role
    this.group.name = `${name}`
    this.group.role = `${role}`
    console.log(this.group)
    await  this.updateMembers()
  }


  async updateMembers(){
    let members = []
    for await (const member of solid.data[this.uri].vcard$hasMember){
      let m = `${member}`
      members = [... members, m]
    }
    this.group.members =  []
    this.group.members = members
    console.log("GROUP Members",this.group)
    this.requestUpdate()
  }


}

customElements.define('group-view', GroupView);
