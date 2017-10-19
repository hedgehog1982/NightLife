####################################################################################################################################
FreCodeCamp Dynamic Web application project


Objective: Build a full stack JavaScript app that is functionally similar to this: https://yasser-nightlife-app.herokuapp.com/ and deploy it to Heroku.

Note that for each project, you should create a new GitHub repository and a new Heroku project. If you can't remember how to do this, revisit https://freecodecamp.org/challenges/get-set-for-our-dynamic-web-application-projects.

Here are the specific user stories you should implement for this project:

User Story: As an unauthenticated user, I can view all bars in my area.

User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight.

User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there.

User Story: As an unauthenticated user, when I login I should not have to search again.

Hint: Try using the Yelp API to find venues in the cities your users search for. If you use Yelp's API, be sure to mention so in your app.

Once you've finished implementing these user stories, click the "I've completed this challenge" button and enter the URLs for both your GitHub repository and your live app running on Heroku.

You can get feedback on your project by sharing it with your friends on Facebook.

##############################################################################################################################

I am using Node.js, Express.js, CSS3, HTML5, MongoDB (stored on Mlab) and Jquery to build this app.

It is using Google's Map API to search for local bars in the area. Once a list of places has been obtained it then retrieves a picture using Google's place API if it exists of StreetView if not. Pictures are cached locally to stop as Many API calls and speed up search (6 seconds for a new search, 2-3 otherwise.

Once a place is found you can login with Twitter (via their API) and click to say you are going and also view who is also going (not yet implemented). 

At midnight local time to the place the people going are reset. 





