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
                        /////////
                        var temp = ["white","orange","red","blue","purple"];
                        var color = temp[Math.floor(Math.random() * temp.length)];

                        var newMod = new module(id,
                                               title,
                                               code,
                                               sem,
                                               year,
                                               desc,
                                               leader,
                                               credits,
                                               examPer,
                                               cwPer,
                                               color);

                        
                        
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
        this.colors = {
            "white":{
                "primary" : "#FFFFFF",
                "secondary" : "#212121",
                "tertiary" : "#7F838C"
            },
            "orange":{
                "primary" : "#FFA726",
                "secondary" : "#212121",
                "tertiary" : "#FFF3E0"
            },
            "red":{
                "primary" : "#FF7043",
                "secondary" : "#212121",
                "tertiary" : "#FFCCBC"
            },
            "blue":{
                "primary" : "#42A5F5",
                "secondary" : "#212121",
                "tertiary" : "#BBDEFB"
            },
            "purple":{
                "primary" : "#7E57C2",
                "secondary" : "#212121",
                "tertiary" : "#D1C4E9"
            }
        };
    }
    
    toggleContents(){
        var maxHeight = 0;
        var contents = this.elements["contents"];
        
        if(this.expanded == 1){//Closing
            this.expanded = 0;

        }else{
            this.expanded = 1;
            if(this.lectures){
                //Is a module
                maxHeight = this.calculateMaxHeight();

            }else{
                //Is a lecture
                maxHeight = 150;
                //Expand the parent module to account for the expanded lecture
                var parentModuleContents = this.parentModule.elements["contents"];
                parentModuleContents.style.maxHeight = this.parentModule.calculateMaxHeight();
            }
            
            
            
        }
        contents.style.maxHeight = maxHeight + "px"; 
        this.display();
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
    constructor(modID,title,code,semester,year,desc,leader,credits,examPer,cwPer, color){
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
        this.chosenColor = color;
        
        this.lectures = [];

        this.colorChoices = {};
        this.colorsOpen = false;

        this.expanded = 0;
        //elements
        this.elements = {};
        
        //function calls
        this.drawElements();
        this.display();
        this.makeLectureList();

        this.elements["expand"].addEventListener("click",this.toggleContents.bind(this));
        this.elements["color"].addEventListener("click",this.toggleColorChoice.bind(this));
    }
    
    calculateMaxHeight(){
        var maxHeight = 200;
        //(this.colorsOpen) ? maxHeight = 190 : maxHeight = 190;
        var amtOpenLectures = 0;
        var amtClosedLectures = 0;
        //Work out size needed to accomodate for the lectures expanded and closed
        if(this.lectures.length > 0){
            maxHeight=100;
            for(var i = 0; i < this.lectures.length; i++){
                (this.lectures[i].expanded == 0) ? amtClosedLectures += 1 : amtOpenLectures += 1;

            }
        
            maxHeight += (amtClosedLectures * 200) + (amtOpenLectures * 340);
        }
        
        
        return maxHeight;

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
                        
                        this.lectLen += 1;
                    }
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", "http://localhost/lecRev2/lecture/getLecture.php?moduleID=" + t.modID, true);//URL
        xmlhttp.send();
        
    }
    
    
       
    drawElements(){
         var cardTemplate = document.createElement('div');
        cardTemplate.setAttribute('class', 'card');

        cardTemplate.innerHTML = `
              <div class="cHandle" name="handle">
                <div class="cHandleOuter">
                    <div class="cHandleInner">
                        <div class="ch_lCheck">
                            <div class="ch_lCheckbox" name="info">
                                <i class="material-icons" style="user-select: none;" name="infoIcon">
                                    info
                                </i>
                            </div>
                        </div>
                        <div class="ch_lText">
                            <div class="ch_lTextInner">

                            </div>
                            <div class="ch_mTextInner" name="titleHead">
                            </div>

                        </div>
                        <div class="ch_rExpand" >
                            <div class="ch_rExpandInner">
                                <div class="ch_rExpandInnerText" name="expand">
                                    <i class="material-icons" style="" name="expandIcon">
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
                    <div class="ccNavbarInner" >
                        <div class="ccNBbookmarkOuter">
                            <div class="ccNBbookmarkInner" style="display: none">
                                Slide
                                <input class="ccNBbookmark" type="number" name="" value="0" onblur="updateLectureInfo(this);" min="0" max="150">
                            </div>
                        </div>
                        <div class="ccNBactionOuter" >
                            <div class="ccNBactionInner" >
                                <div class="ccNBactionbut" name="add"  >
                                    <i class="material-icons" id="centretext" style=""  name="addText">
                                        add
                                    </i>
                                </div>
                                <div class="ccNBactionbut" name="edit" >
                                    <i class="material-icons" id="centretext" style=""  name="editText">
                                        edit
                                    </i>
                                </div>
                                <div class="ccNBactionbut" name="color" >
                                    <i class="material-icons" id="centretext" style=""  name="colorText">
                                        color_lens
                                    </i>
                                </div>
                                <!--<div class="ccNBactionbut" name="deleteText">
                                    <i class="material-icons" id="centretext" style="" >
                                        delete
                                    </i>
                                </div>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="colorBar" name="colorBar">
                    <div class="colorBarInner">
                        <div class="cbBarActionOuter">
                            <div class="cbBarActionInner" name="colorBarInner">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ccTitle" name="lecturesHeader">
                    Lectures
                </div>
                <div class="ccTitleUnderline" name="underline">

                </div>
                <p style="text-align: center; height: 50px; line-height:50px; padding: 0; margin: 0;" id="nolectures" name="nolectures">No lectures to show</p>
                <div class="ccTextNotesOuter" style="display: none;">
                    <textarea class="ccTextNotes" name="notes" placeholder="Notes" onblur="updateLectureInfo(this);"></textarea>

                </div>


            </div>
        `;
        
        this.elements["outer"] = cardTemplate;
        
        var temp  = ["info","titleHead","contents","add","expand","edit","nolectures","handle","addText","editText","deleteText","lecturesHeader","underline","infoIcon","expandIcon","color","colorText","colorBarInner","colorBar"];
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }
        
        //Add colour options
        for(let i in this.colors){
            
            //The colour
            var tempE = document.createElement("i");
            tempE.setAttribute("class", "colorBut");
            tempE.style.background = this.colors[i]["primary"];
            
            
            //Tick
            var tempE1 = document.createElement("div");
            tempE1.setAttribute("class", "material-icons colorButInner");
            tempE1.innerHTML = "done";
            tempE1.style.color = this.colors[i]["tertiary"];
            tempE1.style.border = "2px " + this.colors[i]["tertiary"] + " solid";
            tempE1.style.filter = "opacity(0)";
            
            //Appends
            tempE.appendChild(tempE1);
            this.elements["colorBarInner"].appendChild(tempE);
            
            //Choices
            this.colorChoices[i] = {};
            this.colorChoices[i]["tick"] = tempE1;
            this.colorChoices[i]["ticked"] = false;
            
            
            var t = this;
            tempE.addEventListener("click",function(){
                                   t.selectColor(i);
                                   });
            
        }
        
        document.getElementById("pc").appendChild(this.elements["outer"]);
    }
    
    display(){
        //Set colours
        this.setColours();
        
        //colour menu
        for(let i in this.colorChoices ){
            if(i == this.chosenColor){
                this.colorChoices[i]["ticked"] == true;
                this.colorChoices[i]["tick"].style.filter = "opacity(1)";
            }else{
                this.colorChoices[i]["ticked"] == false;
                this.colorChoices[i]["tick"].style.filter = "opacity(0)";
            }
            
        }
        
        //console.log(this.elements["contents"]);
        var noLecture = this.elements["nolectures"];
        if(this.lectures.length >0){
            noLecture.style.display = "none";
        }else{
            noLecture.style.display = "";
        }
        
        
        
        //expanded
        var expand = this.elements["expand"];
        var expandText = "";
        (this.expanded == 0) ? expandText = "add" : expandText = "remove";
        expand.children[0].innerHTML = expandText;
        
        this.elements["titleHead"].innerHTML = this.title;
        
        
        //Reconfigure max height
        var maxHeight = this.calculateMaxHeight;
        this.elements["contents"].style.maxHeight = maxHeight + "px"; 
    }

    setColours(){
        var colorP = this.colors[this.chosenColor]["primary"];
        var colorS = this.colors[this.chosenColor]["secondary"];
        var colorT = this.colors[this.chosenColor]["tertiary"];
        
        //Primary
        this.elements["handle"].style.background = colorP;
        this.elements["contents"].style.background = colorP;
        
        //Secondary
        var temp = ["lecturesHeader","infoIcon", "expandIcon","nolectures","titleHead"];   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].style.color = colorS;

        }

        //Tertiary
        var temp = ["addText", "editText", "colorText", "lecturesHeader","nolectures"];   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].style.color = colorT;
            this.elements[temp[i]].setAttribute("color", colorT);
        }
        this.elements["underline"].style.borderBottom = "1px "+colorT+" solid";
        
        
        //Button hover
        var temp = ["add", "edit", "color"];   
        for(var i = 0; i < temp.length; i++){
            
            this.elements[temp[i]].addEventListener("mouseover",this.mouseIn);
            this.elements[temp[i]].addEventListener("mouseout",this.mouseOut);
        }
        
    }
    
    toggleColorChoice(){
        var inner = this.elements["colorBar"];
        if(this.colorsOpen){//Close
            this.colorsOpen = false;
            console.log("closing");
            inner.style.maxHeight = "0px";
            
        }else{//Open
            this.colorsOpen = true;
            console.log("opening");
            inner.style.maxHeight = "50px";
        }
        this.display();
    }
    
    selectColor(choice){
        this.chosenColor = choice;
        this.display();
    }
    
    
    //For the hovers
    mouseIn(){
        this.children[0].style.color = "#4384F4";
    }
    
    mouseOut(){
        this.children[0].style.color = this.children[0].getAttribute("color");
    }
    
}


///////////////////////////////////

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
        this.chosenColor = 0;
        this.expanded = 0;
        
        //parent
        this.parentModule = module;
        
        //elements
        this.elements = {};
        
        this.drawElements();
        this.display();
        //console.log(this.elements);
        
        this.elements["expand"].addEventListener("click",this.toggleContents.bind(this));
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
            <div class="cHandle" name="handle">
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
        
        var temp  = ["check","title","expand","contents","bookmark","edit","delete","notes","week","handle"];
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }
        
         //Attach itself
        this.parentModule.elements["contents"].appendChild(this.elements["outer"])
        //document.getElementById("pc").appendChild(this.elements["outer"]);
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
        (this.expanded == 0) ? expandText = "add" : expandText = "remove";
        expand.children[0].innerHTML = expandText;
        //colours
        this.setColours();
        
        
        //bookmark
        this.elements["bookmark"].value = this.slideBookmark;

        //notes
        this.elements["notes"].innerHTML = this.notes;
        
        //week
        this.elements["week"].innerHTML = this.week;
        
    }
    
    setColours(){
        var color = this.colors[this.chosenColor];
        this.elements["handle"].style.background = color;
        this.elements["contents"].style.background = color;
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
