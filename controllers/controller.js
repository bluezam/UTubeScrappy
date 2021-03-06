// Node Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

// Import the Comment and Video models
var Comment = require('../models/Comment.js');
var Video = require('../models/Video.js');

// Index Page Render (first visit to the site)
router.get('/', function (req, res) {

	// Scrape data
	res.redirect('/scrape');

});


// Videos Page Render
router.get('/videos', function (req, res) {

	// Query MongoDB for all video entries (sort newest to top, assuming Ids increment)
	Video.find().sort({
			_id: -1
		})

		// But also populate all of the comments associated with the videos.
		.populate('comments')

		// Then, send them to the handlebars template to be rendered
		.exec(function (err, doc) {
			// log any errors
			if (err) {
				console.log(err);
			}
			// or send the doc to the browser as a json object
			else {
				var hbsObject = {
					videos: doc
				}
				res.render('index', hbsObject);
				// res.json(hbsObject)
			}
		});

});


// Web Scrape Route
router.get('/scrape', function (req, res) {

	// First, grab the body of the html with request
	request('http://www.youtube.com', function (error, response, html) {

		// Then, load html into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(html);


		var titlesArray = [];

		// Now, grab every everything with a class of "inner" with each "video" tag
		$('h3.yt-lockup-title').each(function (i, element) {

			// Create an empty result object
			var result = {};

			// Collect the Video Title (contained in the "h2" of the "header" of "this")
			result.title = $(element).children().attr("title");

			// Collect the Video Link (contained within the "a" tag of the "h2" in the "header" of "this")
			result.link = "https://youtube.com" + $(element).children().attr("href");
			result.duration = $(element).children("span").text();
			result.channel = $(element).siblings().children("a").text();
			result.image = $(element).parent().parent().find("img").attr("src");
			if (result.image.indexOf("https") === -1) {
				result.image = $(element).parent().parent().find("img").attr("data-thumb");
			}


			// Error handling to ensure there are no empty scrapes
			if (result.title !== "") {

				// BUT also checking to make sure there are no duplicate videos...
				// Due to async, moongoose will not save the videos fast enough for the duplicates within a scrape to be caught
				if (titlesArray.indexOf(result.title) == -1) {

					// Push the saved item to the titlesArray to prevent duplicates
					titlesArray.push(result.title);

					// Only add the entry to the database if is not already there
					Video.count({
						title: result.title
					}, function (err, test) {

						// If the count is 0, then the entry is unique and should be saved
						if (test == 0) {

							// Using the Video model, create a new entry (note that the "result" object has the exact same key-value pairs of the model)
							var entry = new Video(result);

							// Save the entry to MongoDB
							entry.save(function (err, doc) {
								// log any errors
								if (err) {
									console.log(err);
								}
								// or log the doc that was saved to the DB
								else {
									console.log(doc);
								}
							});

						}

						else {
							console.log('Redundant Database Content. Not saved to DB.')
						}

					});
				}

				else {
					console.log('Redundant YouTube Content. Not Saved to DB.')
				}

			}

			else {
				console.log('Empty Content. Not Saved to DB.')
			}

		});

		// Redirect to the Videos Page, done at the end of the request for proper scoping
		res.redirect("/videos");

	});

});


// Add a Comment Route - **API**
router.post('/add/comment/:id', function (req, res) {

	// Collect video id
	var videoId = req.params.id;

	// Collect Author Name
	var commentAuthor = req.body.name;

	// Collect Comment Content
	var commentContent = req.body.comment;

	// "result" object has the exact same key-value pairs of the "Comment" model
	var result = {
		author: commentAuthor,
		content: commentContent
	};

	// Using the Comment model, create a new comment entry
	var entry = new Comment(result);

	// Save the entry to the database
	entry.save(function (err, doc) {
		// log any errors
		if (err) {
			console.log(err);
		}
		// Or, relate the comment to the video
		else {
			// Push the new Comment to the list of comments in the video
			Video.findOneAndUpdate({
					'_id': videoId
				}, {
					$push: {
						'comments': doc._id
					}
				}, {
					new: true
				})
				// execute the above query
				.exec(function (err, doc) {
					// log any errors
					if (err) {
						console.log(err);
					} else {
						// Send Success Header
						res.sendStatus(200);
					}
				});
		}
	});

});




// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res) {

	// Collect comment id
	var commentId = req.params.id;

	// Find and Delete the Comment using the Id
	Comment.findByIdAndRemove(commentId, function (err, todo) {

		if (err) {
			console.log(err);
		} else {
			// Send Success Header
			res.sendStatus(200);
		}

	});

});


// Export Router to Server.js
module.exports = router;