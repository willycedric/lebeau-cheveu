class AppController {
	constructor($scope,i18nNotifications,localizedMessages){
		$scope.notifications = i18nNotifications;

	  $scope.removeNotification =  (notification)=> {
	    i18nNotifications.remove(notification);
	  };

	  $scope.$on('$routeChangeError', (event, current, previous, rejection)=>{
	    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
	  });

       
	};//end constructor
}

AppController.$inject=['$scope', 'i18nNotifications', 'localizedMessages'];
export {AppController};


/*// Node.js Express backend csurf module csrf/xsrf token cookie name


angular.module('app')

angular.module('app').controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function($scope, i18nNotifications, localizedMessages) {

  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}]);*/
