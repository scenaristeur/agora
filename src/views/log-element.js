import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class LogElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "Log"
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    /* The snackbar - position it at the bottom and in the middle of the screen */
    #snackbar {
      visibility: hidden; /* Hidden by default. Visible on click */
      min-width: 250px; /* Set a default minimum width */
      margin-left: -125px; /* Divide value of min-width by 2 */
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      text-align: center; /* Centered text */
      border-radius: 2px; /* Rounded borders */
      padding: 16px; /* Padding */
      position: fixed; /* Sit on top of the screen */
      z-index: 1; /* Add a z-index if needed */
      left: 50%; /* Center the snackbar */
      bottom: 30px; /* 30px from the bottom */
    }

    /* Show the snackbar when clicking on a button (class added with JavaScript) */
    #snackbar.show {
      visibility: visible; /* Show the snackbar */
      /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
      However, delay the fade out process for 2.5 seconds */
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }

    @keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }

    @-webkit-keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }

    @keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }
    </style>
    <!--  <style>
    .myAlert-top{
    position: fixed;
    top: 5px;
    left:2%;
    width: 96%;
  }

  .myAlert-bottom{
  position: fixed;
  bottom: 5px;
  left:2%;
  width: 96%;
}

div.fullscreen {
position: absolute;
width:100%;
height:960px;
top: 0;
left: 0;
background-color: lightblue;
}

.alert{
display: none;
}
</style>
-->

<div class="container-fluid">
Hello <b>${this.name}</b> from app-element

<!-- Use a button to open the snackbar -->
<button @click="${this.myFunction}">Show Snackbar</button>

<!-- The actual snackbar -->
<!--<div id="snackbar">Some text some message..</div>-->




<div class="toast" id="snackbar" role="alert" aria-live="assertive" aria-atomic="true">
<div class="toast-header">
<img src="..." class="rounded mr-2" alt="...">
<strong class="mr-auto">Bootstrap</strong>
<small>11 mins ago</small>
<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="toast-body">
Hello, world! This is a toast message. Hello, world! This is a toast message. Hello, world! This is a toast message. Hello, world! This is a toast message.
</div>
</div>

<!--<div class="fullscreen">
<div class="col-sm-6">
<button class="form-control" @click="${this.myAlertTop}">show alert top</button>
</div>
<div class="col-sm-6">
<button class="form-control" @click="${this.myAlertBottom}">show alert bottom</button>
</div>
</div>
<div id="top" class="myAlert-top alert alert-success">
<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
<strong>Success!</strong> Indicates a successful or positive action.
</div>
<div id="bottom" class="myAlert-bottom alert alert-danger">
<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
<strong>Danger!</strong> This alert box could indicate a dangerous or potentially negative action.
</div>-->
<!--
<paper-toast text="Hello Take your <a href='#t'>POD</a> and look at help!" opened> Boo</paper-toast>-->
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

myFunction() {
  // Get the snackbar DIV
  var x = this.shadowRoot.getElementById("snackbar");
  console.log("X",x)
  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

}

customElements.define('log-element', LogElement);
