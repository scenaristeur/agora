import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class TestRdfeasyElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "test TestRdfeasyElement"
    this.rdf = new RDFeasy(SolidAuthClient)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
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
    const profile = "https://jeffz.solid.community/profile/card"
    const inbox = "https://agora.solid.community/public/agora/inbox/"
    let jeff =  await this.rdf.value(profile,`SELECT ?name WHERE { :me foaf:name ?name. }`)
    console.log(`${jeff}`)

    /*let files = await this.rdf.query( inbox, `SELECT ?url ?size ?mtime WHERE {
    <> ldp:contains ?url.
    ?url stat:size ?size.
    ?url stat:mtime ?mtime.
  }
  ORDER BY DESC(?mtime)
  LIMIT 2
  `)*/

  let files = await this.rdf.query( inbox, `SELECT ?url WHERE {
    <> ldp:contains ?url.
  }
  LIMIT 2
  `)

  console.log(files.length)
  for(var f of files){ console.log(f.url) }


}

}

customElements.define('test-rdfeasy-element', TestRdfeasyElement);
