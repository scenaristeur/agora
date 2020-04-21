import { LitElement } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

export class BaseView extends LitElement {
  createRenderRoot() {
    return this;
  }

  firstUpdated(){
    console.log(this.name)
    if (this.name != null){
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
            case "test":
            app.test(message)
            break;
            case "pageChanged":
            app.pageChanged(message.page)
            break;
            case "panelChanged":
            app.panelChanged(message.panel)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }
    return this;
  }

  webIdChanged(webId){
    console.log("WIC",this.name,webId)
    this.webId = webId
  }
  pageChanged(page){
    page == "default" ? this.page = "flux" : this.page = page
  }

  test(message){
    console.log(this.name," received ",message)
  }

  click(e){
    console.log(e)
  }
}
