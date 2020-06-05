var mongoose = require("mongoose");
var express = require("express");
var app = express();
var metodOverride = require("method-override");
var bodyParser = require("body-parser");

app.use(metodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/blog_app")




var blogSchema = new mongoose.Schema({
	title : String,
	img   : String,
	body  : String,
	created:{type:Date,default : Date.now}

})


 var blog = mongoose.model("Blog",blogSchema);

 blog.create({
 	title : "test title",
 	img : "https://image.shutterstock.com/image-photo/tent-glows-under-night-sky-260nw-281939390.jpg",
 	body : "body is still in progress",

 })

 app.get("/",function(req,res){
 	res.redirect("/blog");
 })

app.get("/blog",function(req,res){

	blog.find({},function(err,blogs){
		if(err)
		{
			console.log("something went wrong");
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
	
});

app.get("/new-blog",function(req,res){
	res.render("new");
})


app.post("/blog",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var body = req.body.Body;
	var newblog = {title:name,img:image,body:body };
	blog.create(newblog,function(err,blog){
		if(err)
		{
			console.log("OOOOOOOOOOOOOPPPS");
		}
		else
			res.redirect("/blog");
	})
})


app.get("/blog/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err)
			console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
		else
		{
			res.render("show",{blog:foundblog});
		}
	})

})

app.get("/blog/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err)
			console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
		else
		{
			res.render("edit",{blog:foundblog});
		}
	})


})

app.put("/blog/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundblog){
		if(err){
			console.log("O my goooood");
		}
		else
		{
			res.redirect("/blog/"+req.params.id);
		}
	});
});


app.delete("/blog/:id",function(req,res){
	blog.findByIdAndDelete(req.params.id,function(err){
		if(err){
			console.log("cannot delete");
		}
		else
			res.redirect("/blog");
	})
})

app.listen(3000,function(){
	console.log("blog is online");
})  