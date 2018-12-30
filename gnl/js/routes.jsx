import React from 'react';
// import App from './app';
import Selection from './selection';
import Label from './label';
// import Redirection from './redirection';
// import { Router, Route, browserHistory, IndexRoute } from 'react-router-3';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
export const history = createHistory();

// function hashLinkScroll() {
//   const { hash } = window.location;
//   if (hash !== '') {
//     // Push onto callback queue so it runs after the DOM is updated,
//     // this is required when navigating from a different page so that
//     // the element is rendered on the page before trying to getElementById.
//     setTimeout(() => {
//       const id = hash.replace('#', '');
//       const element = document.getElementById(id);
//       if (element) element.scrollIntoView();
//     }, 0);
//   }
// }

const routes = () => (
  <Router history={history}>
     <Switch>
       <Route path='/selection' component = { Selection } />
       <Route path = '/label' component = { Label } />
     </Switch>
  </Router>

);
// <Route path = '/redirection' component = { Redirection } />
export default routes;
