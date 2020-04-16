import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class PostBasicElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      share: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Post Basic"
    this.share = {}
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
    <button class="btn btn-primary" @click="${this.send}">Spog !</button>
    </div>
    </div>
    `;
  }

  send(){
    let title = this.shadowRoot.getElementById("title").value.trim()
    let content = this.shadowRoot.getElementById("content").value.trim()
    console.log(title, content)
    alert(title+" "+content)
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
