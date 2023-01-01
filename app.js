
const express= require("express");
const  _ = require("lodash");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
// const date = require(__dirname+"/date.js");

const app = express();

app.use('/', express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-dilip:dilip123@cluster0.nwdwxrb.mongodb.net/todolistDB", {useNewUrlParser: true});


const itemsSchema = {
name:String
}

const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("item", itemsSchema);


const item1 = new Item({
  name:"Welcome Here in todo-list"
});

const item2 = new Item({
  name:"today--list "
});

const item3 = new Item({
  name:"hits here for delete"
});
const defaultItems = [ item1, item2, item3];


let workitems=[];
let travelitems=[];

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get("/:id", function(req, res){
// _.lowerCase('--Foo-Bar--');

const  customListName = _.capitalize(req.params.id);

List.findOne( { name:customListName}, function(err, foundList) {
  if(!err) {

    if(!foundList) {
      //create List
      const list = new List( {
        name:customListName,
        items:defaultItems
    });
    list.save();
    res.redirect("/" + customListName);
  }

     else {
      res.render("list", {listTitle:foundList.name , newListitems:foundList.items});
         }
  }
});

});




app.get("/", function(req, res) {

  Item.find({}, function(err, founditems) {

    if(founditems.length == 0){

//Some default item here

      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        } else {
          console.log("Succcesfully saved default item to DB");
        }
      });


      res.redirect("/");
    } else {
      res.render("list", {listTitle:"Today" , newListitems:founditems});
    }
});
});


app.post("/", function(req,response){

const  itemName = req.body.newitem ;
const listName = req.body.list;
const item = new Item({
  name:itemName
})

if(listName === "Today"){
  item.save();
  response.redirect("/");
}
else {

List.findOne({name:listName}, function(err, foundList){
  foundList.items.push(item);
  foundList.save();
  response.redirect("/" + listName);
});
}
});


app.post("/delete", function(req, res){

  const checkedId = req.body.checkbox ;
  const listName =req.body.listname;

if(listName === "Today"){

  Item.findByIdAndRemove(checkedId, function(err){

    if(!err) {
      console.log("Succcesfully deleted !! ");
      res.redirect("/");
    }
});
} else {

    List.findOneAndUpdate({name:listName}, {$pull: {items:{_id: checkedId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
}
});


app.listen(3000, function() {
    console.log("server started on port 3000");
});
