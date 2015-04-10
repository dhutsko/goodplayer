(function(root, factory) {
    root.App = root.App || {};
    root.App.Collections = root.App.Collections || {};
    root.App.Collections.Movie = factory(root.Backbone);

}(this, function(Backbone, App) {
    if(!Backbone) throw new Error('Backbone.js is not available');

    return Backbone.Collection.extend({
        url: "/data/movies.json"
    });
}));
