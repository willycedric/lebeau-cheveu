
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
            var loginLink = element(by.id("login-link"));
            loginLink.click().then(()=>{
                callback();
            });
           });

        this.When(/^I click on singup link$/, function (callback) {
               // Write code here that turns the phrase above into concrete actions
               var signupLink = element(by.id('register-form-link'));
               signupLink.click()
               .then(()=>{
                  callback();
               });
             });

    this.When(/^User I enter the username (.+)$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
              var username = element(by.id('register-username'));
              username.sendKeys(arg1)
              .then(()=>{
                callback();
              });
           });
      this.When(/^I enter the  firstname (.+)$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             var firstname = element(by.id('register-firstname'));
             firstname.sendKeys(arg1)
             .then(()=>{
              callback();
             });
           });
    
    this.When(/^I enter the  lastname (.+)$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             var lastname = element(by.id('register-lastname'));
             lastname.sendKeys(arg1)
             .then(()=>{
              callback();
             });
           });

     this.When(/^I enter the email (.+)$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             var email = element(by.id('register-email'));
             email.sendKeys(arg1)
             .then(()=>{
              callback();
             });

           });
     this.When(/^I enter the  password (.+)$/, function (arg1, callback) {

             // Write code here that turns the phrase above into concrete actions
             var password=element(by.id('register-password'));
             password.sendKeys(arg1)
             .then(()=>{
              callback();
             })
           });
      this.When(/^I enter the password confirmation (.+)$/, function (arg1, callback) {
             // Write code here that turns the phrase above into concrete actions
             var passwordConfirmation = element(by.id('register-password-confirmation'));
             passwordConfirmation.sendKeys(arg1)
             .then(()=>{
              callback();
             });
           });

      this.When(/^I select the hairdresser checkbox$/, function (callback) {
         // Write code here that turns the phrase above into concrete actions
         var userRole = element(by.id('register-role'));
         userRole.click()
         .then(()=>{
          callback();
         })
       });
   
     this.Then(/^I click on the button save$/, function (callback) {
             // Write code here that turns the phrase above into concrete actions
         var submit = element(by.id('register-submit'));
         submit.click()
         .then(()=>{
          callback();
         });
       });
};