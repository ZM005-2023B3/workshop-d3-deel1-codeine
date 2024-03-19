let width = 900;
let height = 600;

const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style("border", "1px solid black")
    .style("scale", "0.8");

let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const g = svg.append('g');


(async function() {

    let topology = await d3.json("https://raw.githubusercontent.com/cszang/dendrobox/master/data/world-110m2.json");
    let tsunami = await d3.csv("data/tsunami_dataset.csv");

    console.log(topology);
    console.log(tsunami);

    // your code here

})();


let zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function(event) {
          g.selectAll('path')
           .attr('transform', event.transform);
          g.selectAll("circle")
           .attr('transform', event.transform);
});

svg.call(zoom);


