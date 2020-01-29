(function() {

APP.Models.Rent = Backbone.Model.extend({

	idAttribute: "_id", // bo zwracane dane mają właściwość '_id'

	// 'defaults' do walidacji - wartości, które powinny być w modelu
	defaults: {
        movie_id: "",
        client_id: "",
        date: ""
    },

    validate: function(attrs, options) {

        if(attrs.movie_id === "") {
            return "Musisz wybrać film.";
        }

        if(attrs.client_id === "") {
            return "Musisz wybrać klienta";
        }

    },

	url: function() {

		if(this.isNew()) {
			return "/rents"; // będzie to przydatne do dodawania elementów, kiedy będziemy je wysyłać żądaniem POST
		} else {
			return "/rent/" + this.get("_id");
		}

	}

});

})();