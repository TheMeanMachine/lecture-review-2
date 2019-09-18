
<?php 
include '../connection.php';


$flag = false;


//Get variables
if(!empty($_GET['module'])){
	//Mandatory
	$module = trim(htmlspecialchars($_GET['module']));


}else{
	echo "Error: must have module";
	$flag = true;
}





//If passes validation
if($flag === false){
	
	sleep(2);

	$stmt = $conn->prepare("INSERT INTO lecture (moduleID)
		VALUES (?)");
	$stmt->bind_param('i',
	$module);

	if($stmt->execute()){
		$last_id = $conn->insert_id;//Get the ID from the previous insert

		$stmt = $conn->prepare("INSERT INTO lecture_info (lectureID)
			VALUES (?)");
		$stmt->bind_param('i',
		$last_id);

		if($stmt->execute()){

			echo json_encode($last_id);
		}else{
			echo "Error"  . $stmt->error;
		}


	}else{
		echo "Error @ 1st step"  . $stmt->error;
	}
}


$conn->close();
?>