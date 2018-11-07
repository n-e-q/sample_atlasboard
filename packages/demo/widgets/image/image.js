widget = {
  onData: function (el, data) {
	  
	if (data.title) {
      $('h2', el).text(data.title);
    }
    
    // If a person does not have a headshot, show an empty headshot
    $('.content', el).html(
    	 "<img class='featured-image' src='" + data.imageSrc + "'/>" +
    	 "<div class='textinfo'>" + data.name + "</div>" +
    	 "<div class='textinfo'>" + data.job + "</div>" 
   );

  }

};