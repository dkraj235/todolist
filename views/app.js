
const express= require("express");
const bodyParser = require("body-parser");


const app = express();
app.use('/', express.static("public"));
var items=["buy-food","cook-food","eat food"] ;
let workitems=[];

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');



app.get("/", function(req,res){

var d=new Date();
var Currentday=d.getDay();
var today="";


switch(Currentday){
    case 0:
    today="Sunday";
    break;
    case 1:
    today="Monday";
    break;
    case 2:
    today="Tuesday";
    break;
    case 3:
    today="Wednesday";
    break;
    case 4:
    today="Thursday";
    break;
    case 5:
    today="Friday";
    break;
    case 6:
    today="Saturday";
    break;
    default:
    console.log("error"+Currentday);
}


res.render("list", {listTitle:today , newListitems:items});


app.post("/", function(req,response){
  var  item = req.body.newitem;
  items.push(item);

  response.redirect("/");

})

});

app.get("/work", function(req,res){
     res.render("list" ,{listTitle:"work List", newListitems:workitems})
})


app.post("/work", function(req,res){
  let item = req.body.list;
  console.log(item);
  workitems.push(item);
  res.redirect("/");
})



app.listen(3000, function(){
    console.log("server started on port 3000");
});
