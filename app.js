//jshint esversion: 6
const express = require("express");
const bodyBody = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyBody.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////Request targeting all articles//////////////////
app.route("/articles")

.get((req, res) => {
  Article.find((err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post((req, res) => {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content

  });
  newArticle.save((err) => {
    if (!err) {
      console.log("successfully added article to wikiDB");
    } else {
      console.log(err);
    }
  });
})


.delete((req, res)=>{
  Article.deleteMany((err)=>{
    if(!err){
      console.log("successfully deleted all the articles from the wikiDB");
    }else{
      console.log(err);
    }
  });
});

/////////////////////Request targeting all specific article///////////////////

app.route("/articles/:articleTitle")

.get((req, res)=>{

  Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
    if(!err){
      res.send(foundArticle);
    }else{
      console.log("No matiching article was found!");
    }
  });
})

.put((req, res) => {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (err)=>{
      if(!err){
        res.send("successfully update the article");
      }else{
        res.send(err);
      }
    }

);
})

.patch((req, res)=>{
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    (err)=>{
      if(!err){
      res.send("successfully updated article");
    }else{
      res.send(err);
    }
  }
);
})

.delete((req, res)=>{
  Article.deleteOne(
    {title: req.params.articleTitle},
    (err)=>{
      if(!err){
        res.send("successfully deleted article");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server has successfully started at port 3000");
});
