(function(root, factory) {
    root.App = root.App || {};
    root.App.Views = root.App.Views || {};
    root.App.Views.MoviesView = factory(root.$, root.Backbone, root.App);

}(this, function($, Backbone, App) {
    if(!$) throw new Error('JQuery.js is not available');
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

        setCurrentMovie: function($element) {
            this.$el.find('.item-movie').removeClass('active').removeClass('act');

            $element.parent().addClass('active'); 
        },

        showMovie: function(e) {
            e.preventDefault();

            var $element = $(e.currentTarget);
            var id       = $element.data('id');
            var view     = new App.Views.VideoPlayerView( { model: this.collection.get(id) } );

            this.$el.find('#video-player').replaceWith( view.render().el );

            this.setCurrentMovie($element);                       
        },

        render: function() {          
            this.$el.html(this.template( this.collection.toJSON() ));        

            return this;
        }
    });
}));
