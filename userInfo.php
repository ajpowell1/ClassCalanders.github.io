<?php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'databases.php';

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

if (isset($_SESSION['current_user'])) {
    echo json_encode(array(
        "logged" => true,
        "user" => $_SESSION['current_user']
    ));
    exit;
}
else {
    echo json_encode(array(
        "logged" => false
    ));
    exit;
}
?>