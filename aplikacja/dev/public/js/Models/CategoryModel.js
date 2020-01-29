(function() {

APP.Models.Category = Backbone.Model.extend({

	idAttribute: "_id", // bo zwracane dane mają właściwość '_id'

	// 'defaults' do walidacji - wartości, które powinny być w modelu
	defaults: {
        name: ""
    },

    validate: function(attrs, options) {

        if(attrs.name === "") {
            return "Musisz podać nazwę kategorii.";
        }

    },

	url: function() {

		if(this.isNew()) {
			return "/categories"; // będzie to przydatne do dodawania elementów, kiedy będziemy je wysyłać żądaniem POST
		} else {
			return "/category/" + this.get("_id");
		}

	}

});

})();