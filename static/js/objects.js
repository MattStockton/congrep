function PaginationInfo(data){
   _.extend(this, data);
   this.pagination_width = 5;
}

PaginationInfo.prototype.get_total_count = function() {
       return this.count;
}

PaginationInfo.prototype.get_current_page_count = function() {
       return this.page.count;
}

PaginationInfo.prototype.get_current_page = function() {
       return this.page.page;
}

PaginationInfo.prototype.get_count_per_page = function() {
       return this.page.per_page;
}

PaginationInfo.prototype.get_total_pages = function() {
    if(this.count && this.page){
        return Math.ceil(this.get_total_count() / this.get_count_per_page());    
    }
    return 0;
}

PaginationInfo.prototype.get_pages_to_show = function(){
    var start_range = Math.max(1, this.get_current_page() - this.pagination_width);
    var end_range = Math.min(this.get_total_pages(), this.get_current_page() + this.pagination_width);
    
    return _.range(start_range, end_range);    
}

PaginationInfo.prototype.has_previous = function(){
    return this.get_current_page() - this.pagination_width > 1;
}

PaginationInfo.prototype.has_next = function(){
    return this.get_total_pages() > this.get_current_page() + this.pagination_width;
}

PaginationInfo.prototype.get_next_link_page = function(){
    return this.get_current_page() + this.pagination_width;
}

PaginationInfo.prototype.get_previous_link_page = function(){
    return this.get_current_page() - this.pagination_width;
}

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

Organization.prototype.get_photo_url = function(){
    return this.metadata.photo_url;
}

Organization.prototype.get_name = function(){
    return this.name;
}


function Legislator(data) {
    _.extend(this, data);
}

Legislator.prototype.get_bioguide_id = function(){
    return this.metadata.bioguide_id;
}

function RecipientPartyBreakdown(data) {
    _.extend(this, data);
}

RecipientPartyBreakdown.prototype.get_raw = function(){
    return this;
}

function GovtLevelBreakdown(data) {
    _.extend(this, data);
}

GovtLevelBreakdown.prototype.get_raw = function(){
    return this;
}

function Bill(data) {
    _.extend(this, data);
}


