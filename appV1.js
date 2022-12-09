const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
let items = [];
let workItems = [];
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    // const day = date.getDay();
    const day = date.getDate();
    res.render('list', {
        listType : day,
        newItem : items
    })
})

app.get("/work", (req, res) => {
    res.render('list', {listType : "Work", newItem : workItems});
})


app.post("/", (req, res) => {
    if(req.body.list === 'Work'){
        const item = req.body.newItem;
        workItems.push(item);
        res.redirect('/work');
    }else{
        const item = req.body.newItem;
        items.push(item);
        res.redirect('/');
    }
    
})

app.listen(3000, () => console.log("Listening on port 3000"));