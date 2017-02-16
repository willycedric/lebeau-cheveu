
import {loginSocialGoogleModule} from './login-google.js';
import {loginSocialFacebookModule} from './login-facebook.js';

export const loginSocialModule = angular.module('loginSocialModule', [
  loginSocialGoogleModule.name,
  loginSocialFacebookModule.name
]);
