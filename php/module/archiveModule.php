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

//If passes validation
if($flag == false){
	sleep(3);
	$stmt = $conn->prepare("UPDATE modules SET 
		archived = 2
		WHERE ID = ?;");
	$stmt->bind_param('i',
	$moduleID);

	
	if(!$stmt->execute()){
		echo "Error"  . $stmt->error;
	}

}

$conn->close();

?>