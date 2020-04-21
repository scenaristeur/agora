// redimensionner l'image avant envoi http://tech.novapost.fr/redimensionner-une-image-cote-client-avant-lupload.html

import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class MediaElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      count: {type: Number},
      extension: {type: String},
      filename: {type: String},
      info: {type: String},
      folders: {type: Array}
    };
  }

  constructor() {
    super();
    this.info = ""
    this.folders = ["public/spoggy/","public/spoggy/Activity/","public/spoggy/Image/","public/spoggy/Video/","public/spoggy/Audio/","public/spoggy/Document/"]
    this.filename = ""
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    i {
      padding: 10px
    }
    </style>
    <!--  list : ${this.notesListUrl} -->
    <div class="row">
    <form>
    <div class="custom-file">
    <input type="file"
    class="custom-file-input"
    @change="${this.createTemp}"
    id="mediaFile"
    accept="image/*;video/*;audio/*"
    lang="${this.lang}">
    <label class="custom-file-label"
    for="mediaFile">
    <i class="fas fa-camera-retro"></i>
    <i class="fas fa-video"></i>
    <i class="fas fa-microphone"></i>
    </label>
    </div>
    </form>
    </div>

    ${this.filename.length > 0 ?
      html`
      <div class="row">
      <label class="sr-only" for="filename">Filename</label>
      <div class="input-group mb-2">
      <input id="filename" class="form-control" type="text" value="${this.filename}" @change="${this.filenameChange}" placeholder="Filename">
      <div class="input-group-append">
      <div class="input-group-text">${this.extension}</div>
      </div>
      </div>
      </div>


      `
      :html `
      `}

      <div class="col-auto"><canvas style="max-width: 100%; height: auto;" id="canvas"/></div>

      `;
    }

    createTemp(e) {
      this.file = e.target.files[0];
      this.filename = this.file.name.substring(0,this.file.name.lastIndexOf("."));
      this.extension = this.file.name.substring(this.file.name.lastIndexOf("."));

      var canvas =   this.shadowRoot.getElementById('canvas')
      var ctx = canvas.getContext('2d');
      var cw = canvas.width;
      var ch = canvas.height;
      var maxW=cw;
      var maxH=ch;

      var image = new Image;
      image.onload = function() {
        var iw=image.width;
        var ih=image.height;
        var scale=Math.min((maxW/iw),(maxH/ih));
        var iwScaled=iw*scale;
        var ihScaled=ih*scale;
        canvas.width=iwScaled;
        canvas.height=ihScaled;
        ctx.drawImage(image,0,0,iwScaled,ihScaled);
        //  ctx.drawImage(image, 0,0);
        //  alert('the image is drawn');
      }
      image.src = URL.createObjectURL(this.file);

      /*
      canvas.width = this.file.width;
      canvas.height = this.file.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      // Other browsers will fall back to image/png
      img.src = canvas.toDataURL('image/webp');*/

    }




    firstUpdated(){
      var app = this;
      this.agent = new HelloAgent(this.name);
      this.agent.receive = function(from, message) {
        if (message.hasOwnProperty("action")){
          switch(message.action) {
            case "askContent":
            app.askContent(from, message);
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    askContent(from, message){
      var app = this
      console.log(from,message)

      this.classe = "Document"
      if (this.file != undefined){
        var type = this.file.type
        switch (type) {
          case (type.match(/^image/) || {}).input:
          this.classe = "Image"
          break;
          case (type.match(/^video/) || {}).input:
          this.classe = "Video"
          break;
          case (type.match(/^audio/) || {}).input:
          this.classe = "Audio"
          break;
          default:
          this.classe = "Document"
          break;
        }
      }


      var rep = {
        action: "reponseContent",
        content: this.file,
        id: message.id,
        type: this.classe
      }
      if (this.filename.length > 0){
        rep.newFilename = this.filename.replace(/ /g,"_")+this.extension
      }
      this.agent.send(from, rep)
      this.filename = ""
    }

    filenameChange(){
      var filename = this.shadowRoot.getElementById("filename").value
      if (filename.length == 0){
        alert("Filename must not be blank")
        this.shadowRoot.getElementById("filename").value = this.filename
      }else{
        this.filename = filename
      }
    }


  }

  customElements.define('media-element', MediaElement);
