(function() {

APP.Models.Client = Backbone.Model.extend({

	idAttribute: "_id", // bo zwracane dane mają właściwość '_id'

	// 'defaults' do walidacji - wartości, które powinny być w modelu
	defaults: {
        first_name: "",
        last_name: "",
        birthdate: "",
        idc_number: "",
        address: "",
        zip_code: "",
        city: ""
    },

    validate: function(attrs, options) {

        if(attrs.first_name === "" || attrs.last_name === "") {
            return "Musisz podać imię i nazwisko klienta.";
        }

        if(!attrs.birthdate.match(/^(\d{2}-\d{2}-\d{4})$/)) {
            return "Musisz podać poprawną datę urodzenia.";
        }

        if(!attrs.idc_number.match(/^([a-z]{3}\d{6})$/i)) {
            return "Musisz podać poprawny numer dowodu osobistego.";
        }

        if(attrs.address === "") {
            return "Musisz podać poprawny adres.";
        }

        if(!attrs.zip_code.match(/^(\d{2}-\d{3})$/)) {
            return "Musisz podać poprawny kod pocztowy.";
        }

        if(attrs.city === "") {
            return "Musisz podać poprawną nazwę miejscowości.";
        }

    },

	url: function() {

		if(this.isNew()) {
			return "/clients"; // będzie to przydatne do dodawania elementów, kiedy będziemy je wysyłać żądaniem POST
		} else {
			return "/client/" + this.get("_id");
		}

	}

});

})();