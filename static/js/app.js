var congress_app = angular.module('congress_app', ['ngRoute', 'congress_service']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/congress', {templateUrl: '/static/partials/congress-detail.html',   controller: 'congress_ctrl'}).
      otherwise({redirectTo: '/congress'});
}]);
