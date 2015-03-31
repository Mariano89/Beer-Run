// simple-todos.js
Scores = new Mongo.Collection("scores");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.posts.helpers({
    scores: function () {
      return Scores.find();
    }
  });
}