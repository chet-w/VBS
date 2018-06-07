# VBS - An Angular JS Project for INFO226

## The Project
As part of a project for INFO226: Application Development, we were tasked with creating a web portal for Lecturers and Students of Victoria University of Wellington's Business School to be ale to log in and manage their tasks.

The application is built on AngularJS 1.6 through the web-based Plunkr interface as per the requirements over a 11 week timeframe, utilising one week sprints and a scrum board through Trello to manage the workflow between my partner Daniel and I. 

The result was a dynamic, mobile-friendly single-page application that allows for users to be able to log in and interface with a user-friendly application and manage their courses and assignments. 

### Front-End
The Application is built with standard HTML5 and styled with CSS3. It does not use any of the popular pre-determined styles, structures, or boilerplates such as Bootstrap or Foundation, and instead each style rule is custom-made built to suit the Application. 

Using CSS animations and transitions allowed for the creation of a more dynamic visual appeal where elements all come from somewhere in a natural way while subtle transitions for hover pseudo-sates on elements add a bit more life to keep the page from looking too static.

### Back-End
Through AngularJS, the Application has a single JavaScript file that handles the dynamic features like routing, form validation, and showing and hiding elements. Additionally, the Application interacts with a server onsite at VUW which holds JSON data about each User, Course, Assignment, etc., to achieve the MVC design intended for the application - the user interacts with the View through HTML, the  JS Controller handles the core logic and local data, before passing on changes to a remote server Model.

## Usage
### For Lecturers
Users with the status of 'Lecturer' have more powers within the application compared to 'Students'. Lecturers can:

* Add a new Course to the Course Directory.
* Edit an existing Course.
* Delete an existing Course.
* Add a new Assignment for a Course.
* Edit an existing Assignment.
* Delete an existing Assignment.

### For Students
Students are the other users of the Application and have less powers than a Lecturer. They are limited in what they can edit and delete and so cannot edit or delete Courses or Assignments. Students can:

* Add Courses to their Course Feeds.
* Mark Assignments as complete.

### For Everyone
Every User of the Application can still use the basic features of the Application, which are:

* Viewing the Courses of the Course Directory.
* Searching through Courses.
* Viewing the Course Information (Name, CourseID, Overview, Lecturers, Lecture Times, and Trimesters and Years offered).

## Room for Improvement
### Design
I'm proud of the sleek and minimal design of the VBS Application, however I would like to be able to improve on small design features for future projects. Things I would like to improve would be:

* Proper Scaling - using em and rem units instead of px to make it more responsive.
* CSS Grid and Flexbox - these are two newer features for CSS which I would love to be able to implement properly. They're touched on a bit in this project, but not used to their full potential and so the layout design could be improved.
* Mobile First - sums up the other two points too really. I would like to follow the lead of Bootstrap in making sure that the page loads perfectly no matter what the viewport is, but I still like making my own styles and expanding my CSS skills so I wouldnt change over to it completely.

### Structure
As an assignment for a course, I was restricted on my choice of software for the project. My prefered editior is VS Code, however for this project I was told to use Plunkr. A web-based app, it wasn't quite as packed full of features like VS Code and prevented the use of Folders to branch out and modularise the project. In other projects I have adopted a more modular approach to my work and split up code into multiple HTML and JS files for their use, however Plunkr didn't really give my that. 





