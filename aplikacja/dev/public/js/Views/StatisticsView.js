(function() {

APP.Views.Statistics = Backbone.View.extend({

	tagName: "div",
	className: "app-status",

	template: _.template( $("#statisticsWidgetTemplate").html() ),

	initialize: function() {

		var view = this;

		$.when(

			$.ajax("/info/movies"),
			$.ajax("/info/clients"),
			$.ajax("/info/rents")
			// kiedy wykonają się wszystkie ajaxy, to wykona się funkcja w then

		).then(function(movies, clients, rents) {

			view.render({
				movies: movies[0],
				clients: clients[0],
				rents: rents[0]
				// to zostanie przekazane do render, a render przekaże to do naszej templatki
			});

		});

	},

	render: function(data) {
		// przekazujemy tutaj data, bo nie będziemy mieli tutaj dostępnych modeli

		this.$el.html( this.template(data) );

		APP.Regions.appHeader
			.append(this.el);

		return this;

	}

});

})();