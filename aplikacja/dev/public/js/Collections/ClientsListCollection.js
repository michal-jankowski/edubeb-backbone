(function() {

APP.Collections.ClientsList = Backbone.Collection.extend({

	model: APP.Models.Client,

	url: "/clients" // adres z którego na serwerze mają być pobierani klienci

});

})();