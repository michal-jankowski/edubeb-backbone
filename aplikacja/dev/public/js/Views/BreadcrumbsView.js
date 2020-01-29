(function() {

APP.Views.Breadcrumbs = Backbone.View.extend({

	tagName: "div",
	className: "app-breadcrumbs",

	template: _.template( $("#breadcrumbsWidgetTemplate").html() ),

	initialize: function() {

		// będziemy chcieli renderować ścieżkę powrotu za każdym razem, jak zmieni się nam podstrona, nasłuchujemy na zdarzenie 'route'
		this.listenTo(APP.router, "route", this.render);

	},

	render: function() {

		var html = this.template( {pathItems: this.getPathItems()} );

		this.$el.html(html); // '$el' - wksazuje na element div z klasą 'app-breadcrumbs', który został określony na górze widoku

		APP.Regions.appHeader.prepend(this.el);

	},

	getPathItems: function() {

		var regex = /movies|movie|actors|actor|categories|category|rents|rent|clients|client/ig,
            test = regex.exec(window.location.pathname);

        var texts = {

            "movies": "Filmy",
            "actors": "Aktorzy",
            "categories": "Kategorie",
            "rents": "Wypożyczenia",
            "clients": "Klienci",

            "movie": "Szczegóły filmu",
            "actor": "Dane aktora",
            "category": "Szczegóły kategorii",
            "rent": "Szczegóły wypożyczenia",
            "client": "Dane klienta",

            "movie:edit": "Edycja filmu",
            "movies:new": "Nowy film",
            "actor:edit": "Edycja aktora",
            "actors:new": "Nowy aktor",
            "category:edit": "Edycja kategorii",
            "categories:new": "Nowa kategoria",
            "rent:edit": "Edycja wypożyczenia",
            "rents:new": "Nowe wypożyczenie",
            "client:edit": "Edycja klienta",
            "clients:new": "Nowy klient"

        };

        // console.log(test);

        var pathItems = ["Kokpit"];

        if(test !== null) {

        	var page = test[0],
        		isEditOrNew = test.input.match(/\/(edit|new)$/);

        	// console.log(isEditOrNew[1]);

        	var suffix = isEditOrNew ? ":" + isEditOrNew[1] : "";

        	pathItems.push(texts[page + suffix]);

        }

        return pathItems;

	}

});

})();