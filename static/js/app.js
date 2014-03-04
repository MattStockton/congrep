var congress_app = angular.module('congress_app', ['ngRoute', 'congress_service']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/search', {templateUrl: '/static/partials/congress-search.html',   controller: 'congress_search_ctrl'}).
      when('/congress/:bioguide_id', {templateUrl: '/static/partials/congress-detail.html',   controller: 'congress_detail_ctrl'}).
      otherwise({redirectTo: '/search'});
}]);