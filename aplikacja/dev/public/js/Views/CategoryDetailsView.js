(function() {

APP.Views.CategoryDetails = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#categoryDetailsTemplate").html() ),

	initialize: function() {

		this.listenTo(this.model, "change", this.render); // kiedy coś się w modelu zmieni, czyli np. kiedy zostanie pobrany z serwera, chcemy wykonać 'this.render'

	},

	render: function() {

		var html = this.template( this.model.toJSON() );

		this.$el.html(html);

		APP.Regions.appContent.html(this.el);

	},

	events: {
		"click .edit": "showEdit"
	},

	showEdit: function() {

		APP.router.navigate("/category/" + this.model.get("_id") + "/edit", {trigger: true});

	}

});

})();