
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
    
    this._angular_web_request = function(endpoint, data_conversion_function, http_function){
        endpoint = endpoint + 'apikey=' + sunlight_api_key;
        
        if(http_function == $http.jsonp){
            endpoint = endpoint + '&callback=JSON_CALLBACK';
        }
        
        var deferred = $q.defer();
        http_function(endpoint).then(
            function(data){
                return deferred.resolve(data_conversion_function(data));
            },
            function(fail_reason){
                deferred.reject(fail_reason);
            }
        );
        return deferred.promise;        
    }
    
    this._jsonp_request = function(endpoint, data_conversion_function){
        return this._angular_web_request(endpoint, data_conversion_function, $http.jsonp);
    }

    this._get_request = function(endpoint, data_conversion_function){
        return this._angular_web_request(endpoint, data_conversion_function, $http.get);
    }
    
    
    this.get_entity_id_from_bioguide_id = function(bioguide_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'entities/id_lookup.json?bioguide_id=' + bioguide_id + '&';       
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data[0].id;
            });
    };

    this.get_legislator_by_bioguide_id = function(bioguide_id){
        var endpoint = SUNLIGHT_ROOT_URI + 'legislators?bioguide_id=' + bioguide_id + '&';   
        return this._get_request(endpoint, 
            function(data){
                return data.data.results[0];
            });
    };
    
    this.get_top_donors_by_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });
    };    

    this.get_top_contributing_industries_by_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/industries.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });
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
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/sectors.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });
    };    

    this.get_contribution_breakdown_by_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/contributors/type_breakdown.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });
   };    
    
    this.get_independent_expenditures_by_entity_id = function(entity_id){
        // TODO - Doesn't appear to be returning anything. Need to look into this
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/pol/' + entity_id + '/fec_indexp.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });
   };       
    
    this.get_committees_by_bioguide_id = function(bioguide_id){
        var endpoint = SUNLIGHT_ROOT_URI + 'committees?member_ids=' + bioguide_id + '&';
        return this._get_request(endpoint, 
            function(data){
                return data.data.results;
            });
    };
    
    this.get_bills_sponsored_by_bioguide_id = function(bioguide_id){
        var endpoint = SUNLIGHT_ROOT_URI + 'bills?sponsor_id=' + bioguide_id + '&order=last_action_at&';
        return this._get_request(endpoint, 
            function(data){
                return data.data.results;
            });
    };   

    this.get_votes_by_bioguide_id = function(bioguide_id){
        var endpoint = SUNLIGHT_ROOT_URI + 'votes?voter_ids.' + bioguide_id +
          '__exists=true&order=voted_at&vote_type=passage&per_page=50&' +
          'fields=voted_at,question,result,bill,breakdown,voters.' + bioguide_id + '&';
          
        return this._get_request(endpoint, 
            function(data){
                return _.map(data.data.results, 
                    function(cur){
                        return new Vote(cur);
                    });        
            });
    };

    this.get_events_by_crp_id = function(crp_id){
        var endpoint = PARTY_TIME_ROOT_URI + 'event?format=jsonp&beneficiaries__crp_id=' + crp_id + '&';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data.objects;
            });
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
        search_tearm = encodeURIComponent(search_term);
        
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'entities.json?search=' + search_tearm + '&type=organization&';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });        
    }
    
    this.get_organization_by_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'entities/' + entity_id + '.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return new Organization(data.data);
            });
    }
    
    this.get_legislator_by_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'entities/' + entity_id + '.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return new Legislator(data.data);
            });
    }
    
    this._get_recipients_for_organization_entity_id = function(entity_id, type){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/' + type + '.json?';
        return this._jsonp_request(endpoint, 
            function(data){
                return data.data;
            });    
    }
    
    this.get_top_recipients_for_organization_entity_id = function(entity_id){
        return this._get_recipients_for_organization_entity_id(entity_id, 'recipients');
    };
    
    this.get_top_pac_recipients_for_organization_entity_id = function(entity_id){
        return this._get_recipients_for_organization_entity_id(entity_id, 'recipient_pacs');
    }; 
    
    this.get_recipient_party_breakdown_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/recipients/party_breakdown.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            return new RecipientPartyBreakdown(data.data);
        });    
    }
    
    this.get_govt_level_breakdown_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/recipients/level_breakdown.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            return new GovtLevelBreakdown(data.data);
        });    
    }
 
    this.get_lobby_firms_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/registrants.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            return data.data
        });    
    }

    this.get_individual_lobbyists_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/lobbyists.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            return data.data
        });    
    }

    this.get_lobbying_issues_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/issues.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            return data.data
        });    
    }

    this.get_lobbying_bills_for_organization_entity_id = function(entity_id){
        var endpoint = TRANSPARENCY_DATA_ROOT_URI + 'aggregates/org/' + entity_id + '/bills.json?';
        return this._jsonp_request(endpoint, 
        function(data){
            // Some of the bill titles are empty
            return _.filter(data.data, function(bill){
                return bill.title;
            });
        });    
    }
});