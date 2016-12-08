
var chai = require('chai');
chai.use(require('chai-as-promised'));

module.exports = function(){
    'use strict';
    
     this.Given(/^I am using the app$/, function (callback) {
         // Write code here that turns the phrase above into concrete actions
         
         browser.get('http://localhost:4500').then(function(){
             callback();
         });
       });
     this.When(/^I click on the button login$/, function (callback) {
             // Write code here that turns the phrase above into concrete action
            var loginLink = element(element(by.css('a[href*="#"]')));
            loginLink.click().then(function(){
                callback();
            });
           });
     this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
    
     /*this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
     this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
     this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
     this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
     this.When(/^I enter the "([^"]*)"$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             callback(null, 'pending');
           });
     this.Then(/^I click on the button save$/, function (callback) {
             // Write code here that turns the phrase above into concrete actions
         callback(null, 'pending');
       });*/
};