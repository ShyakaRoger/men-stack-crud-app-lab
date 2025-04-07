// the code in the models/cloth.js

const mongoose = require('mongoose');
const clothSchema = new mongoose.Schema({
    name: String,
    isReadyToWear: Boolean,
});

//creating the model
const Cloth = mongoose.model('Cloth', clothSchema);

//exporting the model from the cloth.js file

module.exports=Cloth;