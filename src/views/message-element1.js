import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { message, activity, object } from './util_activity-pub.js'

class MessageElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      uri: {type: String},
      message: {type : Object}
    };
  }

  constructor() {
    super();
    this.name = "Message"
    this.debug = false
    this.uri = ""
    this.message = {link: "LOADING..."}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">


    <div class="container-fluid">
    <div class="row">
    <div class="col-2">
    <div class="row">
    <!--<img class="rounded-circle ml-0" width="32px"
    src="//images.weserv.nl/?url=${this.message.at_photo}&w=32&h=32"
    title="${this.message.at_name}"
    alt="${this.message.at_name}"
    webId="${this.message.attributedTo}"
    @click="${this.showProfile}">-->
    </div>
    <div class="row">
    ${this.message.at_name}
    </div>
    <div class="row">
    ${this.message.delay} <small>${this.message.shortType}</small>
    </div>
    </div>

    <div class="col-8">
    <div class="row">
    <b>${this.message.summary}</b>
    </div>
    <div class="row">
    link : ${this.message.link}

    </div>

    </div>

    </div>
    </div>
    `;
  }
  /*
  <!--  ${this.message.activity.objects.map(object =>html`
  <object-element name="${this.name+'_object'}"
  url="${object}">
  Loading object
  </object-element>

  `)}-->*/

  firstUpdated(){
    this.init()
  }

  async init(){
    let activity = {}
    let objects = []
    let a_uri =  await solid.data[this.uri].as$link
    activity.uri = `${a_uri}`
    for await (const object of solid.data[`${a_uri}`].as$object){
        let obj = {}
      obj.uri = `${object}`
    //  console.log(obj)
   obj.content = await solid.data[obj.uri].as$content
      objects = [...objects, `${object}`]
    }
  console.log(objects)

    //this.message = await message(this.uri)
    //  console.log("Message",this.message)
  }

}

customElements.define('message-element', MessageElement);
