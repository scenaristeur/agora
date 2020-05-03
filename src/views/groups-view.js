import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { namedNode } from '@rdfjs/data-model';

import { v4 as uuidv4 } from 'uuid';

class GroupsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      groups: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Groups View"
    this.debug = false
    this.config = {}
    this.groups = []
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div ?hidden = "${!this.debug}">
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    <!--config : ${JSON.stringify(this.config)}<br>-->
    groupindex : ${this.config.group_index}<br>
    </div>

    <div class="container-fluid">

    <input type="text" id="groupName" class="form-control"
    placeholder="Group's name"
    aria-label="Group's name" aria-describedby="basic-addon2">
    <input type="text" id="groupRole" class="form-control"
    placeholder="Purpose, Role of the group"
    aria-label="Purpose, Role of the group" aria-describedby="basic-addon3">
    <div class="input-group-append">

    <div class="input-group mb-3">

    <button class="btn btn-outline-secondary" type="button" @click=${this.addGroup}>Add Group</button>
    </div>
    </div>

    <br>
    Group length : ${this.groups.length}

    ${this.groups.map((g, i) => html`
      <group-view name="${"Group_"+i}" uri=${g}>Loading Group</group-view>
      `
    )}



    </div>
    `;
  }

  async addGroup(){
    let g_name = this.shadowRoot.getElementById("groupName").value.trim() //.replace(/[^a-zA-Z0-9]/g,'_');
    let g_id = uuidv4();
    let g_role = this.shadowRoot.getElementById("groupRole").value.trim()
    let g_uri = this.config.group_folder+g_id+".ttl"
    console.log(this.config.group_index, g_uri)
    await solid.data[this.config.group_index].as$item.add(namedNode(g_uri))
    await solid.data[g_uri].rdf$type.add(namedNode("http://www.w3.org/2006/vcard/ns#Group"))
    await solid.data[g_uri].vcard$title.add(g_name)
    await solid.data[g_uri].vcard$role.add(g_role)
    await solid.data[g_uri].vcard$hasUID.add(g_id)

    await solid.data[g_uri].vcard$hasMember.add(namedNode(this.config.webId))
    await solid.data[g_uri].vcard$hasMember.add(namedNode("https://spoggy-test3.solid.community/profile/card#me"))
    await solid.data[g_uri].vcard$hasMember.add(namedNode("https://spoggy-test9.solid.community/profile/card#me"))
    
    this.shadowRoot.getElementById("groupName").value = ""
    this.shadowRoot.getElementById("groupRole").value = ""
    await this.updateGroups()
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
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  async configChanged(config){
    this.config = config
    this.config.group_index = this.config.storage+"public/agora/groups.ttl#this"
    this.config.group_folder = this.config.storage+"public/agora/groups/"
    console.log("GROUP CONFIG", this.config)
    // this.requestUpdate()
    await this.updateGroups()
  }

  async updateGroups(){
    let groups = []
    for await (const group of solid.data[this.config.group_index].as$item){
      let g = `${group}`
      groups = [... groups, g]
    }
    this.groups =  []
    this.groups = groups
    console.log("GROUPS",this.groups)
    this.requestUpdate()
  }

}

customElements.define('groups-view', GroupsView);
