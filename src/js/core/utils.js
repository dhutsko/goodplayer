(function(root, factory) {
    factory(root.$);
}(this, function($) {
    if(!$) throw new Error('JQuery.js is not available');

	$("#up").on('click', function(e){
		e.preventDefault();
		var curPos = $(document).scrollTop();
		var scrollTime= curPos / 1.73;
		$("body,html").animate( {"scrollTop":0}, scrollTime );
	});
}));