<?php 

include '../connection.php';

$flag = false;

//Get variables
if(!empty($_GET['moduleID'])){
	$moduleID = trim(htmlspecialchars($_GET['moduleID']));

}else{
	echo "Error: must have ID";
	$flag = true;
}

$desc = trim(htmlspecialchars($_GET['desc']));
$leader = trim(htmlspecialchars($_GET['leader']));
$credits = trim(htmlspecialchars($_GET['credits']));
$examPer = trim(htmlspecialchars($_GET['examPer']));
$cwPer = trim(htmlspecialchars($_GET['cwPer']));
$color = trim(htmlspecialchars($_GET['color']));

$title = trim(htmlspecialchars($_GET['title']));
$code = trim(htmlspecialchars($_GET['code']));

//If passes validation
if($flag == false){
	sleep(2);
	$stmt = $conn->prepare("UPDATE module_info SET 
		description = ?,
		leader = ?,
		credits = ?,
		examPercent = ?,
		cwPercent = ?,
		color = ? 
		WHERE moduleID = ?;");
	$stmt->bind_param('ssiiisi',
	$desc,
	$leader,
	$credits,
	$examPer,
	$cwPer,
	$color,
	$moduleID);

	
	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}

	$stmt = $conn->prepare("UPDATE modules SET 
		title = ?,
		code = ?
		WHERE ID = ?;");
	$stmt->bind_param('ssi',
	$title,
	$code,
	$moduleID);

	
	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}

}

$conn->close();

?>