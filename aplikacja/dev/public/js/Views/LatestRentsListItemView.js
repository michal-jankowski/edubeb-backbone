(function() {

APP.Views.LatestRentsListItem = Backbone.View.extend({

	tagName: "li",

	template: _.template( $("#latestRentsWidgetListItemTemplate").html() ),

	render: function() {

		var html = this.template( this.model.toJSON() );

		this.$el.html(html);

		return this;

	},

	events: {
		"click": "showDetails"
	},

	formatDateMoment: function(date) {

		var d = new Date(date);

		return moment(d).locale("pl").calendar();

	},

	showDetails: function() {

		APP.router.navigate("rent/" + this.model.get("_id"), {trigger: true});

	}

});

})();