//PHP URL's
let userInfoUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/userInfo.php';
let loginUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/login.php';
let registerUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/register.php';
let addEventUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/addEvent.php';
let deleteEventUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/deleteEvent.php';
let logoutUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/logout.php';
let printEventsUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/printEvents.php';
let deleteAcctUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/deleteAcct.php';
let shareEventURL = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/shareEvent.php';
let printEventTypeUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/printEventType.php';
let updateEventUrl = 'http://ec2-18-221-194-53.us-east-2.compute.amazonaws.com/~priyankaB99/module5-group-module5-466622-464319/updateEvent.php';

//Holds currently drawn Month and Year values, currentToken, and user selected Event Type filters
let drawnMonth;
let drawnYear;
let eventTypes = [];
let currentToken;

//Clears main calendar elements to be redrawn
const clearCal = function() {
    document.getElementById("month_and_year").innerHTML = "";
    document.getElementById("tbody").innerHTML = "";
}
//Calls drawCalendar using current drawnMonth and drawnYear
const currentCal = function() {
    fetch(userInfoUrl, {
        headers: { 'content-type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(function(response) {
        drawCalendar(drawnYear, drawnMonth, response.logged); //...based on if user is loggedIn
    })
    .catch(err => console.error(err));
}
//Finds today's date information and calls the drawCalendar function
const todayCal = function() {
    let today = new Date();
    let curYear = today.getFullYear();
    let curMonth = today.getMonth();
    fetch(userInfoUrl, {
        headers: { 'content-type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(function(response) {
        drawCalendar(curYear, curMonth, response.logged); //...based on if user is loggedIn
    })
    .catch(err => console.error(err));
    
}
//Identifies previous month/year and calls drawCalendar
const previous = function() {
    if (drawnMonth == 0) {
        let prevMonth = 11;
        let prevYear = drawnYear - 1;
        fetch(userInfoUrl, {
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(response) {
            drawCalendar(prevYear, prevMonth, response.logged); //...based on if user is loggedIn
        })
        .catch(err => console.error(err));
    }
    
    else {
        let prevMonth = drawnMonth - 1;
        let prevYear = drawnYear;
        fetch(userInfoUrl, {
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(response) {
            drawCalendar(prevYear, prevMonth, response.logged);
        })
        .catch(err => console.error(err));
    }
}
//Identifies next month/year and calls draw calendar
const next = function() {
    if (drawnMonth == 11) {
        let prevMonth = 0;
        let prevYear = drawnYear + 1;
        fetch(userInfoUrl, {
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(response) {
            drawCalendar(prevYear, prevMonth, response.logged); //...based on if user is loggedIn
        })
        .catch(err => console.error(err));
    }
    else {
        let prevMonth = drawnMonth + 1;
        let prevYear = drawnYear;
        fetch(userInfoUrl, {
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(response) {
            drawCalendar(prevYear, prevMonth, response.logged);
        })
        .catch(err => console.error(err));
    }
}
//months
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//draws calendar, populates Month and Year Label and days of the month
const drawCalendar = function(year, month, loggedIn) {
    drawnMonth = month; //sets currently drawn variables
    drawnYear = year;

    clearCal(); //clear calendar drawing

    let ymTag = document.createElement("h2"); //create Month Year tag
    ymTag.appendChild(document.createTextNode(months[month]+" "+year));
    ymTag.id = "myChild";
    document.getElementById("month_and_year").appendChild(ymTag);

    let theMY = new Date(year, month); //draw Calendar
    let firstDay = theMY.getDay();
    let numberDays = new Date(year, month+1, 0).getDate();
    let dayCounter = 0;
    for (let i = 0; i < 5; i++) {
        let r = document.createElement("tr");
        for (let y = 0; y < 7; y++) {
            let d = document.createElement("td");
            if (dayCounter < firstDay) {
                d.id = "nullDay";
                d.innerHTML = "   ";
                r.appendChild(d);
            }
            else if (dayCounter >= firstDay && dayCounter < (numberDays + firstDay)) { //within valid dates, so draw calendar dates
                d.id = (dayCounter - (firstDay - 1)).toString();
                let date = document.createElement("p");
                date.appendChild(document.createTextNode((dayCounter - (firstDay - 1)).toString()));
                d.appendChild(date);
                maxDate = dayCounter - (firstDay - 1); //set max possible date for this month

                if (loggedIn) {
                    const print_date = dayCounter - (firstDay - 1);
                    const print_month = months[month];
                    const print_year = year;
                        //Submit fetch request to print events associated with the current user                    
                        const printData = { 'print_date': print_date, 'print_month': print_month, 'print_year': print_year };
                        fetch(printEventsUrl, {
                            method: 'POST',
                            body: JSON.stringify(printData),
                            headers: { 'content-type': 'application/json' }
                        })
                        .then(resp => resp.json())
                        .then(function(data) {
                            let events = data.events;
                            if (eventTypes.length > 0) { //print only specified event types
                                for (let i = 0; i < events.length; i++) { 
                                    if (eventTypes.includes(events[i][2])) {
                                        let eventNode = document.createElement("div");
                                        eventNode.classList.add("eventdiv");
                                        eventNode.classList.add(events[i][0]);
                                        eventNode.classList.add(events[i][3]);
                                        eventNode.classList.add(events[i][2]);
                                        eventNode.id = events[i][1];
                                        eventNode.appendChild(document.createTextNode(events[i][0]+" "+events[i][1]));
                                        d.appendChild(eventNode);
                                        d.appendChild(document.createElement("br"));
                                    }   
                                }
                            }
                            else { //print all events
                                for (let i = 0; i < events.length; i++) { 
                                    let eventNode = document.createElement("div");
                                    eventNode.classList.add("eventdiv");
                                    eventNode.classList.add(events[i][0]);
                                    eventNode.classList.add(events[i][3]);
                                    eventNode.classList.add(events[i][2]);
                                    eventNode.id = events[i][1];
                                    eventNode.appendChild(document.createTextNode(events[i][0]+" "+events[i][1]));
                                    d.appendChild(eventNode);
                                    d.appendChild(document.createElement("br"));
                                }
                            }
                            loggedInExtras(data.user); //create all other logged in elements
                        })
                        .catch(err => console.error(err));
                }
                r.appendChild(d);
            }
            else {
                d.id = "nullDay";
                d.innerHTML = "   ";
                r.appendChild(d);
            }
            dayCounter++;
        }
        r.classList.add("tableChildren");
        document.getElementById("tbody").appendChild(r);
    }
}
//is called in drawCalendar if user is logged in
const loggedInExtras = function(current_user) {
    //prints current user
    let currentUserSpot = document.getElementById('printCurrentUser');
    currentUserSpot.innerHTML = "";
    let userText = document.createElement("h3");
    userText.appendChild(document.createTextNode("Current User: " + current_user));
    currentUserSpot.appendChild(userText);

    //hide login and create account fields
    document.getElementById('username').hidden = true;
    document.getElementById('password').hidden = true;
    document.getElementById('login_btn').hidden = true;
    document.getElementById('reg_username').hidden = true;
    document.getElementById('reg_password').hidden = true;
    document.getElementById('reg_email').hidden = true;
    document.getElementById('reg_btn').hidden = true;

    //"Logout" button appears when the user has logged in successfully:
    document.getElementById('logout').innerHTML = "";
    $("#logout").append("<button id='logout_btn'>Log Out</button>");
    // Bind the logout AJAX call to logout button click
    document.getElementById("logout_btn").addEventListener("click", logout, false);

    //"Delete Account" button appears when the user has logged in successfully:
    document.getElementById('deleteAcct').innerHTML = "";
    $("#deleteAcct").append("<button id='deleteAcct_btn'>Delete Account</button>");
    // Bind the logout AJAX call to delete account button click
    document.getElementById("deleteAcct_btn").addEventListener("click", deleteAcct, false);
                
    //"Add an Event" button appears when the user has logged in successfully:
    document.getElementById('eventAdder').innerHTML = "";
    $("#eventAdder").append("<button id='addEvent_btn'>Add Event</button>");
    // Bind the addEvent AJAX call to delete event button click
    document.getElementById("addEvent_btn").addEventListener("click", addEventBox, false);

    //"Show events of ____ categories" button appears when the user has logged in successfully:
    document.getElementById('eventCategorizer').innerHTML = "";
    $("#eventCategorizer").append(
        "<strong>Show events of type: </strong> &nbsp;<input type='checkbox' id='work'/>Work &nbsp;<input type='checkbox' id='school'/>School &nbsp;<input type='checkbox' id='family'/>Family &nbsp;<input type='checkbox' id='other'/>Other &nbsp;<button id='filterEvents'>Filter</button> &nbsp;<button id='clearFilters'>Clear Filters</button>");
    // Bind the AJAX call to print out the event types that have been checked
    document.getElementById("filterEvents").addEventListener("click", updateEventFilter, false); //call updateEventFilter function
    document.getElementById("clearFilters").addEventListener("click", function() { //resets list of current filters
        eventTypes = [];
        currentCal();
    }, false);
    //makes printed events clickable
    let eventdivs = document.getElementsByClassName("eventdiv");
    for(let i=0; i<eventdivs.length; i++) {
        eventdivs[i].addEventListener("click", eventOptions, false);
    }
}

const updateEventFilter = function() {
    eventTypes = [];
    if (document.getElementById("work").checked) {
        eventTypes.push("Work");
    }
    if(document.getElementById("school").checked) {
        eventTypes.push("School");
    }
    if(document.getElementById("family").checked) {
        eventTypes.push("Family");
    }
    if (document.getElementById("other").checked) {
        eventTypes.push("Other");
    }
    currentCal();
}

const login = function (event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const loginData = { 'username': username, 'password': password };
 
    fetch(loginUrl, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(data) {
            alert(data.success ? 'You are logged in!' : `You were not logged in. ${data.message}`);
            if (data.success) {
                currentCal();
                currentToken = data.token;
            }
        })
        .catch(err => console.error(err));

}
const register = function (event) {
    const reg_username = document.getElementById("reg_username").value; // Get the username from the form
    const reg_password = document.getElementById("reg_password").value; // Get the password from the form
    const reg_email = document.getElementById("reg_email").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const regData = { 'reg_username': reg_username, 'reg_password': reg_password, 'reg_email': reg_email };

    fetch(registerUrl, {
            method: 'POST',
            body: JSON.stringify(regData),
            headers: { 'content-type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(function(data) {
            alert(data.success ? 'Youve been registered!' : `You were not registered. ${data.message}`);
            if (data.success) {
                currentCal();
                currentToken = data.token;
            }
        })
        .catch(err => console.error(err));
}
//Creates and opens modal window if event div is pressed
const eventOptions = function(event) {
    // Show the modal window
    document.getElementById("eventModal").style.display = "block";
    // Displays event information and delete/update event options
    document.getElementById("eventOptions").innerHTML = "";
    let date = event.path[1].id;
    let eventName = event.path[0].id;
    let time = event.path[0].classList[1];
    let event_id = event.path[0].classList[2];
    let event_type = event.path[0].classList[3];
    //$("#eventOptions").append(`<strong>Event Name: </strong> ${eventName}<br><br>`);
    $("#eventOptions").append(`<strong>Event Name: </strong> ${eventName} <br><br>`);
    $("#eventOptions").append(`<strong>Date: </strong> ${months[drawnMonth]} ${date}, ${drawnYear}<br><br>`);
    $("#eventOptions").append(`<strong>Time: </strong> ${time}<br><br>`);
    $("#eventOptions").append(`<strong>Type: </strong> ${event_type}<br><br>`);
    $("#eventOptions").append(`<br><button id='deleteEvent_btn' name='${event_id}' class='${date}'>Delete Event</button>&nbsp;&nbsp;<button id='updateEvent_btn' name='${eventName}' class='${event_id} ${date} ${event_type}'>Update Event</button>`);
    document.getElementById("deleteEvent_btn").addEventListener("click", deleteEvent, false); //calls delete event function
    document.getElementById("updateEvent_btn").addEventListener("click", updateEventBox, false); //calls update event function
}
// Creates and opens modal window to add an event if Add Event button is selected
const addEventBox = function(event) {
    // Show the modal window
    document.getElementById("addEventModal").style.display = "block";
    // Allows user to input event information
    document.getElementById("addEventInfo").innerHTML = "";
    $("#addEventInfo").append(`Month: <input type='text' id='add_month' value='${months[drawnMonth]}' /> &nbsp;Date: <input type='text' id='add_date' placeholder='Date' /> &nbsp;Year: <input type='text' id='add_year' value='${drawnYear}' /><br><br>`);
    $("#addEventInfo").append(`Event Name: <input type='text' id='add_eventName' placeholder='Event Name' /> &nbsp;Time: <input type='time' id='add_time' placeholder='4:20pm' /><br><br>`);
    $("#addEventInfo").append(
        "Choose Event Category: <input type='radio' name='addEventType' id='event_work'/>Work &nbsp;<input type='radio' name='addEventType' id='event_school'/>School &nbsp;<input type='radio' name='addEventType' id='event_family'/>Family &nbsp;<input type='radio' name='addEventType' id='event_other'/>Other<br><br>");
    $("#addEventInfo").append(`<br><button id='addEventInfo_btn'>Add Event</button>`);
    document.getElementById("addEventInfo_btn").addEventListener("click", addEvent, false); //calls add event function
}
// Adds event to database
const addEvent = function(event) {
    const eventName = document.getElementById("add_eventName").value;
    const month = document.getElementById("add_month").value;
    const day = document.getElementById("add_date").value;
    const year = document.getElementById("add_year").value;
    const time = document.getElementById("add_time").value;
    const sharedUser = prompt("If you would like to share this event with another user, enter their username. If not, press cancel.", "example_username"); // Get shared user from prompt
    let eventType; //set event type
    if (document.getElementById("event_work").checked) {
        eventType = "Work";
    }
    if(document.getElementById("event_school").checked) {
        eventType = "School";
    }
    if(document.getElementById("event_family").checked) {
        eventType = "Family";
    }
    if (document.getElementById("event_other").checked) {
        eventType = "Other";
    }
    // finds max possible date for this month to sanitize user date input
    let maxDate = new Date(year, months.indexOf(month)+1, 0).getDate();

    if (eventName != '' && time != '' && day != '' && year != '' && months.includes(month) && (year>0) && (day>0) && (day<=maxDate) && eventType != null && eventType != '') {   
        // Add event information with current user to database 
        const eventData = { 'eventName': eventName, 'month': month, 'day': day, 'year': year, 'time': time, 'sharedUser': sharedUser, 'eventType': eventType, 'currentToken': currentToken };
        fetch(addEventUrl, {
                method: 'POST',
                body: JSON.stringify(eventData),
                headers: { 'content-type': 'application/json' }
            })
            .then(resp => resp.json())
            .then(function(data) {
                currentCal();
                alert(data.message);
                document.getElementById("addEventModal").style.display = "none";
            })
            .catch(err => console.error(err));
        //Checks to see if they would like to share the event with another user, and if so, does so:
        if (sharedUser != null && sharedUser != '') {
            fetch(shareEventURL, {
                method: 'POST',
                body: JSON.stringify(eventData),
                headers: { 'content-type': 'application/json' }
            })
            .then(resp => resp.json())
            .then(function(data) {
                alert(data.message);
            })
            .catch(err => console.error(err));
        }
    }
    else {
        alert("Entered Month, Date, Time, and/or Year is not valid. Must select an event type. Try again.");
    }  
}
//Creates and opens modal window to allow user to update an event
const updateEventBox = function(event) {
    // Remove previous event options modal window
    document.getElementById("eventModal").style.display = "none";
    // Show the update event modal window
    document.getElementById("addEventModal").style.display = "block";
    // Allows user to update event information
    const eventName = event.path[0].name;
    const event_id = event.path[0].classList[0];
    const date = event.path[0].classList[1];
    const event_type = event.path[0].classList[2];
    document.getElementById("addEventInfo").innerHTML = "";
    $("#addEventInfo").append(`Month: <input type='text' id='upd_month' value='${months[drawnMonth]}' /> &nbsp;Date: <input type='text' id='upd_date' value='${date}' /> &nbsp;Year: <input type='text' id='upd_year' value='${drawnYear}' /><br><br>`);
    $("#addEventInfo").append(`Event Name: <input type='text' id='upd_eventName' value='${eventName}' /> &nbsp;Time: <input type='time' id='upd_time' placeholder='4:20pm' /><br><br>`);
    $("#addEventInfo").append(
        "Change Event Category: <input type='radio' name='addEventType' id='upd_work'/>Work &nbsp;<input type='radio' name='addEventType' id='upd_school'/>School &nbsp;<input type='radio' name='addEventType' id='upd_family'/>Family &nbsp;<input type='radio' name='addEventType' id='upd_other'/>Other<br><br>");
    $("#addEventInfo").append(`<br><button id='updateEventInfo_btn' name='${event_id}'>Update Event</button>`); //passes in event id
    document.getElementById("updateEventInfo_btn").addEventListener("click", updateEvent, false); //calls update event function
    //set type radio button to be original event type
    if (event_type == "Work") {
        document.getElementById('upd_work').checked = true;
    }
    if(event_type == "School") {
        document.getElementById('upd_school').checked = true;
    }
    if(event_type == "Family") {
        document.getElementById('upd_family').checked = true;
    }
    if (event_type == "Other") {
        document.getElementById('upd_other').checked = true;
    }
}

const updateEvent = function(event) { 
    const eventName = document.getElementById("upd_eventName").value;
    const month = document.getElementById("upd_month").value;
    const day = document.getElementById("upd_date").value;
    const year = document.getElementById("upd_year").value;
    const time = document.getElementById("upd_time").value;
    const event_id = event.path[0].name;

    let eventType; //set event type
    if (document.getElementById("upd_work").checked) {
        eventType = "Work";
    }
    if(document.getElementById("upd_school").checked) {
        eventType = "School";
    }
    if(document.getElementById("upd_family").checked) {
        eventType = "Family";
    }
    if (document.getElementById("upd_other").checked) {
        eventType = "Other";
    }
    // finds max possible date for this month to sanitize user date input
    let maxDate = new Date(year, months.indexOf(month)+1, 0).getDate();

    if (eventName != '' && time != '' && day != '' && year != '' && months.includes(month) && (year>0) && (day>0) && (day<=maxDate) && eventType != null && eventType != '') {
        // Make a URL-encoded string for passing POST data:
        const eventData = { 'event_id': event_id, 'eventName': eventName, 'month': month, 'day': day, 'year': year, 'time': time, 'eventType': eventType, 'currentToken': currentToken };
        fetch(updateEventUrl, {
                method: 'POST',
                body: JSON.stringify(eventData),
                headers: { 'content-type': 'application/json' }
            })
            .then(resp => resp.json())
            .then(function(data) {
                currentCal();
                alert(data.message);
                document.getElementById("addEventModal").style.display = "none";
            })
            .catch(err => console.error(err));
    }
    else {
        alert("Entered Month and/or Date and/or Year is not valid. Must select an event type. Try again.");
    }
}
// Deletes event from database
const deleteEvent = function(event) {
    const deleteConfirm = confirm("WARNING: This action is irreversible. Are you sure?"); 
    if (deleteConfirm != null) {
        const event_id = event.path[0].name;
        const day = event.path[0].className;
        const year = drawnYear;
        const month = months[drawnMonth];
        if (event_id != null) {
            // Make a URL-encoded string for passing POST data:
            const eventData = { 'event_id': event_id, 'month': month, 'day': day, 'year': year, 'currentToken': currentToken };
            fetch(deleteEventUrl, {
                    method: 'POST',
                    body: JSON.stringify(eventData),
                    headers: { 'content-type': 'application/json' }
                })
                .then(resp => resp.json())
                .then(function(data) {
                    currentCal();
                    document.getElementById("eventModal").style.display = "none";
                    if (data.success) {
                        document.getElementById("eventOptions").innerHTML = "";
                    }
                    alert(data.message);
                })
                .catch(err => console.error(err));
        }  
        else {
            alert("Event wasn't able to be deleted. Try again.");
        }
    }
    else {
        alert("Event wasn't deleted.");
    }   
}
// Destroys session (in PHP file) and resets all logged in-related elements
const logout = function() {
    fetch(logoutUrl, {
        headers: { 'content-type': 'application/json' }
    })
    .then(function() {
        currentCal();
        currentToken = '';
        eventTypes = []; //clears all logged in elements
        document.getElementById('printCurrentUser').innerHTML = "";
        document.getElementById('eventAdder').innerHTML = "";
        document.getElementById('eventCategorizer').innerHTML = "";
        document.getElementById('logout').innerHTML = "";
        document.getElementById('deleteAcct').innerHTML = "";
        document.getElementById("eventOptions").innerHTML = "";
    })
    .catch(err => console.error(err));

    //Show login and register fields once the user has logged out
    document.getElementById('username').hidden = false;
    document.getElementById('password').hidden = false;
    document.getElementById('login_btn').hidden = false;
    document.getElementById('reg_username').hidden = false;
    document.getElementById('reg_password').hidden = false;
    document.getElementById('reg_email').hidden = false;
    document.getElementById('reg_btn').hidden = false;
} 
// Deletes user using AJAX request and destroys session (in PHP file)
const deleteAcct = function() {
    const deleteUser = prompt("WARNING: This action is irreversible! Type in your username exactly to confirm account deletion.", ""); 
    if (deleteUser != null) { //if user doesn't press cancel
        // Make a URL-encoded string for passing POST data:
        const deleteData = { 'deleteUser': deleteUser, 'currentToken': currentToken };
        fetch(deleteAcctUrl, {
                method: 'POST',
                body: JSON.stringify(deleteData),
                headers: { 'content-type': 'application/json' }
            })
            .then(resp => resp.json())
            .then(function(data) {
                currentCal();
                currentToken = '';
                eventTypes = []; //clears all logged in elements
                document.getElementById('printCurrentUser').innerHTML = "";
                document.getElementById('eventAdder').innerHTML = "";
                document.getElementById('eventCategorizer').innerHTML = "";
                document.getElementById('logout').innerHTML = "";
                document.getElementById('deleteAcct').innerHTML = "";
                document.getElementById("eventOptions").innerHTML = "";
                alert(data.message);
            })
            .catch(err => console.error(err));

        //Show login and register fields once the user has logged out
        document.getElementById('username').hidden = false;
        document.getElementById('password').hidden = false;
        document.getElementById('login_btn').hidden = false;
        document.getElementById('reg_username').hidden = false;
        document.getElementById('reg_password').hidden = false;
        document.getElementById('reg_email').hidden = false;
        document.getElementById('reg_btn').hidden = false;
    }
}

// General Event Listeners:
// Populate calendar with today's date when page is loaded
document.addEventListener("DOMContentLoaded", todayCal, false);
// Populate calendar with today's date when calednar title is pressed
document.getElementById("title").addEventListener("click", todayCal, false);
// Repopulate calendar when next and previous buttons are pressed
document.getElementById("previous").addEventListener("click", previous, false);
document.getElementById("next").addEventListener("click", next, false);
// Bind the login AJAX call to login button click
document.getElementById("login_btn").addEventListener("click", login, false); 
// Bind the login AJAX call to register button click
document.getElementById("reg_btn").addEventListener("click", register, false);

// Model Window Event Listeners:
// When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("eventModal").style.display = "none";
}
document.getElementsByClassName("close2")[0].onclick = function() {
    document.getElementById("addEventModal").style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("eventModal")) {
        document.getElementById("eventModal").style.display = "none";
    }
    else if (event.target == document.getElementById("addEventModal")) {
        document.getElementById("addEventModal").style.display = "none";
    }
}
