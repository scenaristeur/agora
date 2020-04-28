import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
//let data = solid.data
//console.log("LDFK+LEX",data)
//import './object-element.js'


class ActivityElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      url: {type: String},
      activity: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Activity"
    this.url = ""
    this.activity = {objects:[]}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="row" id="${this.url}">
    <p class="lead">
    ${this.activity.summary}
    </p>
    </div>

    ${this.activity.objects.map(object =>html`
      <object-element name="${this.name+'_object'}"
      url="${object}">
      Loading object
      </object-element>
      `)}

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
      console.log(this.url)
      let conf = JSON.parse(localStorage.getItem("agora")).config
      console.log(conf.liked)
    }
    dislike(){
      alert("// TODO: come back later ;-) ")
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
      //  this.init()

    }


    share(){
      if (navigator.share) {
        navigator.share({
          title: "Take a look at that Agora Spog :\n\n",
          text: this.activity.summary+"\n\n",
          url: 'https://scenaristeur.github.io/agora?activity='+this.url+'\n\n',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
      }else{
        var to = '';
        var sub = "Agora : "+this.activity.summary;
        var body = 'I want to share this link with you :   \n https://scenaristeur.github.io/agora?activity='+this.url+'  \n \n ';
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


    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        //  console.log(`${propName} changed. oldValue: ${oldValue}`);
        if (`${propName}` == "url" && this.url != "undefined" && this.url != null){
          this.init()
        }
      });
    }

    async init(){
      //console.log(this.url)
      this.activity.target = await solid.data[this.url].as$target
      this.activity.summary = await solid.data[this.url].as$summary
      let objects = []
      for await (const object of solid.data[this.url].as$object){
        objects = [...objects, `${object}`]
      }
      //      console.log("OBJECTS",objects)
      this.activity.objects = objects // = await solid.data[this.url].as$object
      this.requestUpdate()
    }

    localName(strPromise){
      let str = `${strPromise}`
      var ln = str.substring(str.lastIndexOf('#')+1);
      ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
      return ln
    }

    replyTo(){
      console.log(this.url)
      this.agent.send("App", {action: "showPanel", panel: "Compose"})
      this.agent.send("Post", {action: "toggleWrite"})
      this.agent.send("PostTabs", {action:"setReplyTo", replyTo: this.url })
    }

  }

  customElements.define('activity-element', ActivityElement);
