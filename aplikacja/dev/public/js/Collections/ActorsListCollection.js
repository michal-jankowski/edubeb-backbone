(function() {

APP.Collections.ActorsList = Backbone.Collection.extend({

	model: APP.Models.Actor,

	url: "/actors" // adres z którego na serwerze mają być pobierani aktorzy

});

})();