//https://gist.github.com/ErikHellman/9e17f2ea6a78669294ef2af4bc3f5878
//https://vaadin.com/learn/tutorials/lit-element/lit-element-templating-properties-and-events
import { LitElement, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map'

import  './post-tabs-element.js';

class PostDialogElement extends LitElement {

  constructor () {
    super()
    this.opened = false
  }

  static get properties () {
    return {
      opened: {type: Boolean}
    }
  }

  render () {
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>





    /* The Modal (background) */
    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1050; /* Sit on top */
      padding-top: 100px; /* Location of the box */
      left: -16px;
      top: -16px;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
    /* Modal Content */
    .modal-content {
      background-color: #fefefe;
      margin: auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      min-width: 320px
    }
    .content{
      overflow = 'auto';
      maxHeight = '100px'
    }

    /* The Close Button */
    .close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }

    .opened {
      display: flex;
    }
    .closed {
      display: none;
    }
    .dialog {
      flex-direction: column;
      border: 2px outset black;
      padding: 1em;
      margin: 1em;
    }
    .buttons {
      display: flex;
      flex-direction: row;
    }
    .accept {
      justify-content: space-around;
      align-content: space-around;
    }
    .cancel {
      justify-content: space-around;
      align-content: space-around;
    }

    @media(max-width:767px){
      .dialog {
        padding: 0em;
      }
      .modal-content {
        padding-top: 20px;
        padding-bottom: 20px;
        width: 100%;
      }
    }


    </style>


    <div class="${classMap({dialog: true, opened: this.opened, closed: !this.opened, modal: true})}">
    <div class="modal-content">
    <h6 class="m-0 font-weight-bold text-primary title">New Spog
    <i @click="${() => this.dispatchEvent(new CustomEvent('dialog.cancel'))}" class="close fas fa-window-close"></i>
    </h6>
    <div>
    <post-tabs-element name="PostTabs"></post-tabs-element>
    </div>
    </div>
    </div>`
  }
}

customElements.define('post-dialog-element', PostDialogElement)
