function Vote(data) {
   _.extend(this, data);
}

Vote.prototype.get_vote_for = function(bioguide_id) {
   return this.voters[bioguide_id].vote;
}

Vote.prototype.get_democrat_votes = function(){
	return this.breakdown.party.D;
}

Vote.prototype.get_republican_votes = function(){
	return this.breakdown.party.R;
}

Vote.prototype.get_total_votes = function(){
	return this.breakdown.total;
}

