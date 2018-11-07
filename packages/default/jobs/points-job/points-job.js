/**
 * Job: points-job
 *
 * Expected configuration:
 *
 * ## PLEASE ADD AN EXAMPLE CONFIGURATION FOR YOUR JOB HERE
 * { 
 *   myconfigKey : [ 
 *     { serverUrl : 'localhost' } 
 *   ]
 * }
 */
/*var projRequest = {
          "url": "https://www.pivotaltracker.com/services/v5/projects/2221411",
          "headers": {
             "X-TrackerToken": "4e5f8b279a65529e29c709d33f06cf58"
          }
};

var currIterNum = 0;

function getCurrIter(config, dependencies) {
	  console.log("hello");
	  dependencies.easyRequest.HTML(config.fullRequest, function (err, html) {
		  var jArray = JSON.parse(html);
		  currIterNum = jArray.current_iteration_number;
	  });
}*/

function points(dependencies, fullRequest){
		dependencies.easyRequest.HTML(fullRequest, function (err, html) {
		    // logger.trace(html);
		    if(!err){
			    var jArray = JSON.parse(html);
			    var totalPoints = 0;
			    var acceptedPoints = jArray.data[0][1];
			    var color;
			    var i;
			    for(i=1; i <= 8; i++){
			    	totalPoints += jArray.data[0][i];
			    }
			    console.log(acceptedPoints + " / " + totalPoints);
			    var ratio = acceptedPoints/totalPoints;
			    if(ratio <= (1/3))
			  	  color = "#FFA500";
		       else if(ratio <= (2/3))
			  	  color = "#FFFF00";
		       else
			      color = "#008000";
			   console.log(ratio);
			   
		      }
		    else {
		       console.log(fullRequest);
		       console.log("there was an error you fool");
		    }
		 });
}

module.exports = {

  /**
   * Executed on job initialisation (only once)
   * @param config
   * @param dependencies
   */
  onInit: function (config, dependencies) {

    /*
    This is a good place for initialisation logic, like registering routes in express:

    dependencies.logger.info('adding routes...');
    dependencies.app.route("/jobs/mycustomroute")
        .get(function (req, res) {
          res.end('So something useful here');
        });
    */
  },
  /**
   * Executed every interval
   * @param config
   * @param dependencies
   * @param jobCallback
   */
  onRun: function (config, dependencies, jobCallback) {

    /*
     1. USE OF JOB DEPENDENCIES

     You can use a few handy dependencies in your job:

     - dependencies.easyRequest : a wrapper on top of the "request" module
     - dependencies.request : the popular http request module itself
     - dependencies.logger : atlasboard logger interface

     Check them all out: https://bitbucket.org/atlassian/atlasboard/raw/master/lib/job-dependencies/?at=master

     */

    var logger = dependencies.logger;

    /*

     2. CONFIGURATION CHECK

     You probably want to check that the right configuration has been passed to the job.
     It is a good idea to cover this with unit tests as well (see test/points-job file)

     Checking for the right configuration could be something like this:

     if (!config.myrequiredConfig) {
     return jobCallback('missing configuration properties!');
     }


     3. SENDING DATA BACK TO THE WIDGET

     You can send data back to the widget anytime (ex: if you are hooked into a real-time data stream and
     don't want to depend on the jobCallback triggered by the scheduler to push data to widgets)

     jobWorker.pushUpdate({data: { title: config.widgetTitle, html: 'loading...' }}); // on Atlasboard > 1.0


     4. USE OF JOB_CALLBACK

     Using nodejs callback standard conventions, you should return an error or null (if success)
     as the first parameter, and the widget's data as the second parameter.

     This is an example of how to make an HTTP call to google using the easyRequest dependency,
     and send the result to the registered widgets.
     Have a look at test/points-job for an example of how to unit tests this easily by mocking easyRequest calls

     */
     //getCurrIter(config, dependencies);
	 dependencies.easyRequest.HTML(config.fullRequest, function (err, html) {
	    // logger.trace(html);
		if(!err){
			var projArray = JSON.parse(html);
			var currIter = projArray.current_iteration_number;
			var addUrl = config.fullRequest.url + "/history/iterations/" + currIter + "/days";
			var iterRequest = {
			          "url": addUrl,
			          "headers": {
			             "X-TrackerToken": "4e5f8b279a65529e29c709d33f06cf58"
			          }
			};
			
			dependencies.easyRequest.HTML(iterRequest, function (err, html ){
			    console.log(config.fullRequest.url);
				if(!err){
				    var jArray = JSON.parse(html);
				    var totalPoints = 0;
				    var acceptedPoints = jArray.data[jArray.data.length-1][1];
				    var color;
				    var i;
				    for(i=1; i <= 8; i++){
				    	totalPoints += jArray.data[jArray.data.length-1][i];
				    }
				    console.log(acceptedPoints + " / " + totalPoints);
				    var ratio = acceptedPoints/totalPoints;
				    if(ratio <= (1/3))
				  	  color = "#FFA500";
			        else if(ratio <= (2/3))
				  	  color = "#FFFF00";
			        else
				      color = "#008000";
				    console.log(ratio);
				    jobCallback(err, {title: config.widgetTitle, tp: totalPoints, ap: acceptedPoints, col: color});
			      }
			    else {
			       console.log("Error in points-job.js inner request, fool");
			    }
			});
		} else {
			console.log("Error in points-job.js outer request, fool")
		}
	 });
  }
};