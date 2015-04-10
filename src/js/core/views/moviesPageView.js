(function(root, factory) {
    root.App = root.App || {};
    root.App.Views = root.App.Views || {};
    root.App.Views.MoviesView = factory(root.$, root._, root.Backbone, root.App);

}(this, function($, _, Backbone, App) {
    if(!$) throw new Error('JQuery.js is not available');
    if(!_) throw new Error('Underscore.js is not available');
    if(!Backbone) throw new Error('Backbone.js is not available');
    if(!App && !App.Template) throw new Error('App.Template is not available');
    if(!App && !App.Views) throw new Error('App.Views is not available');

    return Backbone.View.extend({
        template: App.Template('movies_view'),

        initialize: function() {
            
        },

        events: {
            'click a.btn-preview': 'showMovie'
        },

        showMovie: function(e) {
            e.preventDefault();
            $('video')[0].pause();

            var id = $(e.currentTarget).data('id');
            var view = new App.Views.VideoPlayerView( { model: this.collection.get(id) } );
            this.$el.find('#video-player').replaceWith( view.render().el );
        },

        render: function() {          
            this.$el.html(this.template( this.collection.toJSON() ));        

            return this;
        }
    });
}));
