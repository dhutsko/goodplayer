(function(root, factory) {
    root.App = root.App || {};
    root.App.Views = root.App.Views || {};
    root.App.Views.MovieDetailsView = factory(root.$, root._, root.Backbone, root.App);

}(this, function($, _, Backbone, App) {
    if(!$) throw new Error('JQuery.js is not available');
    if(!_) throw new Error('Underscore.js is not available');
    if(!Backbone) throw new Error('Backbone.js is not available');
    if(!App && !App.Template) throw new Error('App.Template is not available');
    if(!App && !App.Views) throw new Error('App.Views is not available');

    return Backbone.View.extend({
        template: App.Template('movie_details_view'),

        initialize: function() {
            
        },

        render: function() {          
            this.$el.html(this.template( this.model.toJSON() ));        

            return this;
        }
    });
}));
