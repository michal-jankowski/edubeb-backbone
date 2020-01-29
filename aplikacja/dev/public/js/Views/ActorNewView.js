(function() {

APP.Views.ActorNew = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#actorEditNewTemplate").html() ),

	initialize: function() {

		this.listenTo(this.model, "sync", this.redirectToEdit); // "sync" - jeśli model zostanie zsynchornizowany z serwerem
		this.listenTo(this.model, "sync", this.showAddedInfo);
		this.listenTo(this.model, "invalid", this.showErrorInfo);

		this.render(); // od razu rendereujemy widok, bo nic nie pobieramy z serwera (nie pobieramy żadnego modelu, bo sami tworzymy nowy model)

	},

	render: function() {

		var html = this.template( this.model.toJSON() );

		this.$el.html(html);

		APP.Regions.appContent.html(this.el);

		this.stickit(); // wywołujemy taką metodę, żeby zadziałał bindings
		
	},

	bindings: {
		"#actor-name": "name" // 'name' to właściwość naszego modelu, a '#actor-name' to identyfikator z naszej templatki (element do którego dane powinny zostać wstawione). Dodatkowo, jeżeli coś w tym elemencie '#actor-name' zmienimy, to model zostanie zaktualizowany
	},

	events: {
		"submit form": "saveActor"
	},

	saveActor: function(e) {

		e.preventDefault();

		this.model.save({}, {wait: true});

	},

	showAddedInfo: function() {

		var zd = new $.Zebra_Dialog("Rekord został poprawnie zapisany", {
			type: "information",
			title: "Zapisano"
		});
		
	},

	showErrorInfo: function(model) {

		alert(model.validationError);
		
	},

	redirectToEdit: function() {
		
		APP.router.navigate("actor/" + this.model.get("_id") + "/edit", {trigger: true});

	}

})

})();