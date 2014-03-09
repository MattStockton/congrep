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

Vote.prototype.has_bill_sponsor = function(){
    return this.bill && this.bill.sponsor;
}

Vote.prototype.get_sponsor_full_name = function(){
    return this.has_bill_sponsor() ? this.bill.sponsor.first_name + ' ' + this.bill.sponsor.last_name : "";
}

Vote.prototype.get_sponsor_bioguide_id = function(){
    return this.has_bill_sponsor() ? this.bill.sponsor_id : undefined;
}


function Organization(data) {
    _.extend(this, data);
}

Organization.prototype.get_bio_url = function(){
    return this.metadata.bio_url;
}

Organization.prototype.get_bio_url = function(){
    return this.metadata.bio_url;
}

Organization.prototype.get_photo_url = function(){
    return this.metadata.photo_url;
}

Organization.prototype.get_name = function(){
    return this.name;
}
