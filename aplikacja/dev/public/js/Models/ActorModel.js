(function() {

APP.Models.Actor = Backbone.Model.extend({

	idAttribute: "_id", // bo zwracane dane mają właściwość '_id'

	// 'defaults' do walidacji - wartości, które powinny być w modelu
	defaults: {
        name: ""
    },

    validate: function(attrs, options) {

        if(attrs.name === "") {
            return "Musisz podać imię i nazwisko aktora.";
        }

    },

	url: function() {

		if(this.isNew()) {
			return "/actors"; // będzie to przydatne do dodawania elementów, kiedy będziemy je wysyłać żądaniem POST
		} else {
			return "/actor/" + this.get("_id");
		}

	}

});

})();