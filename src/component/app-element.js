import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

import './login-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      share: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "App"
    this.share = {}
    this.onLoad()
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="container fluid">

    <login-element name="Login">Loading</login-element>
    ${this.share.show == true ? html`
      Title : ${this.share.title}<br>
      Text : ${this.share.text}<br>
      Url : ${this.share.url}<br>

      <label class="sr-only" for="title">Title</label>
      <div class="input-group mb-2">

      <input id="title" class="form-control" type="text" value="${this.share.title}" placeholder="Title">

      </div>

      <textarea class="form-control"
       id="notearea"
        style="width:100%;height:38vh"
         placeholder="Write a note on your Pod & share it on Agora">
Text : ${this.share.text}

Url : ${this.share.url}
</textarea>


      `
      :html`
      no share
      `}
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

    }

    onLoad() {
      var parsedUrl = new URL(window.location.toString());
      console.log(parsedUrl)
      this.share.title = parsedUrl.searchParams.get("title") || ""
      this.share.text = parsedUrl.searchParams.get("text") || ""
      this.share.url = parsedUrl.searchParams.get("url") || ""
      this.share.title.length + this.share.text.length + this.share.url.length > 0 ? this.share.show = true : this.share.length = false;
      console.log(this.share)
      /*  logText("Title shared: " + parsedUrl.searchParams.get("title"));
      logText("Text shared: " + parsedUrl.searchParams.get("text"));
      logText("URL shared: " + parsedUrl.searchParams.get("url"));*/
      // We still have the old "url_template" member in the manifest, which is
      // how WST was previously specced and implemented in Chrome. If the user
      // agent uses that method, the "oldapi" parameter will be set.
      if (parsedUrl.searchParams.get("oldapi")) {
        alert("Your browser is using the deprecated 'url_template' Web Share "
        + "Target API.");
      }
    }


  }

  customElements.define('app-element', AppElement);
