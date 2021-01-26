# Northcoders News API

This repository was completed based on instruction and guidance from our Northcoders tutors as an exercise in building a backend api server in preparation for the frontend work soon to commence.

The initial setting up of the express server, sql database, and data migrations was carried out while co-programming alongside Nate Masters - another trainee software engineer.

Once the Express server was setup, the creation of endpoints and testing was conducted solely by myself before being pushed up and hosted on heroku.

https://nc-news-project-st.herokuapp.com/api/

Feel free to visit the hosted app - the link above will return a json object containing descriptions of all the current endpoints setup.

Below is an example endpoint - see the json object on the link above for a full list of endpoints.

## Example point request type and path

GET /api/topic

Serves up an array of all topics contained in a json object.
Example response:
{ topics: {
[{
"slug": "football",
"description": "Footie!"
}]
}}
