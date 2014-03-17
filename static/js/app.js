var congress_app = angular.module('congress_app', ['ngRoute', 'congress_service', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/search', {templateUrl: '/static/partials/congress-search.html',   controller: 'congress_search_ctrl'}).
      when('/about', {templateUrl: '/static/partials/about.html',   controller: 'about_ctrl'}).
      when('/legislator/:bioguide_id', {templateUrl: '/static/partials/legislator-detail.html',   controller: 'legislator_detail_ctrl'}).
      when('/organization/:entity_id', {templateUrl: '/static/partials/organization-detail.html',   controller: 'organization_detail_ctrl'}).
      when('/bill/:bill_id', {templateUrl: '/static/partials/bill-detail.html',   controller: 'bill_detail_ctrl'}).
      otherwise({redirectTo: '/search'});
}]);
