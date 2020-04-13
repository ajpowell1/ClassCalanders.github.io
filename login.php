<?php
ini_set("session.cookie_httponly", 1);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'databases.php';

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$user = htmlentities($json_obj['username']);

//Query SQL database for user and validate password
$stmt = $mysqli->prepare("SELECT COUNT(*), username, hashed_pword FROM user_info WHERE username=?");
//Bind the parameter
$stmt->bind_param('s', $user);
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $username, $pwd_hash);
$stmt->fetch();
$pwd_guess = htmlentities($json_obj['password']);

// Compare the submitted password to the actual password hash        
if ($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
	//HTTP only cookies
	ini_set("session.cookie_httponly", 1);
	session_name('change');
	session_start();
	
	//$_SESSION['current_user'] = $username;
	$_SESSION['current_user'] = htmlentities($username); //XSS Security Precaution
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
		"user" => $_SESSION['current_user'], //is this okay
		"token" => $_SESSION['token']
    ));
	exit;
}
else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password."
	));
	exit;
}
?>