(function(root, factory) {
    root.App = root.App || {};
    root.App.Template = factory(root.dust);

}(this, function(dust) {
    if(!dust || !dust.helpers) throw new Error('Dust.js is not available');

    return function(name) {
	    return function(data) {	
		  var result;	
		  dust.render(name, data || {}, function(err, res) {
		    result = res;
		  });	
		  return result;
		};
    };
}));
