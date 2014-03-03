var congress_ctrl = function ($scope, $http, $window, $q, congress_service) {
    $scope.search_criteria = "48104";
    $scope.legislator = undefined;
    $scope.top_donors = [];
    $scope.top_phrases = [];
    $scope.top_contributing_industries = [];
    $scope.top_contributing_sectors = [];
    $scope.contribution_breakdown = {};
    $scope.independent_expenditures = [];
    
    $scope.run_search = function(){
        $http.get(sunlight_root + '/legislators/locate?apikey=' + sunlight_api_key + '&zip=' + $scope.search_criteria).then(
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

    $scope.run_search();
};

congress_app.controller('congress_ctrl', ['$scope', '$http', '$window', '$q', 'congress_service', congress_ctrl]);
