import { Template } from 'meteor/templating';
import "./login.html";

Template.login.events({
  'click #submitBtn': function () {
    window.location.href = "/userinfo";
  }
});