(function() {

    APP.Views.ListActions = Backbone.View.extend({

        tagName: "div",
        className: "app-actions",

        template: _.template( $("#listActionsTemplate").html() ),

        initialize: function(options) {

            this.options = options;
            
        },

        render: function() {

            this.$el.html(this.template({ 
                order: this.options.order,
                placeholder: this.options.placeholder
            }));

            return this;
            
        },

        events: {
            "keyup .app-search input": "setSearchCollectionTimeout",
            "click .app-sort li": "sortCollection",
            "click .add": "showAdd"
        },

        setSearchCollectionTimeout: function() {

            clearTimeout(this.searchTimeout); // czyścimy poprzedni timeout, żeby funkcja nie odpalała się za każdym podniesieniem klawisza

            this.searchTimeout = setTimeout(_.bind(this.searchCollection, this), 500); // przypisujemy sobie taką właściwość do widoku, żebyśmy mogli się do niej potem odwołać i móc ją wyczyścić
            
        },

        searchCollection: function(e) {

            var value = this.$(".app-search input").val().toLowerCase();

            if(value) {

                var url = this.options.collectionName + "/page/" + this.options.page + "/order/" + this.options.order + "/search/" + value;

                APP.router.navigate(url, {trigger: true});
                
            } else {

                APP.router.navigate(this.options.collectionName, {trigger: true});
                
            }
            
        },

        sortCollection: function(e) {

            e.preventDefault();

            var order = $(e.target).data("order"),
                url = this.options.collectionName + "/page/" + this.options.page + "/order/" + order;

            if(this.options.search) {
                url += "/search/" + this.options.search;
            }

            APP.router.navigate(url, {trigger: true});
            
        },

        showAdd: function() {

            var url = this.options.collectionName + "/new";

            APP.router.navigate(url, {trigger: true});
            
        }
        
    });
    
})()