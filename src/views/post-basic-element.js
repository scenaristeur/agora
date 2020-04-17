import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class PostBasicElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      share: {type: Object},
      confidentialite: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Post Basic"
    this.share = {}
    this.confidentialite = [{level: "Public", selected: true, value: "public", description: "Everyone", icon:"fas fa-globe"},
    {level: "Not listed", value: "not_listed", description: "Not listed in public ?", icon: ""},
    {level: "Followers", value: "followers", description: "Only your followers", icon: ""},
    {level: "Direct", value: "direct", description: "Only listed users", icon: ""}]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">


    <div class="card" style="width: 18rem;">
    <!--    <img class="card-img-top" src="..." alt="Card image cap">-->
    <div class="card-body">
    <label class="sr-only" for="title">Title</label>
    <div class="input-group mb-2">
    <input id="title" class="form-control" type="text" value="${this.share.title}" placeholder="Title">
    </div>

    <textarea class="form-control border border-info rounded"
    id="content"
    style="width:100%;height:38vh"
    placeholder="Write a note on your Pod & share it on Agora">
    ${this.share.text}

    ${this.share.url}
    </textarea>

    <select id="confid" class="custom-select" @change="${this.change}" @input="${this.input}" @select="${this.select}"> <!--multiple-->
    ${this.confidentialite.map(c =>
      html`
      <option

      value="${c.value}" title="${c.description}">
      <!-- <i class="${c.icon}"></i> -->
      ${c.level}
      </option>
      `
    )}
    </select>

    <button class="btn btn-primary" @click="${this.send}">Spog !</button>
    </div>
    </div>
    `;
  }

  select(e){
    console.log(e.target.value)
  }

  input(e){
    console.log(e.target.value)
  }

  change(e){
    console.log(e.target.value)
  }



  send(){
    let title = this.shadowRoot.getElementById("title").value.trim()
    let content = this.shadowRoot.getElementById("content").value.trim()
    let confid = this.shadowRoot.getElementById("confid").value
  /*pour multiselect
    let conf = Array(...confid_select.options).reduce((acc, option) => {
      if (option.selected === true) {
        acc.push(option.value);
      }
      return acc;
    }, []);*/

    console.log(title, content, confid)
    alert(title+" "+content+" "+confid)
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
  }

}

customElements.define('post-basic-element', PostBasicElement);
