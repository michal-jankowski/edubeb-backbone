(function() {

APP.Views.ClientEdit = Backbone.View.extend({

	tagName: "div",

	template: _.template( $("#clientEditNewTemplate").html() ),

	initialize: function() {

		this.listenToOnce(this.model, "change", this.render); // 'this.listenToOnce' - żeby przy edycji, nie było wszystko za każdym razem ponownie renderowane, jeżeli cokolwiek zostanie zmienione ('this.render' wykona się tylko jeden raz, wtedy kiedy zrobimy fetcha())

		this.listenToOnce(this.model, "destroy", this.redirectToClients);
		this.listenToOnce(this.model, "destroy", this.showRemoveInfo);
		this.listenToOnce(this.model, "destroy", APP.showStatisticsView);
        this.listenTo(this.model, "invalid", this.showErrorInfo);
        this.listenTo(this.model, "update", this.showUpdateInfo);

	},

	render: function() {

		var html = this.template( this.model.toJSON() ),
			model = this.model;

		this.$el.html(html);

		APP.Regions.appContent.html(this.el);

		this.stickit(); // wywołujemy taką metodę, żeby zadziałał bindings

		// BEATPICKER
	    var beatPicker = new BeatPicker({
	    	dateInputNode: this.$("#client-birth-date"),
	    	modules: {
			    footer: false,
			    icon: false,
			    clear: false
			},
	    	dateFormat: {
	    		format: ["DD", "MM", "YYYY"]
	    	}
	    });

	    beatPicker.on("change", function(obj) {

	    	model.set("birthdate", obj.string);

	    });
	    // BEATPICKER end
		
	},

	bindings: {
		"#client-first-name": "first_name", // 'first_name' to właściwość naszego modelu, a '#client-first-name' to identyfikator z naszej templatki (element do którego dane powinny zostać wstawione). Dodatkowo, jeżeli coś w tym elemencie '#client-first-name' zmienimy, to model zostanie zaktualizowany
		"#client-last-name": "last_name",
		"#client-birth-date": "birthdate",
		"#client-id-number": "idc_number",
		"#client-address": "address",
		"#client-zip-code": "zip_code",
		"#client-city": "city"
	},

	events: {
		"submit form": "updateClient",
		"click .delete": "deleteClient"
	},

	updateClient: function(e) {

		e.preventDefault();

		var model = this.model;

		this.model.save({}, {
			wait: true,
			success: function() {
				model.trigger("update"); // jest to zdarzenie, które w Backbone nie istnieje, ale sami sobie to zdarzenie na modelu wywołujemy
			}
		});

	},

	deleteClient: function() {

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

        var zd = new $.Zebra_Dialog(model.validationError, {
            type: "error",
            title: "Wystąpił błąd"
        });

    },

    showUpdateInfo: function() {

        var zd = new $.Zebra_Dialog("Aktualizacja przebiegła pomyślnie.", {
            type: "information",
            title: "Zaktualizowano"
        });

    },

	redirectToClients: function() {

		APP.router.navigate("/clients", {trigger: true});

	}

})

})();