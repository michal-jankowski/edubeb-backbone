(function() {

    APP.Views.RentNew = Backbone.View.extend({
    
        tagName: "div",
    
        template: _.template( $("#rentEditNewTemplate").html() ),
    
        initialize: function() {

            this.listenToOnce(this.model, "sync", this.redirectToEdit);
            this.listenToOnce(this.model, "sync", this.showAddedInfo);
            this.listenToOnce(this.model, "sync", APP.showStatisticsView);
            this.listenTo(this.model, "sync", APP.showLatestRentsView);
            this.listenTo(this.model, "invalid", this.showErrorInfo);

            this.render();
    
        },
    
        render: function() {
    
            var html = this.template( this.model.toJSON() ),
                model = this.model;
    
            this.$el.html(html);
    
            APP.Regions.appContent.html(this.el);
            
            // this.stickit(); => STICKIT bindings nie będzie nam tutaj potrzebny, bo będziemy korzystać z autouzupełniania

            // 	MAGICSUGGEST
            var movieField = this.$("#ms-movie-id").magicSuggest({
                data: "/movies", // url z serwera, z którego bedą zwracane obiekty json z tym, co nas interesuje
                method: "get",
                valueField: "_id", // bo w bazie danych w tabeli 'rents', przechowujemy informacje o filmie w postaci id: setValue([model.get("movie_id")
                displayField: "title", // wyświetlamy tytuł filmu
                allowFreeEntries: false,
                toggleOnClick: true,
                placeholder: "Wybierz film",
                queryParam: "name"
            });

            $(movieField).on("selectionchange", function(event, magicsuggest, movies) {

                if(movies.length > 1) {
                    this.removeFromSelection(movies[0], true); // 'removeFromSelection' to metoda dostępna w magicsuggest
                }

                if(movies.length) {
                    // id nowo wybranego filmu musimy zapisać w naszym modelu rent
                    model.set("movie_id", movies[0]._id);
                    this.container.addClass("selected");
                } else {
                    model.set("movie_id", " ");
                    this.container.removeClass("selected");
                }
    
            });

            var clientField = this.$("#ms-client-id").magicSuggest({
                data: "/clients", // url z serwera, z którego bedą zwracane obiekty json z tym, co nas interesuje
                method: "get",
                valueField: "_id",
                displayField: "name",
                allowFreeEntries: false,
                toggleOnClick: true,
                placeholder: "Wybierz klienta",
                queryParam: "name"
            });

            $(clientField).on("selectionchange", function(event, magicsuggest, clients) {

                if(clients.length > 1) {
                    this.removeFromSelection(clients[0], true); // 'removeFromSelection' to metoda dostępna w magicsuggest
                }

                if(clients.length) {
                    // id nowo wybranego klienta musimy zapisać w naszym modelu rent
                    model.set("client_id", clients[0]._id);
                    this.container.addClass("selected");
                } else {
                    model.set("client_id", " ");
                    this.container.removeClass("selected");
                }
    
            });
            // 	MAGICSUGGEST end

            return this;
            
        },
    
        events: {
            "submit form": "saveRent"
        },
    
        saveRent: function(e) {
    
            e.preventDefault();
    
            this.model.save({}, {wait: true});
    
        },

        showAddedInfo: function() {

            var zd = new $.Zebra_Dialog("Rekord został poprawnie zapisany.", {
                type: "information",
                title: "Zapisano"
            });

        },

        showErrorInfo: function(model) {

            var zd = new $.Zebra_Dialog(model.validationError, {
                type: "error",
                title: "Wystąpił błąd"
            });

        },
    
        redirectToEdit: function() {
    
            APP.router.navigate("/rent/" + this.model.get("_id") + "/edit", {trigger: true});
    
        }
    
    })
    
    })();