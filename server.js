// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require('path'); 

// Initialize Express application
const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: false }));

// Enable method override for PUT/DELETE forms
app.use(methodOverride("_method"));

// Log HTTP requests to console
app.use(morgan("dev"));

// Connect to MongoDB using URI from .env
mongoose.connect(process.env.MONGODB_URI);

// Connection event handlers
mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB ${mongoose.connection.name}.`)
});


// Import our Cloth model for database operations
const Cloth = require('./models/clothes');


// HOME ROUTE
app.get("/", (req, res) => {
    res.render('index');
});


// NEW - Show form to create new cloth
app.get('/clothes/new', (req, res) => {
    res.render('clothes/new');
});

// CREATE - Process new cloth form
app.post('/clothes', async (req, res) => {
    // Process checkbox value
    req.body.isReadyToWear = req.body.isReadyToWear === 'on';
    
    // Create new cloth in database
    await Cloth.create(req.body);
    
    // Redirect to clothes list
    res.redirect('/clothes');
});

// INDEX: Show all clothes
app.get('/clothes', async (req, res) => {
    // Fetch all clothes from database
    const allClothes = await Cloth.find();
    
    // Render view with clothes data
    res.render('clothes/index', { clothes: allClothes });
});

// SHOW:: Show single cloth details
app.get('/clothes/:clothId', async (req, res) => {
    // Find cloth by ID from URL parameter
    const foundCloth = await Cloth.findById(req.params.clothId);
    
    // Render view with cloth data
    res.render('clothes/show', { cloth: foundCloth });
});

// EDIT: Show edit form
app.get('/clothes/:clothId/edit', async (req, res) => {
    // Find cloth to edit
    const foundCloth = await Cloth.findById(req.params.clothId);
    
    // Render edit form with current cloth data
    res.render('clothes/edit', {
        cloth: foundCloth,
    });
});

// UPDATE- Process edit form
app.put('/clothes/:clothId', async (req, res) => {
    // Process checkbox value
    req.body.isReadyToWear = req.body.isReadyToWear === 'on';
    
    // Update cloth in database
    await Cloth.findByIdAndUpdate(req.params.clothId, req.body);
    
    // Redirect to cloth's detail page
    res.redirect(`/clothes/${req.params.clothId}`);
});

// DELETE: Remove cloth
app.delete('/clothes/:clothId', async (req, res) => {
    // Delete cloth by Id
    await Cloth.findByIdAndDelete(req.params.clothId);
    
    // Redirect to clothes list
    res.redirect('/clothes');
});

// Start listening for incoming requests
app.listen(port, () => {
    console.log(`server listening on ${port}.`)
});
