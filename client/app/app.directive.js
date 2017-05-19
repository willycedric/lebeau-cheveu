import './app.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';
import template from './app.html';
import {AppController as controller} from './app.controller';
import './app.scss';
export const appDirective = ()=> {
  return {
    template,
    controller,
    controllerAs:'vm',
    restrict: 'E',
    scope: {},
    link: function(scope, elt, atts){
      
  },
    replace: true
  };
};

