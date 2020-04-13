<?php
ini_set("session.cookie_httponly", 1);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'databases.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//HTTP only cookies
ini_set("session.cookie_httponly", 1);
session_name('change');
session_start();
//User agent consistency
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
	die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}

//Variables can be accessed as such:
$user = $_SESSION['current_user'];
$month = htmlentities($json_obj['print_month']);
$date = htmlentities($json_obj['print_date']);
$year = htmlentities($json_obj['print_year']);

//Query SQL database to obtain events
$stmt = $mysqli->prepare("SELECT name, time, type, event_id from events where username=? and month=? and day=? and year=?");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "user" => $user,
        "message" => "Events couldn't be obtained."
    ));
    exit;
}
//Bind the parameter
$stmt->bind_param('ssss', $user, $month, $date, $year);
$stmt->execute();
    
// Bind the results
$stmt->bind_result($eventName, $eventTime, $eventType, $eventId);

$events = array(); 
while($stmt->fetch()) {
    $eventTriple = array(htmlentities($eventTime), htmlentities($eventName), htmlentities($eventType), htmlentities($eventId));
    array_push($events, $eventTriple);
}
echo json_encode(array(
    "success" => true,
    "user" => $user,
    "message" => "Events were successfully obtained.",
    "events" => $events
    ));
    exit;
    
?>