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
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="row">
    <b>${this.object.name}</b>
    </div>
    <div class="row mt-2" id="content">
    <!--  SEE LINKIFY-->
    ${this.object.content}
    </div>
    <div class="row mt-2">
    <button class="btn btn-outline-info btn-sm"  @click="${this.replyTo}">Reply</button>
    <button class="btn btn-outline-info btn-sm"><i class="fas fa-share-alt" @click="${this.share}"></i></button>
    <button class="btn btn-outline-info btn-sm"><i class="far fa-thumbs-up" @click="${this.like}"></i></button>
    <button class="btn btn-outline-info btn-sm"><i class="far fa-thumbs-down" @click="${this.dislike}"></i></button>
    </div>
    `;
  }

  like(){
    alert("// TODO: come back later ;-) ")
  }
  dislike(){
    alert("// TODO: come back later ;-) ")
  }



  linkify(inputText) {
    // <!--    ${this.linkify(`${this.object.content}`)}-->
    console.log(inputText)
    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = inputText.replace(replacePattern1, '<br><small><a href="$1" target="_blank">$1</a></small><br>');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var replacedText = replacedText.replace(replacePattern2, '<br><small>$1<a href="http://$2" target="_blank">$2</a></small><br>');

    //Change email addresses to mailto:: links
    var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    this.shadowRoot.innerHTML = replacedText
    this.requestUpdate()
    //    return html`${replacedText}`
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
    ///  this.linkify(`${this.object.content}`)
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
    this.object.name = await solid.data[this.url].as$name
    this.object.content = await solid.data[this.url].as$content
    this.requestUpdate()
  }

  localName(strPromise){
    let str = `${strPromise}`
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }


  share(){
    if (navigator.share) {
      navigator.share({
        title: "Take a look at that Agora Spog : "+this.object.name+"\n\n",
        text: this.object.content+"\n\n",
        url: 'https://scenaristeur.github.io/agora?object='+this.url+'\n\n',
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }else{
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
