# cs171-final-project
CS 171 Final Project - Visualizing Gun Violence in America

Folders:
- css: folder of CSS files
	- bootstrap.min.css: Bootstrap library styling
	- style.css: contains our own styling
- data: 
	- gun-violence-min.csv: data set from the Gun Violence repository, contains the data with which we create our visualizations (years 2017-2018)
	- stage3-min.csv: subset of data with which we initially created our visualizations
- img: contains images for use throughout the website
- js: 
	- main.js: base file for aggregating and implementing visualizations in other JS files
	- structure.js: implements pagination structure of the website
	- incidentsMap.js: implementation of map of U.S. with locations of incidents marked with circles
	- memoriam.js: implementation of memoriam of victims of shootings
	- timeplot.js: implementation of line chart showing number of injured/killed over time, linked to bar chart (barplot.js)
	- barplot.js: implementation of bar chart depicting age group, linked to the line chart (timeplot.js)
	- stackedarea.js: implementation of stacked area chart depicting breakdown of types of shootings, linked to the area chart (timeline.js)
	- timelines.js: implementation of area chart depicting shootings over time, linked to the stacked area chart (stackedarea.js)
	- all other files are from JS libraries
- scrollify: files all from the Scrollify JS library 

Project website: https://bear-arms.herokuapp.com/

Screencast video: https://www.youtube.com/watch?v=_90Fep_S-fo

Non-obvious features:
- Users can navigate through the different pages of our website by scrolling, hitting the up/down arrows, and also by clicking on the dots on the right side of the website. Hovering over the dots also shows the titles of each page on the website.
- Users can also often hover over the article names in the footnotes of most pages to access the articles where the statistics and/or images used in the website were found.

Statistics from:
- http://www.bradycampaign.org/key-gun-violence-statistics
- https://injury.research.chop.edu/violence-prevention-initiative/types-violence-involving-youth/gun-violence/gun-violence-facts-and#.W_sTtJNKgWo

Images from:
- https://medium.com/the-base-line/america-doomed-to-tragedies-of-gun-violence-in-the-media-2557ea1f4329
- https://www.theguardian.com/us-news/ng-interactive/2017/nov/14/stories-of-loss-love-and-hope-six-firsthand-accounts-from-some-of-americas-worst-mass-shootings
- https://www.westword.com/news/columbine-no-longer-in-us-mass-shootings-top-ten-9670962
- http://www.theeventchronicle.com/orlando-shooting/orlando-mass-shooting-another-obvious-false-flag-government-psyop/
- http://www.newslocker.com/en-us/region/orlando/gunman-opens-fire-inside-texas-church-at-least-20-dead/
- https://www.actionnewsnow.com/content/news/At-least-12-killed-in-shooting-at-a-bar-in-Thousand-Oaks-gunman-also-dead-500018092.html

