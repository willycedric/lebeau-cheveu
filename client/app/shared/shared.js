import {api} from './api';
import {posts} from './posts';
import {franceMap} from './franceMap';
import angular from 'angular';


export const shared = angular.module('shared', [])
  .constant('API', api)
  .factory('Posts', posts)
  .factory('Map', franceMap);


