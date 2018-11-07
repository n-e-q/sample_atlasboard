widget = {
  //runs when we receive data from the job
  onData: function (el, data) {

    //The parameters our job passed through are in the data object
    //el is our widget element, so our actions should all be relative to that
    if (data.title) {
      $('h2', el).text(data.title);
    }
    
	var fullInfo = "";
	for(var i = 0; i < data.stories.length; i++){
		var innerDivs = "<div class = 'storyinfo'>";
		for(var j = 0; j < data.stories[i].length; j++){
			innerDivs += "<div>" + data.stories[i][j] + "</div>";
	    }
		innerDivs += "</div>";
		fullInfo += innerDivs;
	}
	console.log(fullInfo);
    $('.content', el).html(fullInfo);
    
  }
};