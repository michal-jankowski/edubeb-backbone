(function() {

APP.Models.Movie = Backbone.Model.extend({

	idAttribute: "_id", // bo zwracane dane mają właściwość '_id'

	// 'defaults' do walidacji - wartości, które powinny być w modelu
	defaults: {
        title: "",
        date: "",
        categories: [],
        actors: [],
        description: "",
        quantity: 0
    },

    validate: function(attrs, options) {

        if(attrs.title === "") {
            return "Musisz podać tytuł filmu";
        }

        if(!attrs.date.match(/^(\d{2}-\d{2}-\d{4})$/)) {
            return "Musisz podać poprawną datę produkcji.";
        }

        if(!attrs.categories.length) {
            return "Musisz wybrać przynajmniej jedną kategorię.";
        }

        if(!attrs.actors.length) {
            return "Musisz wybrać przynajmniej jednego aktora.";
        }

        if(attrs.description === "") {
            return "Musisz podać opis filmu.";
        }

        if(parseInt(attrs.quantity) < 0) {
            return "Musisz podać poprawną ilość.";
        }

    },

	url: function() {

		if(this.isNew()) {
			return "/movies"; // będzie to przydatne do dodawania elementów, kiedy będziemy je wysyłać żądaniem POST
		} else {
			return "/movie/" + this.get("_id");
		}

	}

});

})();