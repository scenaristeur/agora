import './styles.css';
import './views/todo-view.js';


// ROUTER
import { Router } from '@vaadin/router';

window.addEventListener('load', () => {
  initRouter();
});

function initRouter() {
  let router;
  if (window.location.host == "localhost:9000"){
    router = new Router(document.querySelector('main'));
  }else{
    router = new Router(document.querySelector('main'),{baseUrl: '/agora/'});
  }


  console.log("ROUTER",router)
  router.setRoutes([
    {
      path: '/',
      component: 'todo-view'
    },
    {
      path: '/stats',
      component: 'stats-view',
      action: () =>
      import(/* webpackChunkName: "stats" */ './views/stats-view') //
    },
    {
      path: '(.*)',
      component: 'not-found-view',
      action: () =>
      import(/* webpackChunkName: "not-found-view" */ './views/not-found-view')
    }
  ]);
}
