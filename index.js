const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const PORT = 4000;
const app = express();
const router = express.Router()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/Data")
    .then(() => {
        console.log("Database Connected")
    }).catch((e) => {
        console.error(e)
    });
const Dataschema = new mongoose.Schema({
    id: Number,
    quotes: String,
    author: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
const DataModel = mongoose.model("DataModel", Dataschema);

router.post('/addQuotes', (req, res) => {
    const data = new DataModel({          
        id: req.body.id,
        quotes: req.body.quotes,
        author: req.body.author
    })
    console.log(req.body)
    data.save();
    res.status(200).json({message:"success"});
});
router.get('/fetchData', async (req, res) => {
    try {
        const allData = await DataModel.find().exec();
        if (allData.length === 0) {
            res.send("No Data");
        } else {
            const arr = [];
            allData.forEach((doc) => {
                arr.push({
                    id: doc.id,
                    quotes: doc.quotes,
                    author: doc.author,
                    createdAt: doc.createdAt
                });
            });
          
            res.send(arr);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.use('/new', router);
app.listen(PORT, () => {
    console.log("Server Started")
});