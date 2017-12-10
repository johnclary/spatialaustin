---
layout: post
title: Property Values, Affordability, and the Promise of Appraisal Data
thumb: atx-land-value-thumb.png
permalink: atx-land-value
description: Interactive map of Austin land value and affordability change over time.
---
Rising property values translate to higher property taxes and rents, so it's important to understand where and by how much property values are changing if we want to understand where Austin's household "<a href="https://www.google.com/search?q=austin+%22affordability+crisis%22&ie=utf-8&oe=utf-8" target="_blank">affordability crisis</a>" is having most severe impact.

To that end, I've spent a few months trying to answer what I thought was a simple question: Where have Austin's residential property values increased the most? For all the talk about affordability in Austin, it can be surprisingly difficult to make sense of--or even access--Austin's property appraisal data.

More about that in minute. First, the map. What we have here is the estimated change in residential land values from the year 2005 to 2015, adjusted for inflation: 

<a href="/maps/atx-land-value-map/" target="_blank">Click here for full screen</a>


<iframe src="/maps/atx-land-value-map" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" height="500" width="100%"></iframe>

The map is based on data from the Travis County Appraisal District (TCAD), the entity responsible for appraising most of Austin's property values (Williamson and Hays counties contain fractions of the city).

In terms of publicly-available real estate data, appraisal district data is without question the most granular and extensive. The agency maintains annually-updated, parcel-level data of the appraised value of land and buildings of every property in the county. TCAD also keeps records of the age and type of buildings on a property, as well as any tax exemptions granted.

Unfortunately, TCAD datasets are costly and difficult to access. A single tax year of TCAD data will set you back $55, the GIS shapefile costs an additional $25, and you'll need Microsoft Access to unpack the files. Cost and format are real barriers to using this data, and the generous folks at [Open Austin](http://open-austin.org/) are looking into potentially hosting the TCAD datasets on their [data portal](http://data.open-austin.org/)

To make the map, I calculated the difference in appraised value from 2005 – 2015 for roughly 150,000 residential properties across Austin, and then created a continuous surface of estimated land value change through a process called [inverse distance weighting](https://docs.qgis.org/2.2/en/docs/gentle_gis_introduction/spatial_analysis_interpolation.html#inverse-distance-weighted-idw) (IDW). Interpolating data in this way is not an exact science; outliers and areas with a low density of sampling points lower the quality of the estimates. I've done my best to account for both of these conditions, and think that the readability of the isoline map is worth a tradeoff in precision.

While it’s no revelation that property values east of I-35 have increased more dramatically than anywhere else in the city, the map enables us to see just how extreme those changes have been over the last decade. With our TCAD data in hand, I see this map as a starting point for digging into some of the interesting questions we can ask about the relationship between the Austin real estate market, our tax system, and ongoing affordability issues. I’m especially keen to explore how increasing property values are translating to changes in rents, which do not have protections like [homestead exemptions](http://www.austinmonitor.com/stories/2015/06/council-adopts-six-percent-homestead-exemption/) to mitigate rising costs. More on that to come. As usual, your feedback is welcome.

Special thanks to [@McCnnll](https://twitter.com/McCnnll), [@sharlalikesyou](https://twitter.com/sharlalikesyou), and [@openaustin](https://twitter.com/openaustin) for their feedback at the Gov and Civic Hack Meetup.

*Sources: [TCAD](http://www.traviscad.org/property_search.html), [Leaflet](http://leafletjs.com/)*
