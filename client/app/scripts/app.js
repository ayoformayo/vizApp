global.React = require('react/addons');
global._ = require('underscore');
global.$ = global.jQuery = require('jquery');
global.Router = require('react-router');
global.Reflux = require('reflux');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var LiquorMap = require("./ui/liquor_maps.jsx"),
    mountNode = document.getElementById("app");
var Nav = require('react-bootstrap/lib/Nav');
var Navbar = require('react-bootstrap/lib/Navbar');
var NavItem = require('react-bootstrap/lib/NavItem');

var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Button = require('react-bootstrap').Button;
var Route = Router.Route;

var RouteHandler = Router.RouteHandler;

var Handler = React.createClass({
  render () {
    return (
      <div>
        <Nav>
        <NavItem></NavItem
        </Nav>
        <RouteHandler/>
      </div>
    )
  }
});
var routes = (
  <Route handler={Handler}>
    <Route path="liquor_map" handler={LiquorMap}/>
    <Route path="/" handler={LiquorMap}/>
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById("app"));
});

