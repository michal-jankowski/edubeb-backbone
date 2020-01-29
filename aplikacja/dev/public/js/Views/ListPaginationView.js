(function() {

	APP.Views.ListPagination = Backbone.View.extend({

		tagName: "div",
		className: "app-items-pagination",

		template: _.template( $("#listPaginationTemplate").html() ),

		initialize: function(options) {
			// w 'options' będzie, np. collectionName przekazane w 'MoviesListView'
			this.options = options;

			$.ajax({

				// w url zostanie nam zwrócona liczba wszystkich filmów
				url: "/info/" + this.options.collectionName,
				context: this,
				// wysyłając żądanie AJAX przesyłamy dodatkowe parametry
				data: {
					name: this.options.search || undefined // jeżeli nic nie zostanie podane, to będziemy mieli 'undefined' i jQuery to zignoruje (nic dodatkowego do serwera nie będzie przesyłane)
				}

			}).done(function(items) {

				// pod 'items' mamy liczbę wszystkich filmów odesłaną z serwera
				if(items > 5) {
					this.render(items);
				} else {
					this.remove();
				}

			});

		},

		render: function(items) {

			// to będą zmienne przekazywane do templatki w pliku 'index.html'
			var anchors = Math.ceil(items / 5), // bo 5 filmów na stronę
				page = this.options.page,
				active = page ? page : 1;

			// żebyśmy mogli to wszystko wyrenderować, do templatki musimy przekazać obiekt z danymi
			this.$el.html( this.template({ anchors: anchors, active: active }) );

			return this;

		},

		events: {
			"click a": "goToPage"
		},

		goToPage: function(e) {

			e.preventDefault();

			var page = $(e.target).data("page"),
				url = this.options.collectionName + "/page/" + page + "/order/" + this.options.order;

				if(this.options.search) {
					url += "/search/" + this.options.search;
				}

			APP.router.navigate(url, {trigger: true});
			
		}

	});

})();