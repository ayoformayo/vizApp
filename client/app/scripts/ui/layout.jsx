var AppBar = mui.AppBar;
var RaisedButton = mui.RaisedButton;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var Layout = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    console.log(ThemeManager.getCurrentTheme())
    console.log(ThemeManager.getCurrentTheme())
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount() {
    ThemeManager.setTheme(ThemeManager.types.DARK);
  },

  render(){
    var sectionHeight = window.innerHeight - 64 +"px";
    return (
      <div>
        <AppBar showMenuIconButton={false} title="Visuals" style={{position: "fixed"}}/>
        <section style={{height: sectionHeight, position: "relative", top: "64px"}}>
          <Router.RouteHandler {...this.props}/>
        </section>
      </div>
    )
  }
});

module.exports = Layout;
