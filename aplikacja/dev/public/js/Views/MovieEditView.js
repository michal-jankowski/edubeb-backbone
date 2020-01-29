(function() {

APP.Views.MovieEdit = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#movieEditNewTemplate").html() ),

	initialize: function() {

		this.listenToOnce(this.model, "change", this.render); // 'this.listenToOnce' - żeby przy edycji, nie było wszystko za każdym razem ponownie renderowane, jeżeli cokolwiek zostanie zmienione ('this.render' wykona się tylko jeden raz, wtedy kiedy zrobimy fetcha())

		this.listenToOnce(this.model, "destroy", this.redirectToMovies);
		this.listenToOnce(this.model, "destroy", this.showRemoveInfo);
		this.listenToOnce(this.model, "destroy", APP.showStatisticsView);
        this.listenTo(this.model, "invalid", this.showErrorInfo);
        this.listenTo(this.model, "update", this.showUpdateInfo);

	},

	render: function() {

		var html = this.template( this.model.toJSON() ),
			model = this.model;

		this.$el.html(html);

		APP.Regions.appContent.html(this.el);

		this.stickit(); // wywołujemy taką metodę, żeby zadziałał bindings

		// 	MAGICSUGGEST
		var categoriesField = this.$("#ms-movie-categories").magicSuggest({
	        data: "/categories", // url z serwera, z którego bedą zwracane obiekty json z tym, co nas interesuje
	        method: "get",
	        valueField: "name",
	        displayField: "name",
	        allowFreeEntries: false,
	        toggleOnClick: true,
	        placeholder: "Wybierz kategorię",
	        queryParam: "name",
	        cls: "medium"
	    });

	    $(categoriesField).on("load", function() {
	    	// po wczytaniu się danych z serwera, uzupełniamy pole kategorii o kategorie już przypisane do modelu

	    	categoriesField.setValue(model.get("categories"));

	    });

	    // i teraz jeszcze, żeby to wszystko mogło być zapisywane w modelu, musimy przypisać stosowane zdarzenie ('selectionchange')
	    $(categoriesField).on("selectionchange", function(event, magicsuggest, categories) {

	    	if(categories.length) {
	    		model.set("categories", _.pluck(categories, "name"));
	    		this.container.addClass("selected");
	    	} else {
	    		model.set("categories", []);
	    		this.container.removeClass("selected");
	    	}

	    });

	    var actorsField = this.$("#ms-movie-actors").magicSuggest({
	        data: "/actors", // url z serwera, z którego bedą zwracane obiekty json z tym, co nas interesuje
	        method: "get",
	        valueField: "name",
	        displayField: "name",
	        allowFreeEntries: false,
	        toggleOnClick: true,
	        placeholder: "Wybierz aktorów",
	        queryParam: "name",
	        cls: "medium"
	    });

	    $(actorsField).on("load", function() {

	    	actorsField.setValue(model.get("actors"));

	    });

	    // i teraz jeszcze, żeby to wszystko mogło być zapisywane w modelu, musimy przypisać stosowane zdarzenie ('selectionchange')
	    $(actorsField).on("selectionchange", function(event, magicsuggest, actors) {

	    	if(actors.length) {
	    		model.set("actors", _.pluck(actors, "name"));
	    		this.container.addClass("selected");
	    	} else {
	    		model.set("actors", []);
	    		this.container.removeClass("selected");
	    	}

	    });
	    // 	MAGICSUGGEST end

	    // BEATPICKER
	    var beatPicker = new BeatPicker({
	    	dateInputNode: this.$("#movie-date"),
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

	    	model.set("date", obj.string);

	    });
	    // BEATPICKER end

	    return this; // zwracanie 'this' w render jest to dobra praktyka... (hmmm... tylko jeszcze nie wiem dlaczego...)
		
	},

	bindings: {
		"#movie-title": "title", // 'title' to właściwość naszego modelu, a '#movie-title' to identyfikator z naszej templatki (element do którego dane powinny zostać wstawione). Dodatkowo, jeżeli coś w tym elemencie '#movie-title' zmienimy, to model zostanie zaktualizowany
		"#movie-date": "date",
		"#movie-description": "description",
		"#movie-quantity": "quantity"
	},

	events: {
		"submit form": "updateMovie",
		"click .delete": "deleteMovie"
	},

	updateMovie: function(e) {

		e.preventDefault();

		// tych dwóch właściwości nie chcemy bezpośrednio zapisywać w bazie, więc usuwamy je przed wysłaniem na serwer 
		this.model.unset("rent_number");
		this.model.unset("available");

		var model = this.model;

		this.model.save({}, {
			wait: true,
			success: function() {
				model.trigger("update"); // jest to zdarzenie, które w Backbone nie istnieje, ale sami sobie to zdarzenie na modelu wywołujemy
			}
		});

	},

	deleteMovie: function() {

		// var confirmation = confirm("Czy na pewno chcesz usunąć?");

		// if(confirmation) {
		// 	this.model.destroy({wait: true});
		// }

		var model = this.model;

		var zd = new $.Zebra_Dialog("Czy na pewno chcesz usunąć?", {
			type: "warning",
			title: "Potwierdzenie usunięcia",
			buttons: [
				{
					caption: "Tak",
					callback: function() {
						model.destroy({wait: true});
					}
				},
				{
					caption: "Anuluj"
				}
			]
		});

	},

	showRemoveInfo: function() {

        var zd = new $.Zebra_Dialog("Rekord został usunięty.", {
            type: "information",
            title: "Usunięto"
        });

    },

    showErrorInfo: function(model) {

        var zd = new $.Zebra_Dialog(model.validationError, {
            type: "error",
            title: "Wystąpił błąd"
        });

    },

    showUpdateInfo: function() {

        var zd = new $.Zebra_Dialog("Aktualizacja przebiegła pomyślnie.", {
            type: "information",
            title: "Zaktualizowano"
        });

    },

	redirectToMovies: function() {

		APP.router.navigate("/movies", {trigger: true});

	}

})

})();