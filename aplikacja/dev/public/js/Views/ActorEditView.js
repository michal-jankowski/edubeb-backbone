(function() {

APP.Views.ActorEdit = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#actorEditNewTemplate").html() ),

	initialize: function() {

		this.listenToOnce(this.model, "change", this.render); // 'this.listenToOnce' - żeby przy edycji, nie było wszystko za każdym razem ponownie renderowane, jeżeli cokolwiek zostanie zmienione ('this.render' wykona się tylko jeden raz, wtedy kiedy zrobimy fetcha())

		this.listenToOnce(this.model, "destroy", this.redirectToActors);
		this.listenToOnce(this.model, "destroy", this.showRemoveInfo);
		this.listenTo(this.model, "invalid", this.showErrorInfo);
		this.listenTo(this.model, "update", this.showUpdateInfo);

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
		"submit form": "updateActor",
		"click .delete": "deleteActor"
	},

	updateActor: function(e) {

		e.preventDefault();

		var model = this.model;

		this.model.save({}, {
			wait: true,
			success: function() {
				model.trigger("update"); // jest to zdarzenie, które w Backbone nie istnieje, ale sami sobie to zdarzenie na modelu wywołujemy
			}
		});

	},

	deleteActor: function() {

		// var confirmation = confirm("Czy na pewno chcesz usunąć?");

		// if(confirmation) {
		// 	this.model.destroy({wait: true});
		// }

		var model = this.model;

		var zd = new $.Zebra_Dialog("Czy na pewno chcesz usunąć?", {
			type: "warning",
			title: "Potwierdzenie usunięcia",
			buttons: [
				{
					caption: "Tak",
					callback: function() {
						model.destroy({wait: true});
					}
				},
				{
					caption: "Anuluj"
				}
			]
		});

	},

	showRemoveInfo: function() {

		var zd = new $.Zebra_Dialog("Rekord został usunięty.", {
			type: "information",
			title: "Usunięto"
		});

	},

	showErrorInfo: function(model) {

		// alert(model.validationError);

		var zd = new $.Zebra_Dialog(model.validationError, {
			type: "error",
			title: "Wystąpił błąd"
		});
		
	},

	showUpdateInfo: function() {

		var zd = new $.Zebra_Dialog("Aktualizacja przebiegła pomyślnie", {
			type: "information",
			title: "Zaktualizowano"
		});
		
	},

	redirectToActors: function() {

		APP.router.navigate("/actors", {trigger: true});

	}

})

})();