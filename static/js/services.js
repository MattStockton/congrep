
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
    var PARTY_TIME_ROOT_URI = 'http://politicalpartytime.org/api/v1/';
    
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
    
    this.get_committees_by_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();
        
        $http.get(SUNLIGHT_ROOT_URI + 'committees?apikey=' + sunlight_api_key + '&member_ids=' + bioguide_id).then(
            function(data){
                deferred.resolve(data.data.results);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };
    
    this.get_bills_sponsored_by_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();
        
        $http.get(SUNLIGHT_ROOT_URI + 'bills?apikey=' + sunlight_api_key + '&sponsor_id=' + bioguide_id + '&order=last_action_at').then(
            function(data){
                deferred.resolve(data.data.results);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };   

    this.get_votes_by_bioguide_id = function(bioguide_id){
        var deferred = $q.defer();
        
        $http.get(SUNLIGHT_ROOT_URI + 'votes?apikey=' + sunlight_api_key + '&voter_ids.' + bioguide_id 
            + '__exists=true&order=voted_at&vote_type=passage&per_page=50&fields=voted_at,question,result,bill,breakdown,voters.' + bioguide_id).then(
            function(data){
                deferred.resolve(_.map(data.data.results, 
                    function(cur){
                        return new Vote(cur);
                    }
                ));
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };

    this.get_events_by_crp_id = function(crp_id){
        var deferred = $q.defer();
        
        // Need to use jQuery JSONP because of this: https://github.com/angular/angular.js/issues/1551
        $http.jsonp(PARTY_TIME_ROOT_URI + 'event/?apikey=' + sunlight_api_key + 
            '&format=jsonp&beneficiaries__crp_id=' + crp_id + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data.objects);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    };

    this.search_for_legislators = function(search_text){
        
        var promises = [];
        var split_name = search_text.split(" ");
        if(split_name.length == 2){
            var query = "first_name=" + split_name[0] + "&last_name=" + split_name[1];
            promises.push($http.get(SUNLIGHT_ROOT_URI + 'legislators?' + query + '&apikey=' + sunlight_api_key));
         } 
        
        var query = "query=" + encodeURIComponent(search_text);
        promises.push($http.get(SUNLIGHT_ROOT_URI + 'legislators?' + query + '&apikey=' + sunlight_api_key));
       
        var deferred = $q.defer();
        
        $q.all(promises).then(
            function(results){
                var combined_results = [];
                for(var i = 0; i < results.length; i++){
                    if(results[i].data && results[i].data.results){
                        combined_results = combined_results.concat(results[i].data.results);
                    }
                }
                return deferred.resolve(combined_results);
            },
            function(fail_reason){
                deferred.resolve([]); // Just resolve with empty for now. Going to change search interface anyway
            }
        );
        
        return deferred.promise;
    };
    
    this.search_for_organizations = function(search_term){
        var deferred = $q.defer();
        search_tearm = encodeURIComponent(search_term);
        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'entities.json?apikey=' + sunlight_api_key + '&search=' + search_tearm + '&type=organization&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    }
    
    this.get_organization_by_entity_id = function(entity_id){
        var deferred = $q.defer();
        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'entities/' + entity_id + '.json?apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(new Organization(data.data));
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;
    }
    
    this._get_recipients_for_organization_entity_id = function(entity_id, type){
        var deferred = $q.defer();

        $http.jsonp(TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/' + type + '.json?&apikey=' + sunlight_api_key + '&callback=JSON_CALLBACK').then(
            function(data){
                deferred.resolve(data.data);
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;        
    }
    
    this.get_top_recipients_for_organization_entity_id = function(entity_id){
        return this._get_recipients_for_organization_entity_id(entity_id, 'recipients');
    };
    
    this.get_top_pac_recipients_for_organization_entity_id = function(entity_id){
        return this._get_recipients_for_organization_entity_id(entity_id, 'recipient_pacs');
    };   
});
