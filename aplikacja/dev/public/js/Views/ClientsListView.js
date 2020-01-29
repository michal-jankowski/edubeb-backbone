(function() {

APP.Views.ClientsList = Backbone.View.extend({

	tagName: "ul",
	className: "app-items-list",

	initialize: function(options) {

		this.options = options;

		this.listenTo(this.collection, "reset", this.render);

	},

	render: function() {

		var paginationView = new APP.Views.ListPagination({
			// tutaj przekazujemy opcje, które będą dla nas dostępne w paginacji
			collectionName: "clients",
			page: this.options.page,
			order: this.options.order,
			search: this.options.search,
		});

		var actionView = new APP.Views.ListActions({
			collectionName: "clients",
			page: this.options.page,
			order: this.options.order,
			search: this.options.search, // przekazujemy też 'search' do paginacji
			placeholder: "Szukaj klientów..."
		});

		this.childViews = [paginationView, actionView];

		this.collection.each(this.addOne, this);

		APP.Regions.appContent.append(actionView.render().el);
		APP.Regions.appContent.append(this.el);
		APP.Regions.appContent.append(paginationView.render().el); // możemy się odwołać na koncu do '.el', dlatego że w widoku paginacji na koncu funkcji render, zwróciliśmy 'return this' (zwrócony element div z 'ListPaginationView' wstawiamy na stronę)

	},

	addOne: function(model) {

		var view = new APP.Views.ClientListItem({model: model});

		this.$el.append(view.render().el);

	}

});

})();