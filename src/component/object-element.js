import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";

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
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container">
    Name : ${this.object.name}<br>
    Content: ${this.object.content}<br>
    <button class="btn btn-outline-primary"  @click="${this.replyTo}">Reply</button>
    <br>
    <button class="btn btn-outline-primary"><i class="fas fa-share-alt" @click="${this.share}"></i></button>
    </div>
    `;
  }

  replyTo(){
    console.log(this.url)
    this.agent.send("Post", {action: "toggleWrite"})
    this.agent.send("PostTabs", {action:"setReplyTo", replyTo: this.url })
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
    this.object.name = await data[this.url].as$name
    this.object.content = await data[this.url].as$content
    this.requestUpdate()
  }

  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }


  share(){
    console.log("share")
    if (navigator.share) {
      alert("share")
      navigator.share({
        title: this.object.name,
        text: this.object.content,
        url: 'https://scenaristeur.github.io/agora?object='+this.url,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }else{
      alert("not share")
      var to = '';
      var sub = "Agora : "+this.object.name;
      var body = 'I want to share this link with you :   \n https://scenaristeur.github.io/agora?object='+this.url+'  \n \n '+this.object.content+' \n \n';

      var mailarr = [];

      if(sub!=""){
        sub = "subject="+encodeURIComponent(sub);
        mailarr.push(sub);
      }
      if(body!=""){
        body = "body="+encodeURIComponent(body);
        mailarr.push(body);
      }

      var mailstr = mailarr.join("&");
      if(mailstr!="") { mailstr = "?"+mailstr; }

      window.open("mailto:"+to+mailstr);





    }
  }

}

customElements.define('object-element', ObjectElement);
