
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {appDirective} from './app.directive';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import uiBootstrap from 'angular-ui-bootstrap';

import {home} from './components/home/home';
import {catalog} from './components/catalog/catalog';
import {shop} from './components/shop/shop';
import {login} from './components/login/login';
import {blog} from './components/blog/blog';
import {galeria} from './components/galeria/galeria';
import {profile} from './components/profile/profile';
import {logout} from './components/logout/logout';
import {shared} from './shared/shared';


angular.module('app', [
  uiRouter,
  ngAnimate,
  uiBootstrap,
  home.name,
  catalog.name,
  shop.name,
  login.name,
  blog.name,
  shared.name,
  galeria.name,
  profile.name,
  logout.name
  ])
.directive('app', appDirective);
