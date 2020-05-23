# COMP-2800-Team-15-BBY-Isowaytion
 
This is our COMP 2800 Project. 
 
This is an application where users can find out different walking routes
by using the google API. This app relies on user information so that all users are aware of each other's whereabouts. 
 
Team Members
- Daichi Keber
- Hawkan Zheng
- Ciro Wen
- Jay Han
 
//---------------------- Repo Organization ------------------------/
 
In this repo, we have three main folders within the root folder. They are the public, script, and views folders. We have included a .gitignore file in the root folder to make sure all of the node modules do not get uploaded to the repo. 
 
Root Folder includes:
	Index.js - The file that contains the bulk of our javascript.
	Passport-setup.js - Contains the code to handle login and 
	authentication.
	Package-lock.json - Contains all of the links to our dependencies.
Package.json - Contains all of the app dependencies.
.gitignore - includes the node modules.
 
Public Folder includes: 
	The favicon.
Images - Includes all of the images we used for the app with the 
images.
 
Script Folder includes: 
	CSS - Contains all of the css files.
	Scripts - contains all of the javascript files, except for index.js 	
	And passport-setup.js.
 
Views Folder includes:
	Pages - Which hold all of our ejs files. 
	All of the html files.
 
To test the user stories and functionality you can follow the link below.
https://docs.google.com/spreadsheets/d/1zhK8rZrUTK2eKXl9KgrP8oOUOuytW_78-mdZZHiQpWc/edit?usp=sharing
 
//----------------------Libraries Used--------------------------------//
 
Google Map API 
"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
"https://maps.googleapis.com/maps/api/js?key=AIzaSyB05M9WVnhk7NLh8gSFUxkiOVJecxU5tK0&libraries=places,visualization&callback=initMap"
KEY = AIzaSyB05M9WVnhk7NLh8gSFUxkiOVJecxU5tK0
 
Bootstrap API
"https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
"https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.bundle.min.js"
 
JQUERY
"https://code.jquery.com/jquery-3.5.1.min.js"
"https://code.jquery.com/jquery-3.2.1.slim.min.js"
 
OTHERS
"https://kit.fontawesome.com/df012b2a98.js"
"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
//------------------------------------------------------------------//
//---------------------- Instructions -----------------------------//
//----------------------------------------------------------------//
 
Please follow the instructions to set up your environment.
 
1. Visual Studio Code - IDE
    You can follow this link https://code.visualstudio.com/download to download
    Visual Studio Code based on your operating system. 
 
2. Beautify - Formatting Tool 
    You can download this by searching beautify in the extensions section on the left of Visual Studio Code. 
 
3. Node.js - Language
    You can follow this link https://nodejs.org/en/ to download the Windows version of node.js. Our entire team used the Windows operating system, and opted for the LTS over the Current version.
 
4. Once you have all of the above set up, you should run ‘npm install’ in your terminal to download all of the app dependencies.
 
5. To run the app type “node index.js” in the visual studio terminal and type the url “localhost:1515” in your browser.
 
//----------------------Database Access-------------------------------//
If the database needs to be accessed outside visual studio here are the credentials:
 
MySQL Database Access
Host: 205.250.9.115
User: root
Password: 123
Database: isowaytion
