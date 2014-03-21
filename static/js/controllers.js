var legislator_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {

    $scope.reset = function(bioguide_id){
        $scope.bioguide_id = bioguide_id;
        $scope.entity_id = undefined;
        $scope.year = undefined;
        $scope.legislator = undefined;
        $scope.top_donors = [];
        $scope.top_phrases = [];
        $scope.top_contributing_industries = [];
        $scope.top_contributing_sectors = [];
        $scope.contribution_breakdown = {};
        $scope.independent_expenditures = [];
        $scope.committees = [];
        $scope.bills_sponsored = [];
        $scope.bill_pagination = undefined;
        $scope.votes = [];
        $scope.vote_pagination = undefined;
        $scope.events = [];       
    }
    
    $scope.run_search = function(bioguide_id){
        $scope.reset(bioguide_id);
        congress_service.get_legislator_by_bioguide_id(bioguide_id).then(
            function(legislator){
                $scope.legislator = legislator;
                
                $scope.get_top_phrases(bioguide_id, $scope.year);   
                $scope.get_committees(bioguide_id); 
                $scope.get_bills_sponsored(bioguide_id, $scope.year, 1);
                $scope.get_votes(bioguide_id, $scope.year, 1);
                $scope.get_events(legislator.crp_id, $scope.year);
                
                congress_service.get_entity_id_from_bioguide_id(bioguide_id).then(
                    function(entity_id){
                        $scope.entity_id = entity_id;
                        
                        $scope.get_top_donors($scope.entity_id, $scope.year);
                        $scope.get_top_contributing_industries($scope.entity_id, $scope.year);
                        $scope.get_top_contributing_sectors($scope.entity_id, $scope.year);
                        $scope.get_contribution_breakdown($scope.entity_id, $scope.year);
                        $scope.get_independent_expenditures($scope.entity_id);
                    }
                );
            }
        );
    }
  
    $scope.get_top_donors = function(entity_id, year){
        congress_service.get_top_donors_by_entity_id(entity_id, year).then(
            function(data){
                $scope.top_donors = data;
            }
        );  
    }
    
    $scope.get_top_phrases = function(bioguide_id, year){
        congress_service.get_top_phrases_by_bioguide_id(bioguide_id, year).then(
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

    $scope.get_bills_sponsored = function(bioguide_id, year, page_number){
        congress_service.get_bills_sponsored_by_bioguide_id(bioguide_id, year, page_number).then(
            function(data){
                $scope.bills_sponsored = data.bills;
                $scope.bill_pagination = data.pagination;
            }
        );  
    };

    $scope.get_votes = function(bioguide_id, year, page_number){
        congress_service.get_votes_by_bioguide_id(bioguide_id, year, page_number).then(
            function(data){
                $scope.votes = data.votes;
                $scope.vote_pagination = data.pagination;
            }
        );  
    };
    
    $scope.get_top_contributing_industries = function(entity_id, year){     
        congress_service.get_top_contributing_industries_by_entity_id(entity_id, year).then(
            function(data){
                $scope.top_contributing_industries = data;
            }
        );  
    };

    $scope.get_top_contributing_sectors = function(entity_id, year){     
        congress_service.get_top_contributing_sectors_by_entity_id(entity_id, year).then(
            function(data){
                $scope.top_contributing_sectors = data;
            }
        );  
    };

    $scope.get_contribution_breakdown = function(entity_id, year){     
        congress_service.get_contribution_breakdown_by_entity_id(entity_id, year).then(
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
 
    $scope.get_events = function(crp_id, year){  
        congress_service.get_events_by_crp_id(crp_id, year).then(
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
    
    $scope.go_to_bill = function(bill){
        $location.path('bill/' + bill.bill_id);
    };
    
    $scope.filter_by_year = function(year){
        $scope.year = year;
        
        $scope.get_top_phrases($scope.bioguide_id, $scope.year);   
        $scope.get_bills_sponsored($scope.bioguide_id, $scope.year, 1);
        $scope.get_votes($scope.bioguide_id, $scope.year, 1);
        $scope.get_events($scope.legislator.crp_id, $scope.year);
        $scope.get_top_donors($scope.entity_id, $scope.year);
        $scope.get_top_contributing_industries($scope.entity_id, $scope.year);
        $scope.get_top_contributing_sectors($scope.entity_id, $scope.year);
        $scope.get_contribution_breakdown($scope.entity_id, $scope.year);
    }
    
    $scope.load_vote_page = function(page_number){
        $scope.get_votes($scope.bioguide_id, $scope.year, page_number);
    }
    
    $scope.load_bill_page = function(page_number){
        $scope.get_bills_sponsored($scope.bioguide_id, $scope.year, page_number);
    }

    $scope.run_search($routeParams.bioguide_id);
};

var congress_search_ctrl = function ($scope, $http, $window, $q, $location, congress_service) {
    $scope.congress_search_text = "";
    $scope.organization_search_text = "";
    $scope.bill_search_text = "";
    $scope.search_error = undefined;
    $scope.legislator_search_results = [];
    $scope.organization_search_results = [];
    $scope.bill_search_results = [];
    
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

    $scope.search_bills = function(){
        congress_service.search_for_bills($scope.bill_search_text).then(
                function(bills){
                    if(bills.length == 1){
                        $scope.go_to_bill(bills[0]);
                        return;
                    } else if(bills.length > 1){
                        $scope.bill_search_results = bills;
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
    
    $scope.go_to_bill = function(bill){
        $location.path('bill/' + bill.bill_id);
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
        $scope.regulatory_docket_mentions = [];
        $scope.regulatory_docket_submissions = [];
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
        $scope.get_regulatory_docket_mentions(entity_id);
        $scope.get_regulatory_docket_submissions(entity_id);
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

    $scope.get_regulatory_docket_mentions = function(entity_id){
        congress_service.get_regulatory_docket_mentions_for_organization_entity_id(entity_id).then(
            function(regulatory_docket_mentions){
                $scope.regulatory_docket_mentions = regulatory_docket_mentions;
            }
        );  
    }
    
    $scope.get_regulatory_docket_submissions = function(entity_id){
        congress_service.get_regulatory_docket_submissions_for_organization_entity_id(entity_id).then(
            function(regulatory_docket_submissions){
                $scope.regulatory_docket_submissions = regulatory_docket_submissions;
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
 
    $scope.go_to_lobbyist = function(lobbyist){
        $location.path('lobbyist/' + lobbyist.lobbyist_entity);
    }    
    
    $scope.go_to_pac_recipient = function(recipient){
        alert("Go to PAC recipient");
    }    

    $scope.run_search($routeParams.entity_id);
}

var bill_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    
    $scope.reset = function(){
        $scope.bill = undefined;
    }
    
    $scope.run_search = function(bill_id){
        $scope.reset();
        
        congress_service.get_bill_by_bill_id(bill_id).then(
            function(bill){
                $scope.bill = bill;
            }
        ); 
    }
    
    $scope.go_to_legislator = function(bioguide_id){
        $location.path( 'legislator/' + bioguide_id);
    };

    $scope.run_search($routeParams.bill_id);
}

var lobbyist_detail_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    
    $scope.reset = function(){
        $scope.lobbying_firms = [];
        $scope.lobbying_clients = [];
        $scope.lobbying_issues = [];
    }
    
    $scope.run_search = function(entity_id){
        $scope.reset();
        
        $scope.get_lobbying_firms(entity_id);
        $scope.get_lobbying_clients(entity_id);
        $scope.get_lobbying_issues(entity_id);
    }
    
    $scope.get_lobbying_firms = function(entity_id){
        congress_service.get_lobbying_firms_for_individual_entity_id(entity_id).then(
            function(lobbying_firms){
                $scope.lobbying_firms = lobbying_firms;
            }
        );  
    }

    $scope.get_lobbying_clients = function(entity_id){
        congress_service.get_lobbying_clients_for_individual_entity_id(entity_id).then(
            function(lobbying_clients){
                $scope.lobbying_clients = lobbying_clients;
            }
        );  
    }
    
    $scope.get_lobbying_issues = function(entity_id){
        congress_service.get_lobbying_issues_for_individual_entity_id(entity_id).then(
            function(lobbying_issues){
                $scope.lobbying_issues = lobbying_issues;
            }
        );  
    }
    
    $scope.go_to_client = function(client){
        $location.path( 'organization/' + client.client_entity);
    }    
    
    $scope.go_to_firm = function(firm){
        $location.path( 'organization/' + firm.registrant_entity);
    } 

    $scope.run_search($routeParams.entity_id);
}

var index_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    $scope.go_to_search = function(){
        $location.path('search');
    }; 
    
    $scope.go_to_about = function(){
        $location.path('about');
    }; 
}

var about_ctrl = function ($scope, $http, $window, $q, $location, $routeParams, congress_service) {
    $scope.go_to_search = function(){
        $location.path('search');
    }; 
}

congress_app.controller('legislator_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', legislator_detail_ctrl]);
congress_app.controller('congress_search_ctrl', ['$scope', '$http', '$window', '$q', '$location', 'congress_service', congress_search_ctrl]);
congress_app.controller('organization_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', organization_detail_ctrl]);
congress_app.controller('bill_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', bill_detail_ctrl]);
congress_app.controller('lobbyist_detail_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', lobbyist_detail_ctrl]);
congress_app.controller('index_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', index_ctrl]);
congress_app.controller('about_ctrl', ['$scope', '$http', '$window', '$q', '$location', '$routeParams', 'congress_service', about_ctrl]);
