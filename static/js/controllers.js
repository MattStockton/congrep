var congress_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    $scope.search_criteria = "48104";
    $scope.legislator = undefined;
    $scope.top_donors = [];
    $scope.top_phrases = [];
    $scope.top_contributing_industries = [];
    $scope.top_contributing_sectors = [];
    $scope.contribution_breakdown = {};
    $scope.independent_expenditures = [];
    
 
    $scope.run_search = function(bioguide_id){
        $http.get(sunlight_root + '/legislators?apikey=' + sunlight_api_key + '&bioguide_id=' + bioguide_id).then(
            function(result){
            	if(result && result.data && result.data.results){
            		$scope.legislator = result.data.results[0];	
            		
                    $scope.get_top_phrases($scope.legislator.bioguide_id);    
                    
            		$scope.set_entity_id($scope.legislator.bioguide_id).then(function(){
                        $scope.get_top_donors();
                        $scope.get_top_contributing_industries();
                        $scope.get_top_contributing_sectors();
                        $scope.get_contribution_breakdown();
                        $scope.get_independent_expenditures();
            		});
            	}
            }
        );
    }
    
    $scope.set_entity_id = function(bioguide_id){
    	var deferred = $q.defer();
    	
        $http.jsonp('http://transparencydata.org/api/1.0/entities/id_lookup.json?apikey=' + sunlight_api_key + '&bioguide_id=' + bioguide_id + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.legislator_entity_id = data[0].id;
                    deferred.resolve();
                }
        );
        return deferred.promise;
    };

    $scope.get_top_donors = function(){
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator_entity_id + '/contributors.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.top_donors = data;
                }
        );  
    }
    
    $scope.get_top_phrases = function(bioguide_id){     
    	// Need to use jQuery JSONP because of this: https://github.com/angular/angular.js/issues/1551
    	$.getJSON('http://capitolwords.org/api/1/phrases.json?entity_type=legislator&n=3&apikey=' + sunlight_api_key + '&entity_value=' + bioguide_id + '&callback=?',
            function(data){
               $scope.top_phrases = data;
            }
        );
    };

    $scope.get_top_contributing_industries = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator_entity_id + '/contributors/industries.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.top_contributing_industries = data;
                }
        );  
    };

    $scope.get_top_contributing_sectors = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator_entity_id + '/contributors/sectors.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.top_contributing_sectors = data;
                }
        );  
    };

    $scope.get_contribution_breakdown = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator_entity_id + '/contributors/type_breakdown.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.contribution_breakdown = data;
                }
        );  
    };

    // TODO - Doesn't appear to be returning anything. Need to look into this
    $scope.get_independent_expenditures = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator_entity_id + '/fec_indexp.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.independent_expenditures = data;
                }
        );  
    };
    
    $scope.get_sector_name = function(sector){
    	return congress_service.get_sector(sector);
    }

    $scope.run_search($routeParams.bioguide_id);
};

var congress_search_ctrl = function ($scope, $http, $window, $q, $location, congress_service) {
	$scope.congress_search_text = "";
	$scope.congress_search_error = undefined;
	
	$scope.search = function(){
		var split_name = $scope.congress_search_text.split(" ");
		
		var query = "";
		if(split_name.length == 2){
			query = "first_name=" + split_name[0] + "&last_name=" + split_name[1];
		} else {
			query = "query=" + $scope.congress_search_text;
		}
		
        $http.get(sunlight_root + '/legislators?' + query + '&apikey=' + sunlight_api_key).then(
            function(result){
            	if(result && result.data && result.data.results && result.data.results.length > 0){
            		if(result.data.results.length > 1){
            			$scope.congress_search_error = "More than one result found. Please be more specific";
            		} else {
            			var bioguide_id = result.data.results[0].bioguide_id;
            			$location.path('congress/' + bioguide_id);
            		}
            	} else {
            		$scope.congress_search_error = "No results found";
            	}
            }
        );
	};
}

congress_app.controller('congress_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', congress_detail_ctrl]);
congress_app.controller('congress_search_ctrl', ['$scope', '$http', '$window', '$q', '$location', 'congress_service', congress_search_ctrl]);
