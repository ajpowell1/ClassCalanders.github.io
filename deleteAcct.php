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
$current_user = $_SESSION['current_user'];
$deleteUser = htmlentities($json_obj['deleteUser']);
$checkToken = htmlentities($json_obj['currentToken']);

if (!hash_equals($checkToken, $_SESSION['token'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "Token match error. Please re-login and try again."
        ));
    exit;
}
if ($deleteUser != $current_user) {
echo json_encode(array(
    "success" => false,
    "message" => "Account was not deleted. Username entered does not match current user."
    ));
exit;
}
//Query database to delete account
$stmt = $mysqli->prepare("DELETE from user_info where username=?");
if(!$stmt){
echo json_encode(array(
    "success" => false,
    "message" => "Account could not be deleted. Try again."
    ));
exit;
}
//Bind the parameter
$stmt->bind_param('s', $deleteUser);
$stmt->execute();
$stmt->close();

session_destroy(); //destroys the session

echo json_encode(array(
    "success" => true,
    "message" => "Account has been deleted."
    ));
exit;

?>