(function() {

APP.Routers.Router = Backbone.Router.extend({

	initialize: function() {

		this.route("", "movies-list");
        this.route("movies(/page/:page)(/order/:order)(/search/:search)", "movies-list");
        this.route("actors(/page/:page)(/order/:order)(/search/:search)", "actors-list");
        this.route("categories(/page/:page)(/order/:order)(/search/:search)", "categories-list");
        this.route("rents(/page/:page)(/order/:order)(/search/:search)", "rents-list");
        this.route("clients(/page/:page)(/order/:order)(/search/:search)", "clients-list");

	},

	routes: {

		"movie/:id": "showMovieDetails",
		"actor/:id": "showActorDetails",
		"category/:id": "showCategoryDetails",
		"client/:id": "showClientDetails",
		"rent/:id": "showRentDetails",

		"movie/:id/edit": "showMovieEdit",
		"actor/:id/edit": "showActorEdit",
		"category/:id/edit": "showCategoryEdit",
		"client/:id/edit": "showClientEdit",
		"rent/:id/edit": "showRentEdit",

		"movies/new": "showMovieNew",
		"actors/new": "showActorNew",
		"categories/new": "showCategoryNew",
		"clients/new": "showClientNew",
		"rents/new": "showRentNew"
	},

	showMovieDetails: function(id) {

		var movie = new APP.Models.Movie({_id: id}),
			view = new APP.Views.MovieDetails({model: movie});

		APP.showMainView(view);

		movie.fetch();

		APP.Views.Navigation.highlight("movies");

	},

	showActorDetails: function(id) {

		var actor = new APP.Models.Actor({_id: id}),
			view = new APP.Views.ActorDetails({model: actor});

		APP.showMainView(view);

		actor.fetch();

		APP.Views.Navigation.highlight("actors");

	},

	showCategoryDetails: function(id) {

		var category = new APP.Models.Category({_id: id}),
			view = new APP.Views.CategoryDetails({model: category});

		APP.showMainView(view);

		category.fetch();

		APP.Views.Navigation.highlight("categories");

	},

	showClientDetails: function(id) {

		var client = new APP.Models.Client({_id: id}),
			view = new APP.Views.ClientDetails({model: client});

		APP.showMainView(view);

		client.fetch();

		APP.Views.Navigation.highlight("clients");

	},

	showRentDetails: function(id) {

		var rent = new APP.Models.Rent({_id: id}),
			view = new APP.Views.RentDetails({model: rent});

		APP.showMainView(view);

		rent.fetch();

		// APP.Views.Navigation.highlight("rents");

	},

	showMovieEdit: function(id) {

		var movie = new APP.Models.Movie({_id: id}),
			view = new APP.Views.MovieEdit({model: movie});

		APP.showMainView(view);

		movie.fetch();

		APP.Views.Navigation.highlight("movies");
		
	},

	showActorEdit: function(id) {

		var movie = new APP.Models.Actor({_id: id}),
			view = new APP.Views.ActorEdit({model: movie});

		APP.showMainView(view);

		movie.fetch();

		APP.Views.Navigation.highlight("actors");
		
	},

	showCategoryEdit: function(id) {

		var movie = new APP.Models.Category({_id: id}),
			view = new APP.Views.CategoryEdit({model: movie});

		APP.showMainView(view);

		movie.fetch();

		APP.Views.Navigation.highlight("categories");
		
	},

	showClientEdit: function(id) {

		var movie = new APP.Models.Client({_id: id}),
			view = new APP.Views.ClientEdit({model: movie});

		APP.showMainView(view);

		movie.fetch();

		APP.Views.Navigation.highlight("clients");
		
	},

	showRentEdit: function(id) {

		var rent = new APP.Models.Rent({_id: id}),
			view = new APP.Views.RentEdit({model: rent});

		APP.showMainView(view);

		rent.fetch();

		APP.Views.Navigation.highlight("rents");
		
	},

	showMovieNew: function(id) {

		var movie = new APP.Models.Movie(),
			view = new APP.Views.MovieNew({model: movie});

		APP.showMainView(view);

		APP.Views.Navigation.highlight("movies");

	},

	showActorNew: function(id) {

		var actor = new APP.Models.Actor(),
			view = new APP.Views.ActorNew({model: actor});

		APP.showMainView(view);

		APP.Views.Navigation.highlight("actors");

	},

	showCategoryNew: function(id) {

		var category = new APP.Models.Category(),
			view = new APP.Views.CategoryNew({model: category});

		APP.showMainView(view);

		APP.Views.Navigation.highlight("categories");

	},

	showClientNew: function(id) {

		var client = new APP.Models.Client(),
			view = new APP.Views.ClientNew({model: client});

		APP.showMainView(view);

		APP.Views.Navigation.highlight("clients");

	},

	showRentNew: function(id) {

		var rent = new APP.Models.Rent(),
			view = new APP.Views.RentNew({model: rent});

		APP.showMainView(view);

		APP.Views.Navigation.highlight("rents");

	}

});

})();