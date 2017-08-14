// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://naieems:12345@ds151202.mlab.com:51202/supto-user').then(
    () => { console.log("Ready to connect"); },
    err => { console.log("not connected"); }
); // connect to our database
var Bear = require('./app/models/bear');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/api/bears)
.post(function(req, res) {
    var bear = new Bear(); // create a new instance of the Bear model
    bear.name = req.body.name; // set the bears name (comes from the request)
    bear.title = req.body.title;
    bear.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'Bear created!' });
    });


})

// get all the bears (accessed at GET http://localhost:8080/api/bears)
.get(function(req, res) {
    Bear.find(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

// get the bear with that id
.get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
        if (err)
            res.send(err);
        res.json(bear);
    });
})

// update the bear with this id
.put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {

        if (err)
            res.send(err);

        req.body.name ? bear.name = req.body.name : "";
        req.body.title ? bear.title = req.body.title : "";
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear updated!' });
        });

    });
})

// delete the bear with this id
.delete(function(req, res) {
    Bear.remove({
        _id: req.params.bear_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);