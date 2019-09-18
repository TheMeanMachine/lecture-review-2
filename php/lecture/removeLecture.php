<?php 

include '../connection.php';

$flag = false;


//Get variables
if(!empty($_GET['id'])){
	$id = trim(htmlspecialchars($_GET['id']));
}else{
	echo "Error: must have id";
	$flag = true;
}

//If passes validation
if($flag == false){
	sleep(2);
	$stmt = $conn->prepare("DELETE FROM lecture_info WHERE lectureID = ?");
	$stmt->bind_param('i',
		$id);

	$stmt->execute();

	$stmt = $conn->prepare("DELETE FROM lecture WHERE id = ?");
	$stmt->bind_param('i',
		$id);

	$stmt->execute();

}


$conn->close();
?>