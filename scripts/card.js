class myApp{
    constructor(){
        this.modules = {
            "year" : {
                "1" : {
                    "sem" : {
                        "1" : [],
                        "2" : []
                    }
                },
                "2": {
                    "sem" : {
                        "1" : [],
                        "2" : []
                    }
                },
                "3" : {
                    "sem" : {
                        "1" : [],
                        "2" : []
                    }
                }
            }
        };
        
        makeModuleList();
        
    }
    
}

function makeModuleList(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);//Parses API json into key-value pairs
            //console.log(myArr);
            if(myArr.length > 0){//If data exists

                for(var i = 0; i < myArr.length; i++){//Go through array
                    var id = myArr[i]['ID'];
                    var code = myArr[i]['code'];
                    var title = myArr[i]['title'];
                    
                    var desc = myArr[i]['description'];
                    var leader = myArr[i]['leader'];
                    var credits = myArr[i]['credits'];
                    var examPer = myArr[i]['examPercent'];
                    var cwPer = myArr[i]['cwPercent'];
                    
                    var year = myArr[i]['year'];
                    var sem = myArr[i]['semester'];
                    
                    var newMod = new module(id,
                                           title,
                                           code,
                                           sem,
                                           year,
                                           desc,
                                           leader,
                                           credits,
                                           examPer,
                                           cwPer);
                    //console.log(newMod);
                    app.modules["year"][year]["sem"][sem].push(newMod);
                }
                return myArr;
            }else{//Data doesn't exist

            }
        }
    };
    xmlhttp.open("POST", "http://localhost/lecRev2/module/getModules.php?", true);//URL
    xmlhttp.send();
}


class module{
    constructor(modID,title,code,semester,year,desc,leader,credits,examPer,cwPer){
        //details
        this.modID = modID;
        this.title = title;
        this.code = code;
        this.semester = semester;
        this.year = year;
        this.desc = desc;
        this.leader = leader;
        this.credits = credits;
        this.examPer = examPer;
        this.cwPer = cwPer;
        this.lectures = [];
        
        //elements
        this.noLecture;
        
        //function calls
        this.makeLectureList();
    }
    
    makeLectureList(){
        var module = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                
                var myArr = JSON.parse(this.responseText);//Parses API json into key-value pairs

                if( myArr != null && myArr.length > 0){//If data exists

                    for(var i = 0; i < myArr.length; i++){//Go through array
                        var lectureID = myArr[i]['lectureID'];
                        var week = myArr[i]['week'];
                        var title = myArr[i]['title'];
                        var completed = myArr[i]['completed'];
                        var notes = myArr[i]['notes'];
                        var bookmark = myArr[i]['slideBookmark'];


                        module.lectures.push(new lecture(title, week, completed, notes, bookmark,lectureID));
                        

                    }
                    return myArr;
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", "http://localhost/lecRev2/lecture/getLecture.php?moduleID=" + module.modID, true);//URL
        xmlhttp.send();
    }
       
    draw(){
         var nolecture = document.getElementById("nolectures" + module)
    }
    
    display(){
        if(this.lectures.length >0){
            this.noLecture.style.display = "none";
        }else{
           
            this.noLecture.style.display = "";
        }
    }

    
    
}

class lecture{
    constructor(title,week,completed,notes,slideBookmark,lectureID){
        //details
        this.week = week;
        this.title = title;
        this.lectID = lectureID;
        this.completed = completed;
        this.notes = notes;
        this.slideBookmark = slideBookmark;
        
    }
    
    display(){
        
    }
}


var app = new myApp();
