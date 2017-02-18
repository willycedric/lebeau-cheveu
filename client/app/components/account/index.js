import {accountIndexModule} from './account';
import {accountSettingsModule} from './settings/account-settings';
import {accountVerificationModule} from './verification/account-verification';
import {accountbooking}  from './booking/accountbooking';
import {accountmessages} from './messages/accountmessages';
export const account = angular.module('account', [
  accountIndexModule.name,
  accountSettingsModule.name,
  accountVerificationModule.name,
  accountbooking.name,
  accountmessages.name
])
.directive('serverError', [ function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      replace: true,
      link: function (scope, element, attrs, ctrl) {
        element.on('change', function(){
          scope.$apply(function(){
            ctrl.$setValidity('server', true);
          });
        });
      }
    };
  }]);