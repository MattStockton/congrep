var legislator_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {

    $scope.reset = function(){
        $scope.legislator = undefined;
        $scope.top_donors = [];
        $scope.top_phrases = [];
        $scope.top_contributing_industries = [];
        $scope.top_contributing_sectors = [];
        $scope.contribution_breakdown = {};
        $scope.independent_expenditures = [];
        $scope.committees = [];
        $scope.bills_sponsored = [];
        $scope.votes = [];
        $scope.events = [];       
    }
    
    $scope.run_search = function(bioguide_id){
        $scope.reset();
        congress_service.get_legislator_by_bioguide_id(bioguide_id).then(
            function(legislator){
                $scope.legislator = legislator;
                
                $scope.get_top_phrases(bioguide_id);   
                $scope.get_committees(bioguide_id); 
                $scope.get_bills_sponsored(bioguide_id);
                $scope.get_votes(bioguide_id);
                $scope.get_events(legislator.crp_id);
                
                congress_service.get_entity_id_from_bioguide_id(bioguide_id).then(
                    function(entity_id){
                        $scope.legislator.entity_id = entity_id;
                        
                        $scope.get_top_donors(entity_id);
                        $scope.get_top_contributing_industries(entity_id);
                        $scope.get_top_contributing_sectors(entity_id);
                        $scope.get_contribution_breakdown(entity_id);
                        $scope.get_independent_expenditures(entity_id);
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
        congress_service.get_top_phrases_by_bioguide_id(bioguide_id).then(
            function(data){
                $scope.top_phrases = data;
            }
        );  
    };
    
    $scope.get_committees = function(bioguide_id){
        congress_service.get_committees_by_bioguide_id(bioguide_id).then(
            function(data){
                $scope.committees = data;
            }
        );  
    };

    $scope.get_bills_sponsored = function(bioguide_id){
        congress_service.get_bills_sponsored_by_bioguide_id(bioguide_id).then(
            function(data){
                $scope.bills_sponsored = data;
            }
        );  
    };

    $scope.get_votes = function(bioguide_id){
        congress_service.get_votes_by_bioguide_id(bioguide_id).then(
            function(data){
                $scope.votes = data;
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

    $scope.get_top_contributing_sectors = function(entity_id){     
        congress_service.get_top_contributing_sectors_by_entity_id(entity_id).then(
            function(data){
                $scope.top_contributing_sectors = data;
            }
        );  
    };

    $scope.get_contribution_breakdown = function(entity_id){     
        congress_service.get_contribution_breakdown_by_entity_id(entity_id).then(
            function(data){
                $scope.contribution_breakdown = data;
            }
        );  
    };

    $scope.get_independent_expenditures = function(entity_id){  
        congress_service.get_independent_expenditures_by_entity_id(entity_id).then(
            function(data){
                $scope.independent_expenditures = data;
            }
        );  
    };
 
    $scope.get_events = function(crp_id){  
        congress_service.get_events_by_crp_id(crp_id).then(
            function(data){
                $scope.events = data;
            }
        );  
    };    
    
    $scope.get_sector_name = function(sector){
        return congress_service.get_sector(sector);
    }
    
    $scope.go_to_legislator = function(bioguide_id){
        $location.path( 'legislator/' + bioguide_id);
    };
    
    $scope.go_to_donor = function(donor){
        $location.path('organization/' + donor.id);
    };

    $scope.run_search($routeParams.bioguide_id);
};

var congress_search_ctrl = function ($scope, $http, $window, $q, $location, congress_service) {
    $scope.congress_search_text = "";
    $scope.organization_search_text = ""
    $scope.search_error = undefined;
    $scope.legislator_search_results = [];
    $scope.organization_search_results = [];
    
    $scope.search_legislators = function(){
        congress_service.search_for_legislators($scope.congress_search_text).then(
            function(legislators){
                if(legislators.length == 1){
                    $scope.go_to_legislator(legislators[0]);
                    return;
                } else if(legislators.length > 1){
                    $scope.legislator_search_results = legislators;
                } else {
                    $scope.search_error = "No results found";
                }
            }
        );  
    };

    $scope.search_organizations = function(){
        congress_service.search_for_organizations($scope.organization_search_text).then(
                function(organizations){
                    if(organizations.length == 1){
                        $scope.go_to_organization(organizations[0]);
                        return;
                    } else if(organizations.length > 1){
                        $scope.organization_search_results = organizations;
                    } else {
                        $scope.search_error = "No results found";
                    }
                }
            );  
    };
    
    $scope.go_to_legislator = function(legislator){
        $location.path('legislator/' + legislator.bioguide_id);
    };
    
    $scope.go_to_organization = function(organization){
        $location.path('organization/' + organization.id);
    };
}

var organization_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {

    $scope.reset = function(){
        $scope.organization = undefined;
        $scope.top_recipients = [];
        $scope.top_pac_recipients = [];
        $scope.recipient_party_breakdown = undefined;
        $scope.govt_level_breakdown = undefined;
        $scope.lobby_firms = [];
        $scope.individual_lobbyists = [];
        $scope.lobbying_issues = [];
        $scope.lobbying_bills = [];
    }
    
    $scope.run_search = function(entity_id){
        $scope.reset();
        
        congress_service.get_organization_by_entity_id(entity_id).then(
            function(organization){
                $scope.organization = organization;
            }
        );  
        
        $scope.get_top_recipients(entity_id);   
        $scope.get_top_pac_recipients(entity_id); 
        $scope.get_recipient_party_breakdown(entity_id);
        $scope.get_govt_level_breakdown(entity_id);
        $scope.get_lobby_firms(entity_id);
        $scope.get_individual_lobbyists(entity_id);
        $scope.get_lobbying_issues(entity_id);
        $scope.get_lobbying_bills(entity_id);
    }
    
    $scope.get_top_recipients = function(entity_id){
        congress_service.get_top_recipients_for_organization_entity_id(entity_id).then(
            function(data){
                $scope.top_recipients = data;
            }
        );  
    }

    $scope.get_top_pac_recipients = function(entity_id){
        congress_service.get_top_pac_recipients_for_organization_entity_id(entity_id).then(
            function(data){
                $scope.top_pac_recipients = data;
            }
        );  
    }
    
    $scope.get_recipient_party_breakdown = function(entity_id){
        congress_service.get_recipient_party_breakdown_for_organization_entity_id(entity_id).then(
            function(recipient_party_breakdown){
                $scope.recipient_party_breakdown = recipient_party_breakdown;
            }
        );  
    }
    
    $scope.get_govt_level_breakdown = function(entity_id){
        congress_service.get_govt_level_breakdown_for_organization_entity_id(entity_id).then(
            function(govt_level_breakdown){
                $scope.govt_level_breakdown = govt_level_breakdown;
            }
        );  
    }

    $scope.get_lobby_firms = function(entity_id){
        congress_service.get_lobby_firms_for_organization_entity_id(entity_id).then(
            function(lobby_firms){
                $scope.lobby_firms = lobby_firms;
            }
        );  
    }
    
    $scope.get_individual_lobbyists = function(entity_id){
        congress_service.get_individual_lobbyists_for_organization_entity_id(entity_id).then(
            function(individual_lobbyists){
                $scope.individual_lobbyists = individual_lobbyists;
            }
        );  
    }

    $scope.get_lobbying_issues = function(entity_id){
        congress_service.get_lobbying_issues_for_organization_entity_id(entity_id).then(
            function(lobbying_issues){
                $scope.lobbying_issues = lobbying_issues;
            }
        );  
    }

    $scope.get_lobbying_bills = function(entity_id){
        congress_service.get_lobbying_bills_for_organization_entity_id(entity_id).then(
            function(lobbying_bills){
                $scope.lobbying_bills = lobbying_bills;
            }
        );  
    }

    $scope.go_to_recipient = function(recipient){
        congress_service.get_legislator_by_entity_id(recipient.id).then(
            function(legislator){
                $location.path('legislator/' + legislator.get_bioguide_id());
            }
        );  
    }
 
    $scope.go_to_pac_recipient = function(recipient){
        alert("Go to PAC recipient");
    }    

    $scope.run_search($routeParams.entity_id);
}


congress_app.controller('legislator_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', legislator_detail_ctrl]);
congress_app.controller('congress_search_ctrl', ['$scope', '$http', '$window', '$q', '$location', 'congress_service', congress_search_ctrl]);
congress_app.controller('organization_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', organization_detail_ctrl]);

