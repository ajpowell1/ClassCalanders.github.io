<?php
ini_set("session.cookie_httponly", 1);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'databases.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$reg_username = htmlentities($json_obj['reg_username']);
$reg_password = password_hash($json_obj['reg_password'], PASSWORD_BCRYPT);
$reg_email = htmlentities($json_obj['reg_email']);

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM user_info WHERE username=?");
//Bind the parameter
$stmt->bind_param('s', $reg_username);
$stmt->execute();
// Bind the results
$stmt->bind_result($cnt);
$stmt->fetch();
$count = $cnt;
$stmt->close();

if ($count == 0) {

    $stmt2 = $mysqli->prepare("INSERT into user_info(username, hashed_pword, email) values (?, ?, ?)");
    if(!$stmt2){
        printf("Query Prep Failed: %s\n", $mysqli->error); //should we keep this?
        exit;
    }
    $stmt2->bind_param('sss', $reg_username, $reg_password, $reg_email);
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
    //$_SESSION['current_user'] = $reg_username;
    $_SESSION['current_user'] = htmlentities($reg_username); //XSS Security Precaution
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    $stmt2->execute();
    $stmt2->close();
  
    echo json_encode(array(
    "success" => true,
    "user" => $_SESSION['current_user'], //is this okay
    "token" => $_SESSION['token']
    ));
    exit;
}
else {
    echo json_encode(array(
    "success" => false,
    "message" => "Username already exists. Try again."
    ));
    exit;
}
?>