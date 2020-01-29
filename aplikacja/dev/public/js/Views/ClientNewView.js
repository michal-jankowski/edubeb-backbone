(function() {

APP.Views.ClientNew = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#clientEditNewTemplate").html() ),

	initialize: function() {

		this.listenTo(this.model, "sync", this.redirectToEdit); // "sync" - jeśli model zostanie zsynchornizowany z serwerem
		this.listenToOnce(this.model, "sync", this.showAddedInfo);
		this.listenToOnce(this.model, "sync", APP.showStatisticsView);
        this.listenTo(this.model, "invalid", this.showErrorInfo);

		this.render(); // od razu rendereujemy widok, bo nic nie pobieramy z serwera (nie pobieramy żadnego modelu, bo sami tworzymy nowy model)

	},

	render: function() {

		var html = this.template( this.model.toJSON() ),
			model = this.model;

		this.$el.html(html);

		APP.Regions.appContent.html(this.el);

		this.stickit(); // wywołujemy taką metodę, żeby zadziałał bindings

		// BEATPICKER
	    var beatPicker = new BeatPicker({
	    	dateInputNode: this.$("#client-birth-date"),
	    	modules: {
			    footer: false,
			    icon: false,
			    clear: false
			},
	    	dateFormat: {
	    		format: ["DD", "MM", "YYYY"]
	    	}
	    });

	    beatPicker.on("change", function(obj) {

	    	model.set("birthdate", obj.string);

	    });
	    // BEATPICKER end

	    return this; // zwracanie 'this' w render jest to dobra praktyka... (hmmm... tylko jeszcze nie wiem dlaczego...)
		
	},

	bindings: {
		"#client-first-name": "first_name", // 'first_name' to właściwość naszego modelu, a '#client-first-name' to identyfikator z naszej templatki (element do którego dane powinny zostać wstawione). Dodatkowo, jeżeli coś w tym elemencie '#client-first-name' zmienimy, to model zostanie zaktualizowany
		"#client-last-name": "last_name",
		"#client-birth-date": "birthdate",
		"#client-id-number": "idc_number",
		"#client-address": "address",
		"#client-zip-code": "zip_code",
		"#client-city": "city"
	},

	events: {
		"submit form": "saveClient"
	},

	saveClient: function(e) {

		e.preventDefault();

		this.model.save({}, {wait: true});

	},

	showAddedInfo: function() {

        var zd = new $.Zebra_Dialog("Rekord został poprawnie zapisany.", {
            type: "information",
            title: "Zapisano"
        });

    },

    showErrorInfo: function(model) {

        var zd = new $.Zebra_Dialog(model.validationError, {
            type: "error",
            title: "Wystąpił błąd"
        });

    },

	redirectToEdit: function() {
		
		APP.router.navigate("client/" + this.model.get("_id") + "/edit", {trigger: true});

	}

})

})();