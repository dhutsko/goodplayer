(function(root, factory) {
    root.App = root.App || {};
    root.App.Views = root.App.Views || {};
    root.App.Views.HeaderView = factory(root.$, root.Backbone);

}(this, function($, Backbone) {
    if(!$) throw new Error('JQuery.js is not available');
    if(!Backbone) throw new Error('Backbone.js is not available');

    return Backbone.View.extend({
        el: '#navbar',

        initialize: function () {
            this.menuItems = this.$el.find('.nav li');
        },

        selectMenuItem: function (menuItem) {
            this.menuItems.removeClass('active');
            if (menuItem) {
                this.menuItems.siblings('.' + menuItem).addClass('active');
            }
        }
    });
}));
