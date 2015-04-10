(function(root, factory) {
    root.App = root.App || {};
    root.App.Views = root.App.Views || {};
    root.App.Views.VideoPlayerView = factory(root.$, root.Backbone, root.App);

}(this, function($, Backbone ,App) {
    if(!$) throw new Error('JQuery.js is not available');
    if(!Backbone) throw new Error('Backbone.js is not available');
    if(!App && !App.Template) throw new Error('App.Template is not available');

    return Backbone.View.extend({
        template: App.Template('video_player_view'),

        initialize: function () {
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });
}));
