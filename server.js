const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require('path'); // Added for path handling
const app = express();
const port = 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`connected to mongoDB ${mongoose.connection.name}.`)
});

// Importing the Cloth model (consistent capitalization)
const Cloth = require('./models/clothes');

// GET Route
app.get("/", (req, res) => {
    res.render('index');
});

app.get('/clothes/new', (req, res) => {
    res.render('clothes/new');
});

app.get('/clothes/:clothId/edit', async (req, res) => {
    const foundCloth = await Cloth.findById(req.params.clothId);
    res.render('clothes/edit', {
        cloth: foundCloth,
    });
});

app.get('/clothes/:clothId', async (req, res) => {
    const foundCloth = await Cloth.findById(req.params.clothId);
    res.render('clothes/show', { cloth: foundCloth });
});

app.delete('/clothes/:clothId', async (req, res) => {
    await Cloth.findByIdAndDelete(req.params.clothId);
    res.redirect('/clothes');
});

app.put('/clothes/:clothId', async (req, res) => {
    if (req.body.isReadyToWear === 'on') {
        req.body.isReadyToWear = true;
    } else {
        req.body.isReadyToWear = false;
    }
    await Cloth.findByIdAndUpdate(req.params.clothId, req.body);
    res.redirect(`/clothes/${req.params.clothId}`);
});

app.post('/clothes', async (req, res) => {
    if (req.body.isReadyToWear === 'on') {
        req.body.isReadyToWear = true;
    } else {
        req.body.isReadyToWear = false;
    }
    await Cloth.create(req.body);
    res.redirect('/clothes');
});

// GET /clothes route
app.get('/clothes', async (req, res) => {
    const allClothes = await Cloth.find();
    res.render('clothes/index', { clothes: allClothes });
});

app.listen(port, () => {
    console.log(`server listening on ${port}.`)
});