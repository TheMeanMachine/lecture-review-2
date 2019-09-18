<?php 
include '../connection.php';

$flag = false;

//Get variables
if(!empty($_GET['moduleID'])){
	$module = trim(htmlspecialchars($_GET['moduleID']));
}else{
	echo "Error: must have moduleID";
	$flag = true;
}


//If passes validation
if($flag == false){
	$stmt = $conn->prepare("SELECT * FROM lecture
		INNER JOIN lecture_info
		ON lecture.id=lecture_info.lectureID
		WHERE lecture.moduleID = ? 
		ORDER BY lecture.week ASC;");
		$stmt->bind_param('i',
		$module);

		$stmt->execute();
		$res = $stmt->get_result();
		
	
	$rows = array();
	while($r = $res->fetch_assoc()) {
	    $rows[] = $r;
	}

	echo json_encode($rows);


}

$conn->close();
?>