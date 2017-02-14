
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
import {customer} from './components/customer/customer';
import {customeraccount} from './components/customeraccount/customeraccount';
import {customerbooking} from './components/customerbooking/customerbooking';
import {customermessages} from './components/customermessages/customermessages';
import {hairdresser} from './components/hairdresser/hairdresser';
import {admin} from './components/admin/admin';
import {error} from './components/error/error';
import {cart} from './components/cart/cart';
import {forgot} from './components/forgot/forgot';
import {join} from './components/join/join';
import {hairdressers} from './components/hairdressers/hairdressers';
import {showhairdresserprofile} from './components/showhairdresserprofile/showhairdresserprofile';
import {hairdresseraccount} from './components/hairdresseraccount/hairdresseraccount';
import {hairdresserbooking} from './components/hairdresserbooking/hairdresserbooking';
import {hairdresserlogbook} from './components/hairdresserlogbook/hairdresserlogbook';
import {hairdresserpicture} from './components/hairdresserpicture/hairdresserpicture';
import {hairdressermessage} from './components/hairdressermessage/hairdressermessage';
import {searchbar} from './components/searchbar/searchbar';
import {accountactivation} from './components/accountactivation/accountactivation';
import {account} from './components/account/index';


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
  admin.name,
  customer.name,
  customermessages.name,
  customerbooking.name,
  customeraccount.name,
  hairdresser.name,
  error.name,
  cart.name,
  forgot.name,
  join.name,
  hairdressers.name,
  showhairdresserprofile.name,
  hairdresseraccount.name,
  hairdresserbooking.name,
  hairdresserlogbook.name,
  hairdresserpicture.name,
  hairdressermessage.name,
  searchbar.name,
  accountactivation.name,
  account.name
  ])
.directive('app', appDirective);

