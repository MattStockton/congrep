
var congress_service = angular.module('congress_service', []);

//service style, probably the simplest one
congress_service.service('congress_service', function() {
	
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
	
	
    this.get_sector = function(sector_id) {
        return SECTOR_LOOKUP[sector_id];
    };
});

