(function() {

APP.Collections.MoviesList = Backbone.Collection.extend({

	model: APP.Models.Movie,

	url: "/movies" // adres z którego na serwerze mają być pobierane filmy

});

})();