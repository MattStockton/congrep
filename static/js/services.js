
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
});

