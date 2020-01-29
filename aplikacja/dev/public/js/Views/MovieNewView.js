(function() {

APP.Views.MovieNew = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#movieEditNewTemplate").html() ),

	initialize: function() {

		this.listenTo(this.model, "sync", this.redirectToEdit); // "sync" - odpali się kiedy nowy model zostanie utworzony
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
		/* TYMI PONIŻEJ ZAJMIE SIĘ WTYCZKA MAGICSUGGEST */
			// "#movie-categories": {
			// 	observe: "categories",
			// 	onSet: function(values) {
			// 		return values.split(","); // to co ta funkcja zwróci, zostanie ustawione na odpowiedniej właściwości obiektu (tutaj "categories")
			// 	}
			// },
			// "#movie-actors": {
			// 	observe: "actors",
			// 	onSet: function(values) {
			// 		return values.split(",");
			// 	}
			// },
		/* MAGICSUGGEST end */
		"#movie-description": "description",
		"#movie-quantity": "quantity"
	},

	events: {
		"submit form": "saveMovie"
	},

	saveMovie: function(e) {

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
		
		APP.router.navigate("movie/" + this.model.get("_id") + "/edit", {trigger: true});

	}

})

})();