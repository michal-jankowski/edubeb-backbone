(function() {

APP.Collections.CategoriesList = Backbone.Collection.extend({

	model: APP.Models.Category,

	url: "/categories" // adres z którego na serwerze mają być pobierane kategorie

});

})();