var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
global.React = require('react/addons');
global._ = require('underscore');
global.$ = global.jQuery = require('jquery');
global.Router = require('react-router');
global.Reflux = require('reflux');
global.mui = require('material-ui');
global.d3 = require('d3');


var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var LiquorMap = require("./ui/liquor_maps.jsx"),
    Sankey = require("./ui/sankey.jsx"),
    mountNode = document.getElementById("app"),
    DefaultLayout = require("./ui/layout.jsx")

var RouteHandler = Router.RouteHandler;

var Handler = React.createClass({
  render () {
    return (
      <RouteHandler/>
    )
  }
});
var routes = (
  <Route handler={DefaultLayout}>
    <Route path="liquor_map" handler={LiquorMap}/>
    <Route path="sankey" handler={Sankey}/>
    <Route path="/" handler={LiquorMap}/>
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.getElementById("app"));
});

