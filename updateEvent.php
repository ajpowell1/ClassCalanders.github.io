<?php

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
$event_id = $json_obj['event_id'];
$eventName = htmlentities($json_obj['eventName']);
$month = htmlentities($json_obj['month']);
$day = htmlentities($json_obj['day']);
$year = htmlentities($json_obj['year']);
$time = htmlentities($json_obj['time']);
$type = htmlentities($json_obj['eventType']);
$checkToken = $json_obj['currentToken'];

if (!hash_equals($checkToken, $_SESSION['token'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "Token match error. Please re-login and try again."
        ));
    exit;
}

//Query SQL database to check if the event has been shared with another user
$stmt = $mysqli->prepare("SELECT shared_with from events where event_id=? and month=? and day=? and year=? and username=?");
//Bind the parameter
$stmt->bind_param('sssss', $event_id, $month, $day, $year, $user);
$stmt->execute();
// Bind the results
$stmt->bind_result($shared_user);
$stmt->fetch();
$shared_with_user = $shared_user;
$stmt->close();
//If the event was shared with another user, update the event for the other user:        
if ($shared_with_user != null){
    $stmt2 = $mysqli->prepare("UPDATE events set name=?, month=?, year=?, day=?, time=?, type=? where event_id=? and username=?");
    if(!$stmt2){
        echo json_encode(array(
            "success" => false,
            "message" => "Event could not be updated. Try again."
            ));
        exit;
    }
    //Bind the parameter
    $stmt2->bind_param('ssssssss', $eventName, $month, $year, $day, $time, $type, $event_id, $shared_with_user);
    $stmt2->execute();
    $stmt2->close();
}

//Query SQL database to update event for the original user:
$stmt3 = $mysqli->prepare("UPDATE events set name=?, month=?, year=?, day=?, time=?, type=? where event_id=? and username=?");

if(!$stmt3){
echo json_encode(array(
    "success" => false,
    "message" => "Event could not be updated. Try again."
    ));
exit;
}
//Bind the parameter
$stmt3->bind_param('ssssssss', $eventName, $month, $year, $day, $time, $type, $event_id, $user);
$stmt3->execute();
$stmt3->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event has been updated."
    ));
exit;

?>