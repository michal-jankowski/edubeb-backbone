(function() {

APP.Views.CategoryListItem = Backbone.View.extend({

	tagName: "li",

	template: _.template( $("#categoryListItemTemplate").html() ),

	render: function() {

		var html = this.template( this.model.toJSON() ); // pobieramy kod z templatki i przekazujemy tam to, co zwróci nam model

		this.$el.html(html);

		return this;

	},

	events: {
		"click .details": "redirectToDetails"
	},

	redirectToDetails: function() {

		APP.router.navigate("/category/" + this.model.get("_id"), {trigger: true});

	}

});

})();