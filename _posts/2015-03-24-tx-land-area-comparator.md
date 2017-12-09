---
layout: post
title: The Texas Land Area Comparator
thumb: tx-comparator-thumb.PNG
description: Interactive map that uses D3.js and turf.js and topojson and geojson and dynamic map projections to compare the size of Texas to other countries.
redirect_from:
 - /texas-land-area-comparator/
---

<iframe src="http://spatialaustin.github.io/maps/texas-land-area-comparator-map" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" height="720" width="100%"></iframe>

 If you’ve spent much time in Texas, you have inevitably been exposed to any number of platitudes which extol the state’s immense size. You may even be capable of producing, extempore, a viable estimate of the number of Rhode Islands that could fit inside the state (221), or where Texas would rank in area among other nations if she were not relegated to federated statehood (40th).

But these factoids don’t do enough to help us appreciate the vastness of 270,000 square miles of planet Earth! Apart from driving Brownsville to Amarillo, there has to be a better way.

Hence, I present the Texas Land Area Comparator. Go ahead; give it a try. If you’re anything like me, you’ll pan right over to the northeastern US and watch Texas effortlessly engulf the entirety of New England.

Map nerds will appreciate that this map continuously re-projects the countries as the map is dragged. This reduces distortion–e.g., [Greenland doesn’t look as big as Africa](http://utpjournals.metapress.com/content/p5417307377w3q0v/)–but comes at the cost of your web browser doing a lot of math on the fly, so interaction gets choppy at smaller scales.

As usual, most of the credit is owed to D3’s incredible developer community, particularly [Bostock](http://mbostock.github.io/d3/talk/20111018/azimuthal.html), [Davies](https://github.com/jasondavies) and [Czaplewski](https://gist.github.com/jczaplew/6457917). I’m also trying out [Turf.js](http://turfjs.org/) for the first time; it’s really very awesome.

Enjoy!
