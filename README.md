# marlbor-NO

## Abstract
Teen smoking and tobacco use is a major problem within the United States, and across the world. According to the Centers for Disease Control, "If smoking continues at the current rate among youth in this country, 5.6 million of today’s Americans younger than 18 will die early from a smoking-related illness."

Our project looks at teenage smoking data from a large amount of studies from many different countries, compiled by the World Health Organization. The data provides insight to current cigaratte smoking and current tobacco use, for both males and females, mostly between the ages of 13-15.

## Source Relevance

Data on worldwide smoking rates for youth. Two types of rates are given, one for tobacco use and one for smoking. This data is also given for each gender.

[GHO Youth Smoking Data](http://apps.who.int/gho/data/node.main.TOB1257?lang=en)

This will show off and compare rates of smoking in each country, so people can know which countries have youth at the highest risk of smoking. It will also offer a good visual guide to where people smoke most.

## User Interaction 

The interaction with the data will be very straightforward and visual. We plan on making a chart involving the world map, as our dataset includes youth smoking data from many countries. The map will be zoomable, so the user can view the region of interest. A bubble chart representation will also be superimposed on the map; the bubble over a country displays the percentage of youth smokers and its radius correlates with this value. When a region is clicked (and zoomed in upon), extra data will be displayed regarding the tobacco/smoking study conducted, such as the percentage of female/male smokers, the specific age range of participants, etc. 

This interaction allows the user to view the data of specific countries, but a macroview of the chart also provides insight on countries/regions with the highest percentages of teen smokers, as visually shown by the bubble sizes. As we are implementing a zoomable map, this feature includes ample room for specificities and probings into deeper questions. The GHO also has other tobacco/smoking related datasets, and we could include more specific information from those datasets, if it bears relevance to teen smoking. In the current dataset, zooming in reveals data about the gender ratio of teen smokers, a piece of information that can be represented by a simple bar graph. 

## D3 Features

D3 will be heavily utilized in creating our interactive chart. When zooming, the map will have to transition from the macro to micro view, via increasing the size of elements on the screen, with a focal point. Additionally, as there will be zoomed in/out modes, buttons will be needed for the user to toggle back and forth. 

Upon loading, the chart will utilize animation to grow the bubbles superimposed on the map. Later on, when the zoom in mode is entered, a bar graph of male/female smoker percentages will be generated in accordance with the data of the selected country. Our functionality will closely represent two examples from [the gallery](): the [bubble chart](https://bl.ocks.org/mbostock/4063269) and the [zoomable map](https://bl.ocks.org/mbostock/2206590). We will implement the zooming functionality of the zoomable map example in the gallery, and the bubbles superimposed on the map will have features of the bubble chart, such as variable size based on youth smoking percentage in the country. 

## Visualization

**Zoomable Map** (in our project, this map would be of the entire world):  
<img src="https://i.gyazo.com/65f409dfff31f93a28917b79da856229.png" alt="Drawing" style="width: 50px;"/>

**Zoomed In** (will have styling elements \[boxes\] to hold information):  
<img src="https://i.gyazo.com/cc7a19ce01b6ab595b7f8ba6dd4d2ac7.png" alt="Drawing" style="width: 50px;"/>

**Bubble Chart** (superimposed on map):  
<img src="https://i.gyazo.com/1e85cf3afe66684fee42777f43c6c02d.png" alt="Drawing" style="width: 50px;"/>

**General Visual of Final Product**:  
<img src="https://i.gyazo.com/de545729e3f3c321084432c6287d2ff5.png" alt="Drawing" style="width: 50px;"/>
