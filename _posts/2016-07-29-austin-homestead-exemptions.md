---
layout: post
title: 'District by District: Homestead Exemptions'
thumb: atx-hs-exempt-thumb.png
hidden: false    
description: Crunching the numbers on Austin's homestead exemptions
custom_js:
- leaflet
- atx-hs-chart

custom_css:
- hs-exempt
---

Homestead exemptions, which limit the taxable value of a homeowner's property, are the stuff of controversy in Austin. On the one hand, raising the homestead exemption reduces funds for city services to the benefit of homeowners. But if you own a home in Austin, you're no doubt feeling the squeeze of Austin's [dramatically increasing land values](/atx-land-value).

Last month, Austin City Council voted to increase the property tax homestead exemption from 6% to 8%. There's been [plenty](www.austinchronicle.com/news/2016-07-08/council-no-marxism-around-here/) of [reporting](http://www.austinmonitor.com/stories/2016/06/slim-margin-council-members-approve-8-percent-homestead-exemption/) on the topic, but we keep seeing the same handful of statistics in nearly every article. (Probably because the gatekeeper of Austin's property tax data does a [miserable job of making it publicly available](http://www.traviscad.org/faq_request_info.html)).

I've been wondering how the number of homestead exemptions and property values compare across Austin's council districts, so I created this handy chart. You can hover/touch each bar to view its datapoint.

<div id='selectors'></div>

<div id='container'></div>

<div id='map-container'></div>

<script src="https://d3js.org/d3.v4.min.js"></script>


<em><small>Homestead exemptions by council district in Austin, TX. Source: [TCAD](http://www.traviscad.org/) <small><em>

The chart highlights the differences in neighborhood composition across districts.  For example, District 8 has roughly three times as many homesteads as Districts 3, 4, and 6. We can also look at the percentage of homes with exemptions to get a sense of owner occupancy rates in each district. Here, Districts 6, 8, and 10 jump out as each having more than 80% of homes with exemptions. 

It's also worth noting that while District 1 has a relatively large number of homesteads (12,000), the percentage of homesteads (68%) is on the low end. District 1 probably has the largest number of single-family home renters in the city.

[The mayor has argued](http://www.mayoradler.com/who-benefits-mostly-from-upping-the-homestead-exemption/)  that homestead exemptions are progressive, because "cutting [property] taxes by a set percentage benefits homeowners more the lower they fall on the income scale." I don't disagree, but this chart emphasizes just how small those savings are—as low as $13/year on average for a District 2 resident. Bear in mind, of course, that this is the second increase in the homestead exemption [in two years](http://www.mystatesman.com/news/news/local/austin-city-council-approves-6-percent-homestead-e/nmWnx/), and it [probably won't be the last](http://www.adlerforaustin.com/affordable-new-way-forward/#tax).

As usual, a few caveats. The data we're looking at includes only single-family dwellings in Travis County. Median home values are based on the appraised value of each property, while the average annual savings is based on the assessed value. [Here's my data (6MB)](/public/data/austin_parcels_hs_values.csv).

Interested in helping make property tax data more open and transparent? [Join us!](https://github.com/open-austin/liberate-appraisal-data)

*Source: Travsi County Appraisal District*
