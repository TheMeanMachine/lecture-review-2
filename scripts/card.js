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
        
        this.makeModuleList();
         
        
    }
    
    makeModuleList(){
        var t = this;
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

                        
                        
                        var flag = true;
                        for(var j = 0; j < t.modules["year"][year]["sem"][sem].length; j++){
                            if(t.modules["year"][year]["sem"][sem][j].modID == id){
                                flag = false;
                            }
                        }
                        
                        (flag) ? t.modules["year"][year]["sem"][sem].push(newMod) : console.log("already exists");
                    }
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", "http://localhost/lecRev2/module/getModules.php", true);//URL
        xmlhttp.send();
    }

    
}

class card{
    constructor(){
        
    }
    toggleExpand(){

        if(this.expanded == 1){
            this.expanded = 2;
        }else{
            this.expanded = 1;
        }

        this.display();
    }
    
    toggleContents(){

        var contents = this.elements["contents"];
        if(this.expanded == 1){
            contents.style.maxHeight = "0px";
        }else{
            contents.style.maxHeight = "10000px";
        }
    }
    
    findElementByName(e, target){
        var cur = e;
        //console.log(cur.getAttribute("name"));
        if(cur.getAttribute("name") == target){
            return cur;
        }
        if(!cur.hasChildNodes){
            return;
        }
        
        var children = cur.children;
        for(var i =0; i < children.length; i++){
            //console.log(children.length);
            //console.log(i);
            cur = this.findElementByName(children[i], target);
            if(cur.getAttribute("name") == target){
                return cur;
            }
        }
        return cur;
       
    }
}


class module extends card{
    constructor(modID,title,code,semester,year,desc,leader,credits,examPer,cwPer){
        super();
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
        this.drawElements();
       // this.display();
        this.makeLectureList();
       
    }
    
    //Finds all the lectures associated with this module and add them to the lecture list
    makeLectureList(){
        var t = this;
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
                        
                        var flag = true;
                        for(var j = 0; j < t.lectures.length; j++){
                            if(t.lectures[j].lectID == lectureID){
                                flag = false;
                            }
                        }
                        
                        (flag) ? t.lectures.push(new lecture(title,
                                                             week,
                                                             completed,
                                                             notes,
                                                             bookmark,
                                                             lectureID,
                                                             t))
                        : console.log("already exists");
                        

                    }
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", "http://localhost/lecRev2/lecture/getLecture.php?moduleID=" + t.modID, true);//URL
        xmlhttp.send();
        
    }
    
    
       
    drawElements(){
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

class lecture extends card{
    constructor(title,week,completed,notes,slideBookmark,lectureID,module){
        super();
        //details
        this.week = week;
        this.title = title;
        this.lectID = lectureID;
        this.completed = completed;
        this.notes = notes;
        this.slideBookmark = slideBookmark;
        
        this.expanded = 1;
        
        //parent
        this.parentModule = module;
        
        //elements
        this.elements = {};
        
        this.drawElements();
        this.display();
        //console.log(this.elements);
        
        this.elements["expand"].addEventListener("click", this.toggleExpand.bind(this));
        this.elements["check"].addEventListener("click", this.toggleCheck.bind(this));
        this.elements["notes"].addEventListener("blur", this.updateInformation.bind(this));
    }
    
    deleteLecture(){
        var t = this;
        confirmThis("Are you sure?", "You're permanently deleting this lecture","CANCEL", "CONTINUE",function(){
            //Continue
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {

                    if(this.responseText.length <= 0){//If data exists
                        t.removeElements();
                        var lectureList = t.parentModule.lectures;
                        console.log(lectureList);
                        var lectureIndex = lectureList.indexOf(t);
                        delete lectureList[lectureIndex];
                        console.log(lectureList);

                    }else{
                        openToast("Something went wrong - try again later");
                    }
                }
            };
            xmlhttp.open("GET", "http://localhost/lecRev2/lecture/removeLecture.php?id=" + t.lectID, true);//URL
            xmlhttp.send();



        },function(){
            //Cancel
        });
    }
    
    drawElements(){
        var cardTemplate = document.createElement('div');
        cardTemplate.setAttribute('class', 'card');
        
        cardTemplate.innerHTML = `
            <div class="cHandle">
                <div class="cHandleOuter">
                    <div class="cHandleInner">
                        <div class="ch_lCheck">
                            <div class="ch_lCheckbox" name="check" check="">
                                <i class="material-icons" style="user-select: none">
                                </i>
                            </div>
                        </div>

                        <div class="ch_lText">
                            <div class="ch_lTextInner" name="week">
                                
                            </div>
                            <div class="ch_mTextInner" name="title">
                                
                            </div>

                        </div>


                        <div class="ch_rExpand" >
                            <div class="ch_rExpandInner">
                                <div class="ch_rExpandInnerText" name="expand">
                                    <i class="material-icons" style="" >
                                        add
                                    </i>

                                </div>
                            </div>

                        </div>
                    </div>  
                </div>
            </div>
            <div class="cContents" id="module" name="contents">
                            <!--For specific uses-->
                            <div class="ccNavbar">
                                <div class="ccNavbarInner">
                                    <div class="ccNBbookmarkOuter">
                                        <div class="ccNBbookmarkInner">
                                            Slide
                                            <input class="ccNBbookmark" type="number" name="bookmark" value="" min="0" max="150">
                                        </div>
                                    </div>
                                    <div class="ccNBactionOuter">
                                        <div class="ccNBactionInner">
                                            <div class="ccNBactionbut" name="edit">
                                                <i class="material-icons" id="centretext" style="" >
                                                    edit
                                                </i>
                                            </div>
                                            <div class="ccNBactionbut" name="delete">
                                                <i class="material-icons" id="centretext" style="" >
                                                    delete
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="ccTextNotesOuter">
                                <textarea class="ccTextNotes" name="notes" placeholder="Notes"  onblur="updateLectureInfo(this);"></textarea>
                            </div>


                        </div>
        `;
        
        this.elements["outer"] = cardTemplate;
        
        var temp  = ["check","title","expand","contents","bookmark","edit","delete","notes","week"];
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }
        
         //Attach itself
        document.getElementById("pc").appendChild(this.elements["outer"]);
        //this.display();
    }
    
   
    
    removeElements(){
        
        var outer = this.elements["outer"];
        var parent = outer.parentNode;
        parent.deleteChildren(outer);
    }
    
    display(){
       
        
        //Set the checkbox
        var checkText;
        (this.completed == 1) ? checkText = "check_box_outline_blank" : checkText = "check_box";
        //console.log();
        this.elements["check"].children[0].innerHTML = checkText;
        
        //Set the title
        this.elements["title"].innerHTML = this.title;
        
        //expanded
        var expand = this.elements["expand"];
        var expandText = "";
        (this.expanded == 1) ? expandText = "add" : expandText = "remove";
        expand.children[0].innerHTML = expandText;
        //contents
        this.toggleContents();
        
        //bookmark
        this.elements["bookmark"].value = this.slideBookmark;

        //notes
        this.elements["notes"].innerHTML = this.notes;
        
        //week
        this.elements["week"].innerHTML = this.week;
        
    }
    
    toggleCheck(){

        if(this.completed == 1){
            this.completed = 2;
        }else{
            this.completed = 1;
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://localhost/lecRev2/lecture/updateLectureInformation.php?lectureID=" + this.lectID + "&complete=" + this.completed, true);
        xmlhttp.send();
        this.display();
    }
    
    updateInformation(){
        
    }
}


var app = new myApp();
