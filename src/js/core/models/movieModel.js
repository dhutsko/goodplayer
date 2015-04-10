(function(root, factory) {
    root.App = root.App || {};
    root.App.Models = root.App.Models || {};
    root.App.Models.Movie = factory(root.Backbone);

}(this, function(Backbone) {
    if(!Backbone) throw new Error('Backbone.js is not available');

    return Backbone.Model.extend({

        initialize: function () {

        },


        defaults: {
        }
    });
}));
