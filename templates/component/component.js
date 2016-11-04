import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {<%=name%>Directive} from './<%= name %>.directive';
import './<%= name %>.scss';

export const <%= name %> = angular.module('<%= name %>', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('<%= name %>', {
      url: '/<%= name %>',
      template: '<<%- name %>></<%- name %>>'
    })
  })
  .directive('<%= name %>',<%=name%>Directive);

