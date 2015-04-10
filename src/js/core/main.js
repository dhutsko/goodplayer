(function(root, factory) {
	factory(root.$, root.Backbone, root.App);
}(this, function($, Backbone, App) {
	if(!$) throw new Error('JQuery.js is not available');
    if(!Backbone) throw new Error('Backbone.js is not available');
    if(!App && !App.Template) throw new Error('App.Template is not available');
    if(!App && !App.Views) throw new Error('App.Views is not available');

	var AppRouter = Backbone.Router.extend({
	    routes: {
	        ""                  : "home",
	        "movies/:id"        : "movieDetails",
	        "movies"           	: "movies",
	        "about"             : "about"
	    },

	    initialize: function () {
	    	this.pageContainer = $('#content');
	        this.headerView = new App.Views.HeaderView();
	        this.movies = new App.Collections.Movie();
	    },

		home: function(page) {
			if (!this.homeView) {
	            this.homeView = new App.Views.HomeView();
	        }
	        this.pageContainer.html(this.homeView.el);
	        this.headerView.selectMenuItem('home-menu');
	    },

	    movies: function () {
	    	var _self = this;

	        this.movies.fetch().then(function(){
	        	_self.pageContainer.html(new App.Views.MoviesView({ collection: _self.movies }).render().el);
	        });
	        
	        this.headerView.selectMenuItem('movies-menu');
	    },

	    movieDetails: function (id) {
	        var _self = this;

	        this.movies.fetch().then(function(){
	        	_self.pageContainer.html(new App.Views.MovieDetailsView({ model: _self.movies.get(id) }).render().el);
	        });
	        
	        this.headerView.selectMenuItem('movies-menu');
	    },

	    about: function () {
	        if (!this.aboutView) {
	            this.aboutView = new App.Views.AboutView();
	        }
	        this.pageContainer.html(this.aboutView.el);
	        this.headerView.selectMenuItem('about-menu');
	    }

	});


	var app = new AppRouter();
    Backbone.history.start();
}));
