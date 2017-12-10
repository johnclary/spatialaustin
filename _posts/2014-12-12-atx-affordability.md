---
layout: post
title: Affordability in Austin&#58; Mapping Change.
thumb: atx-affordability-thumb.png
description: Interactive map looking at affordability indicators from the US Census to examine how the cost of living in Austin has increased over time.
redirect_from:
 - /?p=186/
 - /p=186/
 - /affordability-in-austin-an-attempt-to-map-change/
---
[Click for full screen map](http://spatialaustin.github.io/maps/atx-affordability-map)

<iframe src="/maps/atx-affordability-map" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" height="600" width="100%"></iframe>

You can’t run for public office in Austin [without talking about affordability](http://www.edscruggsfordistrict8.org/affordability/). More than any other issue, the question of affordability is emblematic of the changes taking place in our city, and residents’ and developers’ divergent visions of how Austin’s precipitous growth should be managed.

Most candidates (with a few [exceptions](http://www.ellenforaustin.com/) ) seem willing to admit that there is no singular policy initiative that can be taken up to address affordability. [Kathy Tovo](http://www.kathieforaustin.com/issues/affordability/) and [Ora Houston](http://www.oraatx.com/issues/) both do a nice job explaining that affordability is a multifaceted issue; to sustainably address Austin’s [growing affordability](http://www.austintexas.gov/sites/default/files/files/NHCD/2014_Comprehensive_Housing_Market_Analysis_-_Document_reduced_for_web.pdf) gap policy makers must not simply consider the rising cost of buying or renting a home, but also wages, access to transportation, and the city’s [history of racial segregation](http://www.vice.com/read/austin-was-built-to-be-segregated) and [environmental injustice](https://soa.utexas.edu/file/city-forum-east-austin-environmental-justice-project-bjorn-sletto).

While most of us are probably capable of making an educated guess as to where Austin's affordability needs are most pressing, I have been curious to see (cartographically, of course) which specific parts of the city have experienced the most dramatic changes in affordability in recent years. As a first step, I’ve cherry-picked three economic indicators that shed light on one piece of the affordability puzzle: median household income, median gross rent, and median home value.

The above map depicts the degree to which each of those indicators changed from the year 2000 to 2012 in Austin census tracts. You can pan/zoom/hover/touch to you heart's content.

I welcome your thoughts and feedback interpreting these maps. I don't know the city well enough to comment on many of the high levels of change that are popping up. One reading of this map is that it's a paint-by-number of East Austin gentrification. The east side has seen some the steepest increases across the board. If we take rising east side incomes to reflect  an influx of high-earning residents into the east side, you can almost see home values and rents paving the way for future gentrification east of Springdale and Airport.

A few caveats. [American Community Survey](http://www.census.gov/acs/www/#) data can be quite noisy at the census tract level. Some of the tracts on the above map have large margins of error, especially in areas with few housing units. I'm willfully ignoring error here (problem = solved!), but you can view this information [in my CSV](http://spatialaustin.com/mapData/2000_2012tractChangeFinal.csv). Another issue is that census tract geometries are subject to change every ten years, so comparing longitudinal census data requires spatial interpolation, [to varying degrees of confidence](http://www.tandfonline.com/doi/abs/10.1080/00330124.2014.905156). Changes to Austin's census tracts since 2000 [have been minor](http://spatialaustin.com/mapData/2000_2012TractAreas.csv), so I don't consider this much of an issue.

*Sources: [US Census](http://www.census.gov/acs/www/#); [D3.js](http://d3js.org/); [Leaflet.js](http://leafletjs.com/); [OpenStreetMap](https://www.openstreetmap.org/); [bost.ocks.org](http://bost.ocks.org/mike/); [Mapshaper](http://mapshaper.org/); [Stamen](http://stamen.com/); [ColorBrewer](http://colorbrewer2.org/)*
