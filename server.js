const { Console } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb+srv://Products:UZ1IWeNblR6Fm25C@newcluster.wrqrsgy.mongodb.net/?retryWrites=true&w=majority");

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected')
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    title: String,
    check: {type: Boolean, default: false}
});

const Product = mongoose.model('Product', ProductSchema);

app.use(morgan('tiny'));

// get data from db
app.get('/api', (req, res) => {
    Product.find({ })
        .then((data) => {
            console.log(data)
            res.json(data)
        })
        .catch((error) => {
            console.log(error)
        })
})

// add data to db
app.post('/api/save', (req, res) => {
    console.log('Body: ', req.body)
    const data = req.body
    const newProduct = new Product(data);
    newProduct.save((error) => {
        if (error) {
            res.status(500).json({msg: 'Oops, internal server errors'})
        }
        else {
            res.json({
                msg: 'Your data has been recieved'
            });
        }
    })
});

// update data on db
app.put('/api/update', (req, res) => {
    const id = req.body._id
    const check = req.body.check
    console.log(id)
    Product.updateOne({_id: id}, {$set: {check: check}})
    .then((error) => {
        if (error) {
            res.status(500).json({msg: 'Oops, internal server errors while updating'})
            console.log(error)
        }
        else {
            res.json({
                msg: 'Your data has been updated'
            });
        }
    })
})

app.listen(PORT, console.log(`Server PORT: ${PORT}`))