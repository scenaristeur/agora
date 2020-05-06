import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)

class ObjectElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url: {type: String},
      object: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Object"
    this.url = ""
    this.object = {}
  }

  render(){


    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    #content{ font-size:14px; color:#989898; margin:auto}
    </style>

    ${this.object.ext == "jpg" ?
    html`<img src="${this.url}" style='height: auto; width: 75%; max-width: 300px; object-fit: contain' alt="${this.url}"/>`
    :html` ` }
    <div id="content">${this.object.content}</div>

    `;
  }


  linkify(inputText) {
    // <!--    ${this.linkify(`${this.object.content}`)}-->
    //console.log(inputText)
    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = inputText.replace(replacePattern1, ' <small><a href="$1" target="_blank">$1</a></small> ');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var replacedText = replacedText.replace(replacePattern2, ' <small>$1<a href="http://$2" target="_blank">$2</a></small> ');

    //Change email addresses to mailto:: links
    var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    this.shadowRoot.getElementById("content").innerHTML = replacedText
    this.requestUpdate()
    //    return html`${replacedText}`
  }




  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    //  console.log(this.agent)
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

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //  console.log(`${propName} changed. oldValue: ${oldValue}`);
      if (`${propName}` == "url" && this.url != "undefined"){
        this.init()
      }
    });
  }

  async init(){
    //console.log(this.url)
    this.object.ext = this.url.substr(this.url.lastIndexOf('.') + 1);

    if (this.object.ext == "ttl#this"){
      let as = "https://www.w3.org/ns/activitystreams#"
      //  this.object.name = await solid.data[this.url].as$name
      let type = await solid.data[this.url].as$type
      this.object.type = `${type}`
      switch (this.localName(`${type}`)) {
        case "Triple":
        this.object.content= "" //"[todo parse triples like "+ this.url+"</small>]"
        this.requestUpdate()
        break;
        case "Note":
        default:
        this.object.content = await solid.data[this.url].as$content
        this.linkify(`${this.object.content}`)
      }
    }else{
      //  console.log(this.object.ext,this.url)
      this.requestUpdate()
    }

  }

  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }


}

customElements.define('object-element', ObjectElement);
