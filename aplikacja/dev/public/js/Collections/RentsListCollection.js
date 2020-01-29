(function() {

APP.Collections.RentsList = Backbone.Collection.extend({

	model: APP.Models.Rent,

	url: "/rents" // adres z którego na serwerze ma byc pobierana lista wypożyczen

});

})();