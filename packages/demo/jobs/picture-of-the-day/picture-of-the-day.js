var $ = require('cheerio');
var request = require("request");
var i = 0 ;
var nameIndex = 0;
var storePerson;
var storeCurrNameDisplay = "";
var chosenPerson;
var imgUrl;
var jobT;

module.exports = {
  onRun: function (config, dependencies, jobCallback) {
    /*dependencies.easyRequest.HTML(config.url, function (err, body) {
      if (err) {
        var errMsg = err || "ERROR: Couldn't access the web page at " + config.url;
        console.log(err);
        jobCallback(errMsg);
      } else {*/
        
    	//Pull data of ppl from url
	  if(storeCurrNameDisplay.indexOf('-') === -1){
        request("https://www.willowtreeapps.com/api/v1.0/profiles", function(error, response, body){
        	var _ = dependencies.underscore;
        	var pArray = JSON.parse(body);
        	var chosenPerson = _.first(_.shuffle(pArray));
        	/*var fullName = chosenPerson.firstName + " " + chosenPerson.lastName;*/
        	//console.log(response);
        	//var imgUrl;
        	//var jobT;
        	if(storeCurrNameDisplay.indexOf('-') === -1){
        		//chosenPerson = _.first(_.shuffle(pArray));
        		storePerson = chosenPerson;
        		storeCurrNameDisplay = "";
        		var j;
        		for(j=0; j < chosenPerson.firstName.length; j++){
        			storeCurrNameDisplay += "-";
        		}
        		i = 0;
        		nameIndex = 0;
        	}
        	else {
        		chosenPerson = storePerson;
        		storeCurrNameDisplay = storeCurrNameDisplay.replace("-", chosenPerson.firstName.charAt(nameIndex));
        		nameIndex++;
        		
        	}
        	//console.log("i = " + i);
        	//console.log("name = " + storeCurrNameDisplay);
        	i++;
        	//app.use(express.static('widgets'));
        	//In case a variable is not defined for a person
        	if(chosenPerson.headshot.url == undefined){
        		imgUrl = "https://www.fairworkcenter.org/wp-content/uploads/2015/03/empty_headshot.png";
        		console.log("image not defined, getting empty headshot");
        	}
        	else
        		imgUrl = chosenPerson.headshot.url;
        	if(chosenPerson.jobTitle == undefined)
        		jobT = "N/A";
        	else
        		jobT = chosenPerson.jobTitle;
        	//console.log("call done");
        	//Send data to widget
        	jobCallback(null, {imageSrc: imgUrl, name: "It's a bird! It's a plane! It's " + storeCurrNameDisplay + " " + chosenPerson.lastName + "!", job: jobT, title: config.widgetTitle});
        });
	  } else {
		  	chosenPerson = storePerson;
		  	storeCurrNameDisplay = storeCurrNameDisplay.replace("-", chosenPerson.firstName.charAt(nameIndex));
  			nameIndex++;
  			jobCallback(null, {imageSrc: imgUrl, name: "It's a bird! It's a plane! It's " + storeCurrNameDisplay + " " + chosenPerson.lastName + "!", job: jobT, title: config.widgetTitle});
	  }  
      //}
    //});
  }
};
