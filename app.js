
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//*********************** For Connect to the Server using mongoose**********************


// const url = "mongodb://127.0.0.1:27017/blogDB"; // for local server

// const url = "mongodb+srv://test:test-123@cluster0.gnhpjmb.mongodb.net/blogDB"; // for cloud server using mongodb atlas

// const url = process.env.MONGO_URL;

// console.log(url);

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_CLOUD_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Connected to MongoDB');
})
.catch((error) => {
console.error('Error connecting to MongoDB', error);
});


const blogSchema = {
  title: {
    type: String,
    required: "Title is required, please check your entry"
  },
  content: {
    type: String,
    required: "Content is required, please check your entry"
  },
};

const Blog = mongoose.model("Blog", blogSchema);

let blogs = [];  

app.get("/", function (req, res) {

  Blog.find({}, function(err, posts){

    res.render("home", {startingContent: homeStartingContent, posts: posts });

  });

  // res.render("home", { 
  //   startingContent: homeStartingContent,
  //   posts:posts
  //   });

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  // console.log(req.body.postTitle);

  const post = new Blog ({
    title: _.capitalize(req.body.postTitle),
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/")
    }
  })

  blogs.push(post);

});

app.get("/:posts",function(req,res){
  res.redirect("/");
})

app.get("/posts/:postName", function(req,res){

  const requestedTitle = _.lowerCase(req.params.postName);

  Blog.find({}, function(err, foundBlog){
    
    foundBlog.forEach(function(post){

      const storedTitle = _.lowerCase(post.title);
  
      if(storedTitle === requestedTitle){
         res.render("post",{
            title: post.title,
            content: post.content
         });
      }
    });

  })


});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
