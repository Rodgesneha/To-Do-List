const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-Sneha:test123@cluster0.lmrfpxm.mongodb.net/todolistDB");

const itemSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

const Item = mongoose.model("Item", itemSchema);

const listSchema = mongoose.Schema({
    name : String,
    items : [itemSchema]
})
const List = new mongoose.model("List", listSchema);

const item1 = new Item({
    name : "Welcome to your todolist"
});
const item2 = new Item({
    name : "Hit + button to add new item"
});
const item3 = new Item({
    name : "<-- hit this to delete an item"
});
const defaultItems = [item1, item2, item3];



app.get("/", (req, res) => {
    Item.find(function(err, foundItems){
        if(err){
            console.log(err);
        }else{
            if(foundItems.length == 0){
                Item.insertMany(defaultItems, function(err){
                    if(err){
                        console.log(err);
                    }
                    // else{
                    //     console.log("Successfully inserted default items in DB");
                    // }
                })
                res.redirect("/");
            }else{
                res.render('list', {
                    listType : "Today",
                    newItem : foundItems
                });
            }
            
        }
    } )
    
})

app.get("/:customListName", (req, res) => {
    const listName = _.capitalize(req.params.customListName);
    List.findOne({name : listName}, function(err, foundList){
        if(!err){
            if(!foundList){
                // console.log("Doesn't exsists");
                const list = new List({
                    name : listName,
                    items : defaultItems
                })
                list.save()
                res.redirect("/"+listName)
            }else{
                // console.log("exsists")
                res.render('list', {
                listType : foundList.name,
                newItem : foundList.items
                });
            }
        }
    })
    
    
    
})


app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name : itemName
    })
    if(listName === "Today"){
        item.save();
        res.redirect("/")
    }else{
        List.findOne({name : listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
    
})

app.post("/delete", (req, res)=>{
    const deleteId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(deleteId, function(err){
            if(err){
                console.log(err);
            }else{
                // console.log("successfully deleted item")
                res.redirect("/");
            }
        })
    }else{
        List.findOneAndUpdate({name : listName}, {$pull : {items : {_id : deleteId}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
    
})

app.listen(3000, () => console.log("Listening on port 3000"));