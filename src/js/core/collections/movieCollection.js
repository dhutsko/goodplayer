(function(root, factory) {
    root.App = root.App || {};
    root.App.Collections = root.App.Collections || {};
    root.App.Collections.Movie = factory(root.Backbone, root.App);

}(this, function(Backbone, App) {
    if(!Backbone) throw new Error('Backbone.js is not available');
    if(!App && !App.Models) throw new Error('App.Models is not available');

    return Backbone.Collection.extend({
        model: App.Models.Movie,
        url: "/data/movies.json"
    });
}));
