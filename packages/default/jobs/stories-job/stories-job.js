/**
 * Job: stories-job
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
var MAXFEAT = 4;
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
     It is a good idea to cover this with unit tests as well (see test/stories-job file)

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
     Have a look at test/stories-job for an example of how to unit tests this easily by mocking easyRequest calls

     */

    dependencies.easyRequest.HTML(config.fullRequest, function (err, html) {
		if(!err){
			var projArray = JSON.parse(html);
			var currIter = projArray.current_iteration_number;
			var addUrl = config.fullRequest.url + "/iterations/" + currIter;
			var iterRequest = {
			          "url": addUrl,
			          "headers": {
			             "X-TrackerToken": "4e5f8b279a65529e29c709d33f06cf58"
			          }
			};
			
			dependencies.easyRequest.HTML(iterRequest, function (err, html ){
				if(!err){
				    var iterBody = JSON.parse(html);
				    var numFeatures = 0;
				    var topStories = [];
				    for(var i = 0; i < iterBody.stories.length; i++){
				    	if(numFeatures >= MAXFEAT)
				    		break;
				    	var thisStory = iterBody.stories[i];
				    	if(thisStory.current_state != "accepted" && thisStory.story_type == "feature"){
				    		numFeatures ++;
				    		var storyAtt = ['Name: ' + thisStory.name, 'State: ' + thisStory.current_state, 'Points: ' + thisStory.estimate];
				    		if(thisStory.description != null)
				    			storyAtt.push('More: ' + thisStory.description);
				    		topStories.push(storyAtt);
				    	}
				    	
				    }
				    console.log(topStories);
				    jobCallback(err, {title: config.widgetTitle, stories: topStories});
			      }
			    else {
			       console.log("Error in stories-job.js inner request, fool");
			    }
			});
		} else {
			console.log("Error in stories-job.js outer request, fool")
		}
	 });
  }
};