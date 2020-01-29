(function() {

APP.Views.LatestRents = Backbone.View.extend({

	tagName: "ul",
	className: "app-latest-rents",

	template: _.template( $("#latestRentsWidgetTemplate").html() ),

	initialize: function() {

		this.listenTo(this.collection, "reset", this.render);

	},

	render: function() {

		this.collection.each(this.addOne, this);

		APP.Regions.appSidebar.html( this.template() )
			.append(this.el); // bo najpierw dodajemy templatkę 'latestRentsWidgetTemplate', a potem do tego tworzony w tym widoku element ul

		return this;

	},

	addOne: function(model) {

		var view = new APP.Views.LatestRentsListItem({model: model});

		this.$el.append(view.render().el);

	}

});

})();