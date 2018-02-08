# Bart Now


### Overview
We have created a functional application for Bay Area Bart commuters. The basic notion for this mobile application is to locate the closest Bart Station using the end-user’s geolocation through their mobile device interacting with Google API & Bart API. Then the application will populate user interface with relevant BART data on trains and their scheduled arrival/departure times. 

For example if the end-user is at the UC Berkeley extension building and would like to head to the San Francisco campus they would open the app and it would provide them with the list of trains at Downtown Berkeley Station and their scheduled arrival times for the closest BART station. In this case the user would press on the SF/Millbrae train arriving in 10 mins. Upon selecting the train the navigation page would load and provide the end-user with their precise geolocation and their distance and ETA from the closest Bart Station. Interacting with the Google API app will route an itinerary for the end with an ETA to the nearest station.

The end user also has some alternative choices with the “view more trains” button if they wanted to modify their time of departure or destination. The “view another station” button will enable the user to change their departure location in this particular case lets say Downtown Berkeley to North Berkeley if need be. 

Additionally, the "change mode" button will interact with the Google Maps API should the end user decide to change the mode of transportation to the BART. There is a drop down menu that populates and gives the user option of choosing between walking, bicycling or driving to arrive at the chosen BART Station. 

Furthermore, there is an "Options Cog," in the top left for end-users to set and store their preferred settings for mode of transport, station, and train.


### Technologies
* JavaScript/HTML/CSS/Bootstrap
* Tippy.js (https://atomiks.github.io/tippyjs/)
* Firebase Database
* BART API
* Google Maps API


### Credits
* Abdel Rahkman
* Ehler Orngard
* Nick Wactor
* Denis Wu
