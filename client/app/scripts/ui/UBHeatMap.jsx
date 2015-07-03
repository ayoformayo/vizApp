var Router = require('react-router');
var d3 = require('d3');
var topojson = require('topojson');

var UBHeatMap = React.createClass({
  mixins: [ Router.Navigation, Router.State ],

  getInitialState() {
    var slug = this.getParams().slug;
    return { slug: slug };
  },

  componentDidMount(){
    var height = $('section').height(),
    width = $('section').width();

    var svg = d3.select('.heat-map-container')
              .append('svg')
              .attr('height', height)
              .attr('width', width);
              console.log(2000/height)

    var projection = d3.geo.albersUsa()
        .scale(height * 1.5)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);
    d3.xhr('http://localhost:3000/maps/ub_heat_map.json', (err, success) => {
      var usBoundaries = JSON.parse(success.response);
      var subunits = topojson.feature(usBoundaries, usBoundaries.objects.units);
      var destination_count = usBoundaries.destination_count;
      var current_count = usBoundaries.current_count;
      var office_count = usBoundaries.office_count;
      console.log([destination_count.max.val, destination_count.min.val])
          // console(blah(÷200))
          // console(blah)
      var ramp=d3.scale.linear();
      ramp.domain([destination_count.max.val,destination_count.min.val]).range(["red","blue"]);
          


      var svgEnter = svg.selectAll('.states')
        .data(subunits.features)
        .enter();
      var statePath = svgEnter.append('path')
        .attr('class', (d) => { console.log(d); return 'us-state ' + d.id })
        .style("fill", (d) => { 
          var val = destination_count[d.properties.name] ? destination_count[d.properties.name] : 0
        //   console.log(color); 
        //   console(color(val))
          return ramp(val);})
        .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a !== b ; }))
          .attr("d", path)
          .attr("class", "us_subunit-boundary");
      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a === b; }))
          .attr("d", path)
          .attr("class", "my_subunit-boundary");
      var address_types = [
        { name: 'Office', rel_data: office_count },
        { name: 'Destination', rel_data: destination_count},
        { name: 'Current', rel_data: current_count}
      ]
      var yScale = d3.scale.linear()
          .domain([0, address_types.length])
          .range([0, height/2]);



      var gEnter = svg.selectAll("g")
        .data(address_types)
        .enter().append("g");

      // gEnter..attr('x', (d) => { return 20; })
      //           .attr('y', (d, i) => { return yScale(i) + height/3; })

      // gEnter.append("rect")
      //             .attr("width", 100)
      //             .attr("height", 90)
      //             .attr('x', (d) => { return 20; })
      //             .attr('y', (d, i) => { return yScale(i) + height/3; });

      // gEnter.append("text")
      //     .attr("x", function(d) { return x(d) - 3; })
      //     .attr("y", barHeight / 2)
      //     .attr("dy", ".35em")
      //     .text(function(d) { return d; });

      // var rectEnter = svg.selectAll('rect')
      //   .data(address_types)
      //   .enter();



      var optionText = gEnter.append('text')
      optionText.on('click', (datum,i) => {
        statePath.transition().style("fill", (d) => {
          ramp.domain([datum.rel_data.max.val, datum.rel_data.min.val]);
          val = datum.rel_data[d.properties.name] ? datum.rel_data[d.properties.name] : 0;

          return ramp(val);
        })
      })
      optionText.text((d) => { return d.name;})
                .attr('x', (d) => { return 20; })
                .attr('y', (d, i) => { return yScale(i) + height/3; })
    });
  },


  render(){
    return (
      <div className="heat-map-container default-svg-container" ref="container" />
    )
  }
});

module.exports = UBHeatMap;
