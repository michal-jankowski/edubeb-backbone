(function() {

    APP.Views.RentEdit = Backbone.View.extend({
    
        tagName: "div",
    
        template: _.template( $("#rentEditNewTemplate").html() ),
    
        initialize: function() {
    
            this.listenToOnce(this.model, "change", this.render); // 'this.listenToOnce' - żeby przy edycji, nie było wszystko za każdym razem ponownie renderowane, jeżeli cokolwiek zostanie zmienione ('this.render' wykona się tylko jeden raz, wtedy kiedy zrobimy fetcha())
    
            this.listenToOnce(this.model, "destroy", this.redirectToRents);
            this.listenToOnce(this.model, "destroy", this.showRemoveInfo);
            this.listenToOnce(this.model, "destroy", APP.showStatisticsView);
            this.listenToOnce(this.model, "destroy", APP.showLatestRentsView);
            this.listenTo(this.model, "invalid", this.showErrorInfo);
            this.listenTo(this.model, "update", this.showUpdateInfo);
            this.listenTo(this.model, "update", APP.showLatestRentsView);
    
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

            $(movieField).on("load", function() {

                movieField.setValue([model.get("movie_id")]); // musimy tutaj przekazywać tablicę

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

            $(clientField).on("load", function() {

                clientField.setValue([model.get("client_id")]); // musimy tutaj przekazywać tablicę

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
            "submit form": "updateRent",
            "click .delete": "deleteRent"
        },
    
        updateRent: function(e) {
    
            e.preventDefault();

            // tych właściwości nie chcemy bezpośrednio zapisywać w bazie, więc usuwamy je przed wysłaniem na serwer 
            this.model.unset("movie_title");
            this.model.unset("client_name");
            this.model.unset("date");
    
            var model = this.model;
            
            this.model.save({}, {
                wait: true,
                success: function() {
                    model.trigger("update"); // jest to zdarzenie, które w Backbone nie istnieje, ale sami sobie to zdarzenie na modelu wywołujemy
                }
            });
    
        },
    
        deleteRent: function() {
    
            // var confirmation = confirm("Czy na pewno chcesz usunąć?");
    
            // if(confirmation) {
            //     this.model.destroy({wait: true});
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
    
        redirectToRents: function() {
    
            APP.router.navigate("/rents", {trigger: true});
    
        }
    
    })
    
    })();