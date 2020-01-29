(function() {

APP.Views.ActorListItem = Backbone.View.extend({

	tagName: "li",

	template: _.template( $("#actorListItemTemplate").html() ),

	render: function() {

		var html = this.template( this.model.toJSON() ); // pobieramy kod z templatki i przekazujemy tam to, co zwróci nam model

		this.$el.html(html);

		return this;

	},

	events: {
		"click .details": "redirectToDetails"
	},

	redirectToDetails: function() {

		APP.router.navigate("/actor/" + this.model.get("_id"), {trigger: true});

	}

});

})();