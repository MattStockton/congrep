
var congress_service = angular.module('congress_service', []);

congress_service.service('congress_service', function($http, $q) {
    
    var SECTOR_LOOKUP = {
            "A" : "Agribusiness",
            "B" : "Communications/Electronics",
            "C" : "Construction",
            "D" : "Defense",
            "E" : "Energy/Natural Resources",
            "F" : "Finance/Insurance/Real Estate",
            "H" : "Health",
            "K" : "Lawyers and Lobbyists",
            "M" : "Transportation",
            "N" : "Misc. Business",
            "Q" : "Ideology/Single Issue",
            "P" : "Labor",
            "W" : "Other",
            "Y" : "Unknown",
            "Z" : "Administrative Use"
    };
    var TRANSPARENCY_DATA_ROOT_URI = 'http://transparencydata.org/api/1.0/';
    var SUNLIGHT_ROOT_URI = 'https://congress.api.sunlightfoundation.com/';
    var CAPITOL_WORDS_ROOT_URI = 'http://capitolwords.org/api/1/';
    
    this.get_sector = function(sector_id) {
        return SECTOR_LOOKUP[sector_id];
    };
    
    this.get_entity_id_from_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();
        
        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'entities/id_lookup.json?apikey=' + sunlight_api_key + '&bioguide_id=' + bioguide_id + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data[0].id);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };

    this.get_legislator_by_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();
        
        $http.get(SUNLIGHT_ROOT_URI + 'legislators?apikey=' + sunlight_api_key + '&bioguide_id=' + bioguide_id).then(
            function(data){
                deferred.resolve(data.data.results[0]);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };
    
    this.get_top_donors_by_entity_id = function(entity_id){
        var deferred = $q.defer();

        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };    

    this.get_top_contributing_industries_by_entity_id = function(entity_id){
        var deferred = $q.defer();

        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/industries.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };    
    
    this.get_top_phrases_by_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();

        // Need to use jQuery JSONP because of this: https://github.com/angular/angular.js/issues/1551
        $.getJSON(CAPITOL_WORDS_ROOT_URI + 'phrases.json?entity_type=legislator&n=3&apikey=' + sunlight_api_key + '&entity_value=' + bioguide_id + '&callback=?').done(
            function(data){
                deferred.resolve(data);
            }).fail(
            function(){
                deferred.reject("Could not get phrases");
            }
        );
        
        return deferred.promise;
    };      
    
    this.get_top_contributing_sectors_by_entity_id = function(entity_id){
        var deferred = $q.defer();

        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/sectors.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };    

    this.get_contribution_breakdown_by_entity_id = function(entity_id){
        var deferred = $q.defer();

        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/type_breakdown.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };    
    
    this.get_independent_expenditures_by_entity_id = function(entity_id){
        var deferred = $q.defer();

        // TODO - Doesn't appear to be returning anything. Need to look into this
        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/fec_indexp.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };       
});
