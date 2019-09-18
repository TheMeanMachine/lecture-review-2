<?php 
include '../connection.php';
$flag = false;


//If passes validation
if($flag == false){
	$sql;

	$sth = mysqli_query($conn, "SELECT * FROM module_info 
		INNER JOIN modules
		on modules.id=module_info.moduleID;");
	$rows = array();
	while($r = mysqli_fetch_assoc($sth)) {
	    $rows[] = $r;
	}

	echo json_encode($rows);
}


$conn->close();
?>