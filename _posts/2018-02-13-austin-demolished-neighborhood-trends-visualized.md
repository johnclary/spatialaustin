---
layout: post
title: 'Austin Demolished: Visualizing Neighborhood Trends, 2000-2017'
thumb: atx-demo-tracts.png
description: Visualizing housing demolition data at the neighborhood level using census data and City of Austin permit data.
---

<div class="post-img">
    <blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/FrontYardParking?src=hash&amp;ref_src=twsrc%5Etfw">#FrontYardParking</a> <a href="https://twitter.com/hashtag/EastAustin?src=hash&amp;ref_src=twsrc%5Etfw">#EastAustin</a> <a href="https://twitter.com/hashtag/AustinDemolished?src=hash&amp;ref_src=twsrc%5Etfw">#AustinDemolished</a> <a href="https://t.co/gMsJfMrIcM">pic.twitter.com/gMsJfMrIcM</a></p>&mdash; S P A T I A L AUSTIN (@spatialaustin) <a href="https://twitter.com/spatialaustin/status/745233659305697282?ref_src=twsrc%5Etfw">June 21, 2016</a></blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>   
</div>

Housing demolitions are a ubiquitous reminder of Austin's dramatic pace of change. Stroll through any of Austin's older neighborhoods and you'll undoubtedly come across homes in varying states of demolition and re-construction. In certain neighborhoods, entire blocks have been razed and rebuilt (drop a pin at random in [Chestnut](https://www.google.com/maps/place/Chestnut,+Austin,+TX/@30.2783283,-97.7195638,15z/data=!3m1!4b1!4m5!3m4!1s0x8644b5ea0671591d:0xe6300a756e554fe!8m2!3d30.2790657!4d-97.7131577)).   

Whether you accept demolitions as a prerequisite for infill or resent them as a consequence of gentrification, there's no denying that the character of Austin's neighborhoods is being remade before our eyes.

Having considered demolitions across [council districts](/austin-demolished/) and [parcels](/austin-demolished-part-2/), I've been keen to somehow quantify the impacts of the demolition/construction boom at a neighborhood level. The below map attempts to do so by measuring the percentage of housing units demolished within Austin's census tracts. 

<a href="/maps/atx-demo-neighborhood-trends-map">Click here for full screen</a>

<iframe id='idIframe' onload='iframeLoaded()' src="/maps/atx-demo-neighborhood-trends-map" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" width="100%" height="400px"></iframe>

<em><small>Single-Family Housing Demolitions Austin, TX. 2000-2017. Source: [US Census](https://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml); [City of Austin](https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu) <small><em>

The source data here are [ACS 5-year housing estimates](https://www.census.gov/programs-surveys/acs/) for 1-unit and 2-unit structures, referenced against single-family and two-family [demolition permits issued by the City of Austin](https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu) from 2000 through 2017. Clicking on any parcel reveals the year-over-year demolition totals within the tract.

Looking past Onion Creek (which was hit by two 100-year floods in less than two years), the neighborhoods that have seen the greatest percentage of homes demolished are largely in East Austin. The data indicate that nearly 20% of the homes in the Chestnut census tract of have been demolished since the year 2000. Moving further east along MLK, year-over-year trends suggest that demolitions having spiked in recent years, a trend that presumably aligns with [rising land values](http://spatialaustin.com/atx-land-value).

East Austin's demolition rates me be the highest, but similar patterns can be found across the city. Demolitions are clearly on the rise as you move further north or south from the city center, particularly in the cenus tracts south of Oltorf St and North of Koenig Ln.

As usual, a big thanks is owed to the [Leaflet](http://leafletjs.com/) and [D3.js](https://d3js.org/) contributors for making this project possible.





