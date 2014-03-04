var congress_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    $scope.legislator = undefined;
    $scope.top_donors = [];
    $scope.top_phrases = [];
    $scope.top_contributing_industries = [];
    $scope.top_contributing_sectors = [];
    $scope.contribution_breakdown = {};
    $scope.independent_expenditures = [];
 
    $scope.run_search = function(bioguide_id){
        congress_service.get_legislator_by_bioguide_id(bioguide_id).then(
            function(legislator){
                $scope.legislator = legislator;
                
                $scope.get_top_phrases(bioguide_id);    
                
                congress_service.get_entity_id_from_bioguide_id(bioguide_id).then(
                    function(entity_id){
                        $scope.legislator.entity_id = entity_id;
                        
                        $scope.get_top_donors(entity_id);
                        $scope.get_top_contributing_industries(entity_id);
                        $scope.get_top_contributing_sectors();
                        $scope.get_contribution_breakdown();
                        $scope.get_independent_expenditures();
                    }
                );
            }
        );
    }
  
    $scope.get_top_donors = function(entity_id){
        congress_service.get_top_donors_by_entity_id(entity_id).then(
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

    $scope.get_top_contributing_industries = function(entity_id){     
        congress_service.get_top_contributing_industries_by_entity_id(entity_id).then(
                function(data){
                    $scope.top_contributing_industries = data;
                }
        );  
    };

    $scope.get_top_contributing_sectors = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator.entity_id + '/contributors/sectors.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.top_contributing_sectors = data;
                }
        );  
    };

    $scope.get_contribution_breakdown = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator.entity_id + '/contributors/type_breakdown.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
                function(data){
                    $scope.contribution_breakdown = data;
                }
        );  
    };

    // TODO - Doesn't appear to be returning anything. Need to look into this
    $scope.get_independent_expenditures = function(){     
        $http.jsonp('http://transparencydata.com/api/1.0/aggregates/pol/' + $scope.legislator.entity_id + '/fec_indexp.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').success(
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
