var app = angular.module('vbs', []); //initialises the app

app.controller('main', function($scope, $http) { //sets up a controller dynamically handle what the app shows,

  //what data is there - all the logic for the application
  //$scope is a special object in angular - it lets the app.js file
  //send data to the html and vice versa



  /**------------------------------------------------------
   * INITIALISING DATA:
   * checks and tasks done before the application runs to
   * make sure that everything is ready for when it does run. 
     ------------------------------------------------------**/

  /**Fields for showing/hiding elements**/
  $scope.showAddCourseModal = false; //dont show either of the modals yet
  $scope.showEditCourseModal = false;
  $scope.showAddAssignmentsModal = false;
  $scope.showAssignmentsModal = false;
  $scope.showLoginError = false; //dont show the 'incorrect username/password' yet
  $scope.mobileMenuOpen = false;

  /**Fields for showing data in notifications**/
  $scope.lastEditedCourse = {}; //initialises the last course edited and added 
  $scope.lastAddedCourse = {};

  /**Fields for navigation**/
  $scope.view = 'login'; //sets the starting page to be the login page
  $scope.courseView = 'home'; //controls which tab of the course page the user is on

  /**Fields for App data (i.e.: logins, courses, assignments, etc...) **/
  $scope.logins = []; //sets up an empty list of logins to be populated later
  $scope.courses = []; //initialises list 0f courses
  $scope.assignments = []; //initialises assignments list
  $scope.associations = []; //initialises list of which students do which courses

  /**Fields for User Information**/
  $scope.currentUser = {}; //initialises the currentUser of the application to no one
  $scope.studentsCourses = []; //initialises the list of courses the currentUser student takes.  
  $scope.currentCourse = {}; //initialises the currentCourse. Used later to enable the app to know which course page to show
  $scope.currentAssignment = {};
  $scope.originalCell = null; //for the timetable, initialises it
  $scope.studentsFeed = []; //initialises the course on the students feed
  $scope.currentLecturer = {};


  /**----------------------------------------------------
   * API CALLS
   * Gets the data from the server and saves it to the app
   * ---------------------------------------------------**/

  
  /**Addresses for GET API Calls - see bottom of file for all API calls**/
  var courseDirectory = 'https://caab.sim.vuw.ac.nz/api/wijesechet/course_directory.json';
  var assignmentsDirectory = 'https://caab.sim.vuw.ac.nz/api/wijesechet/assignment_directory.json';
  var courseAssociationDirectory = 'https://caab.sim.vuw.ac.nz/api/wijesechet/course_association_directory.json';
  var loginsDirectory = 'https://caab.sim.vuw.ac.nz/api/wijesechet/user_list.json';

  /**Load the Courses**/
  $http.get(courseDirectory).then(function(response) {
    $scope.courses = response.data.courses;           //Get the data and save it
    console.log($scope.courses.length + " Courses Loaded");         //Log how many Courses were loaded
  });

  /**Load the Assignments**/
  $http.get(assignmentsDirectory).then(function(response) {
    $scope.assignments = response.data.assignments;       //Get the data and save it
    console.log($scope.assignments.length + " Assignments Loaded");         //Log how many Assignments were loaded
  });

  /**Load the Associations - which student takes which courses**/
  $http.get(courseAssociationDirectory).then(function(response) {
    $scope.associations = response.data.courseAssociations;     //Get the data and save it
    console.log($scope.associations.length + " Associations Loaded");       //Log how many Associations were loaded
  });

  /**Load the Logins**/
  $http.get(loginsDirectory).then(function(response) {
    $scope.logins = response.data.users;          //Get the data and save it
    //Add Chet and Daniel as Users for easy testing
    $scope.logins.push({
      ID: "5",
      LoginName: "chet",
      Password: "password",
      UserType: "lecturer"
    }, {
      ID: "6",
      LoginName: "daniel",
      Password: "password",
      UserType: "student"
    });
    console.log($scope.logins.length + " Logins Loaded");       //Log how many Users were loaded
  });

  /**----------------------------------------------------
   * LOADING MORE LOCAL DATA
   * Loads in more data into the app that will be used later.
   * Pretty much these arrays are used as lists for a Lecturer
   * to be able to pick from when adding/editing a Course, as well
   * as creating the Timetable.
   * ---------------------------------------------------**/

  /**List of Lecturers**/
  $scope.lecturers = [{
    ID: "Dr Cathal Doyle",
    office: "Rutherford House, RH407",
    contact: "cathal.doyle@vuw.ac.nz"
  }, {
    ID: "Dr Jesse Dinneen",
    office: "Rutherford House, RH 406",
    contact: "jesse.dinneen@vuw.ac.nz"
  }];

  /**List of all possible lecture times.**/
  $scope.lectureTimes = [
    "Monday 8.30am", "Monday 9.30am", "Monday 10.30am", "Monday 11.30am", "Monday 12.40pm", "Monday 1.40pm", "Monday 2.40pm", "Monday 3.40pm", "Monday 4.40pm",
    "Tuesday 8.30am", "Tuesday 9.30am", "Tuesday 10.30am", "Tuesday 11.30am", "Tuesday 12.40pm", "Tuesday 1.40pm", "Tuesday 2.40pm", "Tuesday 3.40pm", "Tuesday 4.40pm",
    "Wednesday 8.30am", "Wednesday 9.30am", "Wednesday 10.30am", "Wednesday 11.30am", "Wednesday 12.40pm", "Wednesday 1.40pm", "Wednesday 2.40pm", "Wednesday 3.40pm", "Wednesday 4.40pm",
    "Thursday 8.30am", "Thursday 9.30am", "Thursday 10.30am", "Thursday 11.30am", "Thursday 12.40pm", "Thursday 1.40pm", "Thursday 2.40pm", "Thursday 3.40pm", "Thursday 4.40pm",
    "Friday 8.30am", "Friday 9.30am", "Friday 10.30am", "Friday 11.30am", "Friday 12.40pm", "Friday 1.40pm", "Friday 2.40pm", "Friday 3.40pm", "Friday 4.40pm",
  ];

  /**List of available trimesters and years to add new courses to**/
  $scope.trimesters = [1, 2, 3];
  $scope.years = [2018, 2019, 2020];


  /**Days and Half Hour slots for the timetable**/
  $scope.numberOfDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  $scope.numberOfHalfHours = [
    "8.30am", "9.00am", "9.30am", "10.00am", "10.30am", "11.00am", "11.30am", "12.00pm", "12.40pm", "1.10pm", "1.40pm", "2.10pm", "2.40pm",
    "3.10pm", "3.40pm", "4.10pm", "4.40pm", "5.10pm"
  ];

  

  /**------------------------------------------------------------
     APPLICATION FUNCTIONS
     Functions used by the app through click events or the like to
     add behaviour
     ------------------------------------------------------------**/


  /**
   * CHECK LOGIN: takes a username/password object and verifies whether
   * the login is valid (exists in $scope.logins)
   **/
  $scope.checkLogin = function(login) {
    $scope.logins.forEach(function(el) {         //check each entry in the list of logins from before. 'el' represents one entry in the list that it checks for this loop of the forEach function
      if (el.LoginName == login.username) {        //if the username of the current 'el' object matches that one that was entered...
        if (el.Password == login.password) {           //and if the password matches too..
          // Login successful
          $scope.currentUser = el;          //set the currentUser variable from earlier to the login entry we found from the list
          $scope.showLoginError = false;          //we dont need to show the error since the login was good. 
          document.body.style.overflowY = 'auto';           //we're about to leave the login page, so this lets us scroll the page up and down
          if (el.UserType == 'lecturer') {           //if the login attempt was a lecturer...
            $scope.view = 'directory';           //then he gets routed to the Course Directory page. View is a variable from before which tells the html which page to show

          } else {          //if it wasnt a lecturer who logged in it'll be a student, so the view we show a student is the Course Feed
            $scope.loadFeed();        //load the students feed
            $scope.view = 'feed';
          }
        }
      }
      $scope.showLoginError = true; //if the login doesnt match a user in our list, show the error.
    });
  };

  /**
   * LOAD FEED: finds all the courses that a student should be enrolled in and
   * loads it for the app
   **/
  $scope.loadFeed = function() {
    var id = $scope.currentUser.ID;         //get the student we're looking for
    $scope.associations.forEach(function(el) {      //go through each association and find the ones that match the student
      if (el.StudentID == id) {
        $scope.studentsFeed.push($scope.courses.find(function(course) {
          return course.ID == el.CourseID;    //add the matching courses to the feed list
        }));
      }
    });
  };

  /**
   * GET NUM HALF HOURS: getter method to return the halfhour slots for the
   * lecture timetables.
   **/
  $scope.getNumHalfHours = function() {
    return $scope.numberOfHalfHours;
  };

  /**
   * ADD COURSE TO FEED: Takes a course from the Course Directory and adds it 
   * to the students list of courses they see on their feed.
   **/
  $scope.addCourseToFeed = function(course) {
    if ($scope.studentsFeed.indexOf(course) != -1) {        //if the course is already in the list, exit
      return;
    }
    $scope.studentsFeed.push(course);           //add course to the list
    var notif = document.getElementById('course-added-feed-notif');         //get the notifcation element
    notif.style.height = '40px';        //make it visible
    setTimeout(function() {
      notif.style.height = '0';           //after 4 seconds, hide the notification
    }, 4000);
    var newAssociation = {        //make a new association save the students new course to their ID
      ID: $scope.associations.length,   //the ID for the association identifies it uniquely
      studentID: $scope.currentUser.ID,
      courseID: course.ID
    };
    $scope.associations.push(newAssociation);   //save it locally
    apiPostAssociation(newAssociation);     //save it on the server
  };

  /**
   * REMOVE COURSE FROM FEED: Takes a course as a parameter and removes it from
   * the students course feed.
   **/
  $scope.removeCourseFromFeed = function(course) {
    var i = $scope.studentsFeed.indexOf(course);      //get the index
    $scope.studentsFeed.splice(i, 1);        //remove the course locally
    var association = $scope.associations.find(function(el){      //find the right association
        if(el.StudentID == $scope.currentUser.ID){
          if(el.CourseID == course.ID){
            return el;
          }
        }
    });
    $scope.associations.splice($scope.associations.indexOf(association), 1);      //delete it locally
    apiDeleteAssociation(association);        //delete it on the server
  
  };

  /**
   * OPEN COURSE: Opens the Course Page for a course when the User selects it from the 
   * course directory or course feed.
   **/
  $scope.openCourse = function(course) {
    if ($scope.originalCell !== null) {           //regarding the timetable. If this isnt the first Course opened during the session, 
      $scope.originalCell.classList.remove('course-lecture-time');          //then make sure that the previous courses timetable slot isnt visible
    }
    $scope.view = 'course';           //route the app to the Course page
    $scope.currentCourse = course;          //tell the app to remember which course we're talking about
    var time = $scope.currentCourse.LectureTimes;           //formats the LectureTimes property of the currentCourse object so it can be shown on the timetable
    var i = time.indexOf(' ');        //replaces a space with '-' so it can easily find the cell using the classname
    var changedTime = time.substr(0, i) + '-' + time.substr(i + 1, time.length);
    while(changedTime.charAt(0) == '-'){
      changedTime = changedTime.substr(1);
    }
    $scope.currentCourse.LectureTimes = changedTime;      
    var el = document.getElementById($scope.currentCourse.LectureTimes);         //get the right slot on the timetable
    $scope.originalCell = el;        //remember what the cell looked like before it was highlighted
    if (el !== null) {
      el.classList.add('course-lecture-time');        //highlight the lecture time on the timetable
    }
    $scope.getLecturerInfo();
  };

  /**
   * OPEN ADD COURSE MODAL: Opens the modal to add a new course
   **/
  $scope.openAddCourseModal = function() {
    $scope.showAddCourseModal = true;        //make the Modal visible in the DOM
    var overlay = document.getElementById('add-course-overlay');         //get the overlay
    var modal = document.getElementById('add-course-modal');        //get the actual modal
    setTimeout(function() {
      modal.style.top = '10vh';         //place the modal 10% of the viewport from the top
      modal.style.opacity = '1';       //fade it in
      overlay.style.opacity = '0.5';        //make the overlay transperent 
      overlay.style.zIndex = '14';       //put the overlay ontop of the background
    }, 100);

  };

  /**
   * CLOSE ADD COURSE MODAL: Close the modal to add a new course
   **/
  $scope.closeAddCourseModal = function() {
    var form = document.getElementById('add-course-form');        //get the add course form..
    form.reset();         //reset all the fields
    var overlay = document.getElementById('add-course-overlay');       //get the overlay
    var modal = document.getElementById('add-course-modal');         //get the modal
    modal.style.top = '-80vh';        //set all the changes styles back to their original values
    modal.style.opacity = '0';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '0';
    setTimeout(function() {
      $scope.showAddCourseModal = false;       //hide the modal in the DOM
    }, 1000);


  };

  /**
   * part of CLOSE ADD COURSE MODAL: closes the modal if the user clicks off of the 
   * modal
   **/
  window.onclick = function(event) {
    var overlay = document.getElementById('add-course-overlay');      //get the overlay
    if (event.target == overlay) {         //if the user clicks off the modal (i.e: on the overlay)...
      $scope.closeAddCourseModal();      //close the modal
    }
  };

  /**
   * part of CLOSE ADD COURSE MODAL: closes the modal if the user hits ESC
   **/
  document.onkeydown = function(event) {
    event = event || window.event;
    if (event.keyCode == 27 && $scope.showAddCourseModal) {       //if ESC is pressed and the Modal is open
      $scope.closeAddCourseModal();      //close the modal
    }
  };

  /**
   * SAVE COURSE: gets the newly created course as a parameter, and adds it
   * to the list of courses to save it to the directory
   **/
  $scope.saveCourse = function(course) {
    $scope.closeAddCourseModal();      //close the modal
    $scope.lastAddedCourse = course;       //remember which course was just added
    $scope.courses.push(course);       //add the new course to the list
    setTimeout(function() { 
      $scope.showAddedCourse();        //show the notification
    }, 400);    
    apiUpdateCourse(course);
  };

  /**
   * SHOW ADDED COURSE: shows a little notifcation to say which course was just added
   **/
  $scope.showAddedCourse = function() {
    var notif = document.getElementById('course-added-notif');      //get the notifcation element
    notif.style.height = '40px';        //make it visible
    setTimeout(function() {
      notif.style.height = '0';         //hide it after 4 seconds
    }, 4000);
  };

  /**
   * OPEN EDIT COURSE MODAL: opens the modal to edit an existing course
   **/
  $scope.openEditCourseModal = function() {
    $scope.showEditCourseModal = true;        //make the modal visible in the DOM
    var overlay = document.getElementById('edit-course-overlay');       //get the overlay
    var modal = document.getElementById('edit-course-modal');       //get the actual modal
    setTimeout(function() {
      modal.style.top = '10vh';        //poisiton the modal
      modal.style.opacity = '1';       //fade it in
      overlay.style.opacity = '0.5';      //make the overlay transperent
      overlay.style.zIndex = '14';      //put the overlay on top of the background
    }, 100);

  };

  /**
   * CLOSE EDIT COURSE MODAL: Closes the modal that is used to edit a course
   **/
  $scope.closeEditCourseModal = function() {
    var form = document.getElementById('edit-course-form');         //get the form from the modal
    form.reset(); //clear the feilds
    var overlay = document.getElementById('edit-course-overlay');         //get the overlay
    var modal = document.getElementById('edit-course-modal');        //get the modal
    modal.style.top = '-80vh';        //reset all the changed styles to make the modal and overlay invisible again
    modal.style.opacity = '0';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '0';
    setTimeout(function() {
      $scope.showAddCourseModal = false;      //make the modal hidden in the DOM
    }, 1000);
  };

  /**
   * part of CLOSE EDIT COURSE MODAL: closes the modal if the user clicks off of the 
   * modal
   **/
  window.onclick = function(event) {
    var overlay = document.getElementById('edit-course-overlay');        //get the overlay
    if (event.target == overlay) {      //if the user clicks off the modal ...
      $scope.closeEditCourseModal();        //close the modal
    }
  };

  /**
   * part of CLOSE EDIT COURSE MODAL: closes the modal if the user hits ESC
   **/
  document.onkeydown = function(event) {
    event = event || window.event;
    if (event.keyCode == 27 && $scope.showEditCourseModal) {        //if the user hits ESC and the modal is open
      $scope.closeEditCourseModal();      //close the modal
    }
  };

  /**
   * SAVE CHANGES: gets an object of changed fields as a parameter and changes the current course
   * to reflect those changes
   **/
  $scope.saveChanges = function(changes) {
    var beforeChanges = $scope.currentCourse;         //remember what the course is like before we change it
    var afterChanges = $scope.updateObject(beforeChanges, changes);       //run a recursive function to update the object
    var i = $scope.courses.indexOf(beforeChanges);      //find the original course in the list of courses
    $scope.courses[i] = afterChanges;         //replace the old course with the updated course

    $scope.currentCourse = afterChanges;        //change the currentCourse to the new updated one
    $scope.closeEditCourseModal();        //close the modal
    $scope.showEditedCourse();       //show the notification
    apiUpdateCourse(afterChanges);      //update the course on the server
  };

  /**
   * UPDATE OBJECT: recursive function that takes an object as a parameter, and goes through each of its properties and 
   * updates it to reflect the changes.
   **/
  $scope.updateObject = function(object) {
    for (var i = 1; i < arguments.length; i++) {        //iterate over each of the the obejcts passed in
      for (var prop in arguments[i]) {         //iterate over each of the properties of the object
        var val = arguments[i][prop];
        if (typeof val == "object") {         //if theres an object within this object, then call this function on that object
          $scope.updateObject(object[prop], val);
        } else {      //otherwise, update the property
          object[prop] = val;
        }
      }
    }
    return object;      //return the newly updated object 
  };

  /**
   * SHOW EDITED COURSE: shows the notification to say which course was just edited
   **/
  $scope.showEditedCourse = function() {
    var notif = document.getElementById('course-edited-notif');         //get the notification element
    notif.style.height = '40px';       //make it visible
    setTimeout(function() {
      notif.style.height = '0';      //hide it after 4 seconds
    }, 4000);
  };

  /**
   * DELETE COURSE: Removes a course from the course directory list
   **/
  $scope.deleteCourse = function(course) {
    $scope.courses.splice($scope.courses.indexOf(course), 1);       //gets the index of the course, then cuts it out of the array
    if($scope.studentsFeed !== null && $scope.courses.indexOf(course) > -1){    //if the course is in the currentstudents feed, get rid of it
      $scope.studentsFeed.splice($scope.courses.indexOf(course), 1);
    }
    var associations = $scope.associations.filter(function(el){
      return el.courseID == course.ID;        //find all associations with the deleted course in it
    });
    var assignments = $scope.assignments.filter(function(el){
      return el.CourseID == course.ID;        //find all assignments with the deleted course in it
    });
    associations.forEach(function(el){
      $scope.associations.splice($scope.associations.indexOf(el), 1);   //delete associations locally
      apiDeleteAssociation(el);       //delete association on the server
    });
    assignments.forEach(function(el){
      $scope.assignments.splice($scope.assignments.indexOf(el), 1);     //delete assignments locally
      apiDeleteAssignment(el);      //delete assignment on the server
    }); 
    apiDeleteCourse(course);    //finally, delete the course from the server
    
  };

  /**
   * OPEN ASSIGNMENTS MODAL: Opens the Edit assignment Modal
   **/
  $scope.openAssignmentsModal = function(assignment) {
    $scope.showAssignmentsModal = true;         //make the modal visible in the DOM
    $scope.currentAssignment = assignment;
    var overlay = document.getElementById('assignments-overlay');        //get the overlay
    var modal = document.getElementById('assignments-modal');        //get the actual modal
    setTimeout(function() {
      modal.style.top = '10vh';      //poisiton the modal
      modal.style.opacity = '1';         //fade it in
      overlay.style.opacity = '0.5';        //make the overlay transperent
      overlay.style.zIndex = '14';        //put the overlay on top of the background
    }, 100);
  };

  /**
   * CLOASE ASSIGNMENTS MODAL: Closes the Edit assignment Modal
   **/
  $scope.closeAssignmentsModal = function() {
    var form = document.getElementById('assignments-form');       //get the form from the modal
    form.reset();           //clear the feilds
    var overlay = document.getElementById('assignments-overlay');       //get the overlay
    var modal = document.getElementById('assignments-modal');       //get the modal
    modal.style.top = '-80vh';      //reset all the changed styles to make the modal and overlay invisible again
    modal.style.opacity = '0';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '0';
    setTimeout(function() {
      $scope.showAssignmentsModal = false;      //make the modal hidden in the DOM
    }, 1000);
  };

  /**
   * SAVE ASSIGNMENT: Saves the updated/new assignment locally and on the server
   **/
  $scope.saveAssignment = function(changed) {
    if (changed === null) {   //if no changes were made, dont do anything
      return;
    }
    var newAssignment = $scope.updateObject($scope.currentAssignment, changed);   //update the Assignment using the recursive function
    $scope.closeAssignmentsModal();       //once done, close the assignment
    var notif = document.getElementById('assignment-notif');    //get the notifcation element
    notif.style.height = '40px';       //make it visible
    setTimeout(function() {
      notif.style.height = '0';         //after 4 seconds, hide the notification
    }, 4000);
  };

  /**
   * OPEN ADD ASSIGNMENT MODAL: Opens the modal for adding a new Assignment
   **/
  $scope.openAddAssignmentsModal = function(){
    $scope.showAddAssignmentsModal = true;          //make the modal visible in the DOM
    var overlay = document.getElementById('assignments-overlay');          //get the overlay
    var modal = document.getElementById('add-assignments-modal');          //get the actual modal
    setTimeout(function() {
      modal.style.top = '10vh';           //poisiton the modal
      modal.style.opacity = '1';           //fade it in
      overlay.style.opacity = '0.5';           //make the overlay transperent
      overlay.style.zIndex = '14';        //put the overlay on top of the background
    }, 100);
  };
  
  /**
   * CLOSE ADD ASSIGNMENT MODAL: Closes the modal for adding a new Assignment
   **/
  $scope.closeAddAssignmentsModal = function() {
    var form = document.getElementById('add-assignments-form');         //get the form from the modal
    form.reset();          //clear the feilds
    var overlay = document.getElementById('assignments-overlay');       //get the overlay
    var modal = document.getElementById('add-assignments-modal');      //get the modal
    modal.style.top = '-80vh';          //reset all the changed styles to make the modal and overlay invisible again
    modal.style.opacity = '0';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '0';
    setTimeout(function() {
      $scope.showAddAssignmentsModal = false;         //make the modal hidden in the DOM
    }, 1000);
  };
  
  /**
   * SAVE NEW ASSIGNMENT: Saves the newly created Assignment locally and on the 
   * server
   **/
  $scope.saveNewAssignment = function(assignment){
    var newAssignment = {     //create a new assignment with the information passed in from the HTML
      ID: $scope.assignments.length,
      Name: assignment.Name,
      Overview: assignment.Overview,
      CourseID: $scope.currentCourse.ID,
      DueDate: assignment.DueDate
    };
    $scope.assignments.push(newAssignment);     //save it locally 
    apiUpdateAssignment(newAssignment);       //save it on the server
    $scope.closeAddAssignmentsModal();      //close the modal
  };
  
  /**
   * DELETE ASSIGNMENT: Removes a selected assignmet locally and on the server
   **/
  $scope.deleteAssignment = function(assignment){
    $scope.assignments.splice($scope.assignments.indexOf(assignment), 1); //gets the index of the course, then cuts it out of the array
    apiDeleteAssignment(assignment);      //remove it from the server
  };

  /**
   * TOGGLE MOBILE MENU: Toggles the mobile hamburger menu so it can be opened and
   * closed
   **/
  $scope.toggleMobileMenu = function() {
    var currentView = document.getElementById($scope.view);     //take note of the page we're on
    var top = currentView.querySelector('#top');          //get the top, center, and bottom bars of the menu icon
    var center = currentView.querySelector('#center');
    var bottom = currentView.querySelector('#bottom');
    var overlay = currentView.querySelector('#mobile-overlay');     //get the overlay for the background
    var options = currentView.querySelector('#mobile-menu-options');      //get the text that goes in the menu
    
    if (!$scope.mobileMenuOpen) {       //if the menu is closed
      $scope.mobileMenuOpen = true;     //set it to open
      document.body.overflowX = 'hidden';       //prevent scrolling
      document.body.overflowY = 'hidden';
      center.style.opacity = '0';         //fade out the middle bar of the icon
      top.style.transform = 'translateY(9px) rotate(45deg)';      //rotate the top and bottom bars to make a cross
      top.style.background = '#015138';     //change the color of the bars to green
      bottom.style.transform = 'translateY(-7px) rotate(-45deg)';
      bottom.style.background = '#015138';
      overlay.style.height = '120vh';     //make sure the overlay covers the whole screen
      options.style.display = 'block';      //make the options visible in the DOM
      setTimeout(function() {
        options.style.opacity = '1';      //fade in the text of the options after 300ms
      }, 300);
    } else {                  //if the menu is opened...
      center.style.opacity = '1';       //fade back in the center menu icon bar
      top.style.transform = 'translateY(0) rotate(0)';      //reset the rotation of the other bars
      top.style.background = 'white';     //reset their colors to white
      bottom.style.transform = 'translateY(0) rotate(0)';
      bottom.style.background = 'white';
      overlay.style.height = '0';       //shrink down the overlay
      options.style.opacity = '0';      //fade the options out
      setTimeout(function() {
        options.style.display = 'none';   //hide it from the DOM
      }, 300);
      document.body.overflowX = 'hidden';
      document.body.overflowY = 'hidden';
      $scope.mobileMenuOpen = false;      //set the variable which controls the menu to closed.
    }
  };
  
  /**
   * GET LECTURER INFO: Getter funttion that gets the information of a particular 
   * Lecturer based on the ID of the Lecturer of the currentCourse. The server uses
   * an int to represent a Lecturer so this method associates more details to that 
   * int using data in $scope.lecturers
   **/
  $scope.getLecturerInfo = function(){
    var lect = $scope.lecturers.find(function(el){      //iterate over the list 
      if(el.ID == $scope.currentCourse.LecturerID){
        return el;          //if the correct Lecturer is found, set lect to that
      }if($scope.currentCourse.LecturerID == 1){  //if the LecturerID for the currentCourse is an int..
        return $scope.lecturers[0];     //return data for Cathal if LecturerID == 1
      }if($scope.currentCourse.LecturerID == 2){
        return $scope.lecturers[1];   //or return data for Jesse if LecturerID == 2
      }
    });
    $scope.currentLecturer = lect;    //set the currentLecturer to the one found using the function
  };
  
    /**----------------------------------------------------------------
   * API CALLS AGAIN
   * Functions tp POST, DELETE server data
   * --------------------------------------------------------------**/
  
  

  /**UPDATE COURSE**/
  var apiUpdateCourse = function(course){
    $http({
      method: 'POST',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/update.course_directory.json',
      data: course
    });
  }; 
  
  
  /**DELETE COURSE**/
  var apiDeleteCourse = function(course){
    $http({
      method: 'DELETE',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/delete.course.' + course.ID + '.json',
      data: JSON.stringify(course)
    });
  };
  
  /**UPDATE ASSIGNMENT**/
  var apiUpdateAssignment = function(assignment){
    $http({
      method: 'POST',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/update.assignment_directory.json',
      data: JSON.stringify(assignment)
    });
  };
  
  /**DELETE ASSIGNMENT**/
  var apiDeleteAssignment = function(assignment){
     $http({
      method: 'DELETE',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/delete.assignment.' + assignment.ID + '.json',
      data: JSON.stringify(course)
    });
  };
  
  /**POST ASSOCIATION**/
  var  apiPostAssociation = function(association){
    $http({
      method: 'POST',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/update.course_association_directory.json',
      data: JSON.stringify(association)
    });
  };
  
  /**UPDATE ASSOCIATION**/
  var apiUpdateAssociation = function(association){
    $http({
      method: 'POST',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/update.course_association_directory.json',
      data: JSON.stringify(association)
    });
  };
  
  /**DELETE ASSOCIATION**/
  var apiDeleteAssociation = function(association){
    $http({
      method: 'DELETE',
      url: 'https://caab.sim.vuw.ac.nz/api/wijesechet/delete.course_association.' + association.ID + '.json',
      data: JSON.stringify(association)
    });
  };
  

  /**----------------------------------------------------------------
   * ROUTING FUNCTIONS
   * Functions to handle which page the UI is on
   * --------------------------------------------------------------**/

  /**OPEN HOME **/
  $scope.openHome = function() {
    if ($scope.currentUser.UserType == 'student') {
      $scope.openFeed();
    } else {
      $scope.openDirectory();
    }
  };


  /**OPEN THE DIRECTORY**/
  $scope.openDirectory = function() {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    $scope.view = 'directory';
    document.body.overflowY = "auto";
  };

  /**OPEN THE LECTURERS COURSES**/
  $scope.openLectCourses = function() {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    $scope.view = 'directory';
  };

  /**OPEN THE ASSIGNMENTS PAGE**/
  $scope.openAssignments = function() {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    $scope.view = 'assignments';
  };

  /**OPEN THE COURSE FEED**/
  $scope.openFeed = function() {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    $scope.view = 'feed';
  };

  /**LOGOUT - OPEN THE LOGIN SCREEN**/
  $scope.logout = function() {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    //when a user clicks the Logout button, this function runs to log him out and go back to the Login Page
    $scope.view = 'login'; //set the view back to login so we get taken back to the loginscreen
    $scope.currentUser = {}; //set the 'currentUser' to no one
    $scope.showLoginError = false; //if there was still a login error showing from before, make sure it isnt when we go back to login
    document.body.style.overflowY = 'hidden'; //turn off the scrolling for the login page.
  };


  /**CHANGE TAB - For the subpages of the Course page. Takes the new subpage as the parameter 
  and changes the view of the Course page to reflect that.
  **/
  $scope.changeTab = function(newView) {
    if ($scope.mobileMenuOpen) {
      $scope.toggleMobileMenu();
    }
    var oldView = $scope.courseView; //remember what the previous tab was
    var oldTab = document.getElementById(oldView + '-tab'); //get the old tab element
    var newTab = document.getElementById(newView + '-tab'); //get the new tab element
    oldTab.classList.remove('active-tab'); //remove the 'current tab' styling on the old tab...
    newTab.classList.add('active-tab'); //add it to the new one

    $scope.courseView = newView; //change the view to the new tab
  };

  $scope.checkOffAssignment = function(assignment) {
    var line = document.getElementById(assignment.CourseID + '-' + assignment.Name);
    line.classList.add('assignment-done');
    console.log(line);
  };





  /** ------------------------------------------------------------
   * Functions to check inputs on New Course and Edit Course Forms
   * ------------------------------------------------------------**/


  $scope.codeValid = function(testCode) {
    if (testCode === null || testCode === "") {
      return true; //invalid testCode
    }
    var found = $scope.courses.find(function(el) {
      return el.ID == testCode;
    });
    return found;
  };

  $scope.nameValid = function(testName) {
    var found = $scope.courses.find(function(el) {
      return el.Name == testName;
    });
    return found;
  };

  $scope.lecturersValid = function(testLect) {
    var found = $scope.lecturers.find(function(el) {
      return el.name == testLect;
    });
    return found;
  };

  $scope.timesValid = function(testTime) {
    var found = $scope.lectureTimes.find(function(el) {
      return el == testTime;
    });
    return found;
  };

  $scope.trimesterValid = function(testTri) {
    var found = $scope.trimesters.find(function(el) {
      return el == testTri;
    });
    return found;
  };


  $scope.yearValid = function(testYear) {
    var found = $scope.years.find(function(el) {
      return el == testYear;
    });
    return found;
  };






});