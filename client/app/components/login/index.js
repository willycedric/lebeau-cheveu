import {loginForgotModule} from './forgot/login-forgot';
import {loginSocialModule} from './social/index';
import {loginResetModule} from './reset/login-reset';

export const loginModule = angular.module('loginModule', [
  loginForgotModule.name,
  loginResetModule.name,
  loginSocialModule.name,
]);