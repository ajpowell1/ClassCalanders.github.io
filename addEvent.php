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
//Query SQL database to add event to the database
$stmt = $mysqli->prepare("INSERT into events(username, name, month, day, year, time, type) values (?, ?, ?, ?, ?, ?, ?)");

if(!$stmt){
    echo json_encode(array(
    "success" => false,
    "message" => "Event couldn't be added. Try again."
    ));
    exit;
}
//Bind the parameter
$stmt->bind_param('sssssss', $user, $eventName, $month, $day, $year, $time, $type);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event was added!"
    ));
exit;

?>