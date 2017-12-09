---
layout: full-page
title: Texas Land Area Comparator map
hidden: true
custom_css:
- texas-land-area-comparator
custom_js:
- d3.min
- queue.v1.min
- topojson.min
- turf.mini
- d3.geo.projection.v0.min
- texas-land-area-comparator
---
Scale:  <select id="scaler"><option selected="selected" value="large">Large (Fastest)</option><option value="medium">Medium</option><option value="small">Small (Slowest)</option></select>  Projection:  <select id="proj"><option value="0">Equal Area</option><option value="1">Mercator</option><option value="2">Orthographic</option><option value="3">Gnomonic</option><option value="4">Aitoff</option></select>

<div style="text-align: center;"><div class="loading"><h2>Loading map...</h2></div></div>
