let width = 900;
let height = 600;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid black")
  .style("scale", "0.8");

let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const g = svg.append("g");

(async function () {
  let topology = await d3.json(
    "https://raw.githubusercontent.com/cszang/dendrobox/master/data/world-110m2.json"
  );
  let tsunami = await d3.csv("data/tsunami_dataset.csv");

  const projection = d3
    .geoMercator()
    .scale(125)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  g.selectAll("path")
    .data(topojson.feature(topology, topology.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#2f3640")
    .attr("stroke", "#fff");

  g.selectAll("circle")
    .data(tsunami)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return projection([d.LONGITUDE, d.LATITUDE])[0];
    })
    .attr("cy", function (d) {
      return projection([d.LONGITUDE, d.LATITUDE])[1];
    })
    .attr("r", 2)
    .attr("fill", function (d) {
      switch (d.DEATHS_TOTAL_DESCRIPTION) {
        case "Few (~1 to 50 people)":
          return "green";
        case "Many (~101 to 1000 people)":
          return "orange";
        case "Very Many (~1001 or more people)":
          return "red";
        default:
          return "none";
      }
    })
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.DEATHS_TOTAL_DESCRIPTION || "None")
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("background-color", "black");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(200).style("opacity", 0);
    });
})();

let zoom = d3
  .zoom()
  .scaleExtent([1, 8])
  .on("zoom", function (event) {
    g.selectAll("path").attr("transform", event.transform);
    g.selectAll("circle").attr("transform", event.transform);
  });

svg.call(zoom);
