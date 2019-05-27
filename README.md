# ![UtubeScrappy Logo](/public/assets/images/UtubeScrappy.jpg)
# UtubeScrappy
A webapp that scrapes news data from YouTube and allows users to comment about the videos. Can also delete comments.

## Deployed on Heroku
Click [Here](https://rocky-cliffs-44481.herokuapp.com/) To Demo!

## Node Packages Used
The app uses `express` , `mongoose` , `MongoDB` , `handlebars` , `materialize` ,  `jQuery` , `AJAX` , `request` , `cheerio` node packages.

## Running it Locally
After cloning it
Ensure that you have MongoDB set up on your computer
Once you are set up, `cd` into this repo and run `npm install`
Then open another bash or terminal window and run `mongod`
Look into server.js and make sure the "var MONGODB_URI" is set to "mongodb://localhost/UtubeScrappy"
Run the script with `node server.js`.
Type `localhost:3000` in your browser.

## Running it Locally With Docker!
Make sure you have docker installed [docker](https://docs.docker.com/docker-for-windows/install/)
Make sure "var MONGODB_URI" is set to "mongodb://mongo:27017/UtubeScrappy";
Then simplely do "Docker-compose up"
And type in "locahost" in your browser!
