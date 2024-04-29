const express = require('express');
const app = express();
const morgan = require("morgan")
const methodOverride = require('method-override')

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const Car = require("./models/cars.js");

const connect = async() => {
    await mongoose.connect(process.env.MONGODB_URI)
}

app.use(express.urlencoded({extended:false}))
// app.use(morgan('dev'))
app.use(methodOverride('_method'))


app.delete('/cars/:carId', async (req, res)=> {
    await Car.findByIdAndDelete(req.params.carId)
    res.redirect('/cars')
})

app.get('/cars/:carId/edit', async (req,res)=> {
    const foundCar = await Car.findById(req.params.carId)
    res.render('cars/edit.ejs', {
        car: foundCar
    })
})

app.put('/cars/:carId', async (req,res)=>{
    if(req.body.isElectric === 'on'){
        req.body.isElectric = true
    } else {
        req.body.isElectric = false
    }
    await Car.findByIdAndUpdate(req.params.carId, req.body)
    res.redirect('/cars')
})




app.post('/cars', async (req,res)=> {
    if(req.body.isElectric === 'on'){
        req.body.isElectric = true
    } else {
        req.body.isElectric = false
    }
    const createdCar = await Car.create(req.body)
    res.redirect('/cars')
})

app.get('/cars', async (req, res) => {
    const allCars = await Car.find()
    res.render('cars/index.ejs', {
        cars: allCars
    })
})

app.get("/cars/new", (req, res) => {
    res.render('cars/new.ejs')
});

app.get('/', (req,res)=> {
    res.render('index.ejs')
})


app.get('/cars/:carId', async (req,res)=>{
    const foundCar = await Car.findById(req.params.carId)
    res.render('cars/show.ejs', {
        car:foundCar
    })
})



app.listen(3000, () =>{
    console.log("Running on the Server!")
})
