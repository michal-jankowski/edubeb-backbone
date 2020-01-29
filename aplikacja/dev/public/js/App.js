(function() {

window.APP = {
	// taki obiekt konfiguracyjny, który będzie przestrzenią nazw dla wszystkich obiektów, Modeli, Kolekcji etc.

	Models: {},
	Collections: {},
	Views: {},
	Routers: {},

	// REGIONY NA NASZEJ STRONIE (łatwiej będzie się potem do nich odwoływać)
	Regions: {
		appHeader: 	$(".app-header"),
		appContent: $(".app-content"),
		appSidebar: $(".app-content-sidebar")
	},

	// instancje widoków
	ViewsInstances: {},

	Vent: _.extend({}, Backbone.Events)

};

APP.Utils = {

	capitalize: function(text) {

		return text.charAt(0).toUpperCase() + text.slice(1);

	}

};

APP.showMainView = function(view) {

	if(APP.ViewsInstances.mainView) {

		var childViews = APP.ViewsInstances.mainView.childViews;

		if(childViews) {

			_.each(childViews, function(childView) {

				childView.remove();
				
			});
			
		}
		
		APP.ViewsInstances.mainView.remove(); // cały widok zostanie usunięty, zdarzenia zostaną odbindowane; dzięki temu zarządzanie pamięcią zostanie dobrze zorganizowane
	}

	APP.ViewsInstances.mainView = view;

};

APP.showLatestRentsView = function() {

	if(APP.ViewsInstances.latestRents) {

		APP.ViewsInstances.latestRents.remove();

	}

	var latestRents = new APP.Collections.RentsList();

	APP.ViewsInstances.latestRents = new APP.Views.LatestRents({collection: latestRents});

	latestRents.fetch({
		reset: true,
		data: {
			limit: 3,
			order: -1
		}
	});

};

APP.showStatisticsView = function() {

	if(APP.ViewsInstances.statistics) {

		APP.ViewsInstances.statistics.remove();

	}

	APP.ViewsInstances.statistics = new APP.Views.Statistics();

};

APP.showBreadcrumbsView = function() {

	if(APP.ViewsInstances.breadcrumbs) {

		APP.ViewsInstances.breadcrumbs.remove();

	}

	APP.ViewsInstances.breadcrumbs = new APP.Views.Breadcrumbs();

};

APP.showItemsList = function(list, page, order, search) {

	var name = list.split("-")[0], // pod list będzie np. 'movies-list'
		colname = APP.Utils.capitalize(name) + "List";

	var page = page || 1,
		skip = (page - 1) * 5,
		order = order || ((name === "rents") ? -1 : 1),
		search = search || "",
		limit = ((name === "categories") ? 0 : 5),
		items = new APP.Collections[colname](),
		view = new APP.Views[colname]({
			collection: items,
			page: page, // w ten sposób 'page' będzie dla nas dostępny w widoku 'MoviesList'
			order: order,
			search: search
		});

	APP.showMainView(view);

	items.fetch({
		// w widoku musimy jeszcze nasłuchiwać, kiedy kolekcja zostanie zresetowana
		reset: true,
		// w 'data' do serwera przesyłamy dodatkowe dane
		data: {
			limit: limit,
			skip: skip,
			order: order,
			name: search
		}
	});

	APP.Views.Navigation.highlight(name);

};

APP.Router = {

	handleRoute: function(route, params) {
		// parametr 'route' to będzie np. 'movies-list' z pliku 'Routers.js' z metody 'initialize', a parametr 'params' to będzie tablica z np. 'page, order, search'

		params.unshift(route);

		// ogólna funkcja wyświetlająca rózne listy
		if(route.match(/(.+)-list/)) {

			APP.showItemsList.apply(APP, params);

		}

	},

	setupRoutes: function() {

		// taka funkcja 'initialize', która będzie zawierać to, co powinno zostać stworzone na samym początku (patrz metoda 'initialize' w pliku 'Router.js')
		APP.router = new APP.Routers.Router();

		APP.Vent.listenTo(APP.router, "route", APP.Router.handleRoute); // nasłuchujemy, dzięki obiektowi 'Vent', na routerze na zdarzenie "route", które będzie odpalać metodę 'handleRoutes'

	}

}

APP.init = function() {

	APP.Router.setupRoutes(); // utworzenie nowego routera

	APP.showBreadcrumbsView();
	APP.showStatisticsView();
	APP.showLatestRentsView();

	Backbone.history.start({pushState: true});

};

})();