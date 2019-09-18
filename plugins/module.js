class module extends card{
    constructor(ID,title,code,semester,year,desc,leader,credits,examPer,cwPer, color, show){
        super();
        //details
        this.data = {};
        this.data["ID"] = ID;
        this.data["title"] = title;
        this.data["code"] = code;
        this.data["semester"] = semester;
        this.data["year"] = year;
        this.data["desc"] = desc;
        this.data["leader"] = leader;
        this.data["credits"] = credits;
        this.data["examPer"] = examPer;
        this.data["cwPer"] = cwPer;
        
        this.editing = false;
        
        
        //Lectures associated with this module
        this.lectures = [];
        
        //The colour options settings
        this.colorChoices = {};
        //Colour options
        this.colorsOpen = false;
        //Set the colour, correct if not a valid colour
        (color in this.colors) ? this.chosenColor = color : this.chosenColor = "white";

        this.expanded = 0;
        this.extraInformation = 0;
        //elements
        this.elements = {};
        this.actionButtons = [];
        if(show){
           //function calls
            this.drawElements(); 
        }
        
         if(ID == null || ID == "undefined"){
            
            this.makeNewModule();
            //this.updateInformation();
          
         }
        
        if(show){
            this.display();
            this.makeLectureList();
        }
        
        
        
        
        this.timeoutId = 0;
        
    }
    
    setupTitles(){
        var temp = ["titleHeadIn"];
        
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].parentNode.addEventListener("mouseover",function(){
                this.mouseIn(temp, i-1);
            }.bind(this));
            this.elements[temp[i]].parentNode.addEventListener("mouseout",this.mouseOut.bind(this));
        }
        
    }
    
    calculateMaxHeight(){
        var maxHeight = 180;
        //(this.colorsOpen) ? maxHeight = 190 : maxHeight = 190;
        var amtOpenLectures = 0;
        var amtClosedLectures = 0;
        //Work out size needed to accomodate for the lectures expanded and closed & the color bar
        if(this.expanded == 1){
            
        
            if(this.lectures.length > 0){
                for(var i = 0; i < this.lectures.length; i++){
                    (this.lectures[i].expanded == 0) ? amtClosedLectures += 1 : amtOpenLectures += 1;

                }

                

                maxHeight += (amtClosedLectures * 200) + (amtOpenLectures * 300);
            }
        }
        (this.colorsOpen) ? this.maxHeight += 80 : null;
        if(this.extraInformation == 1){
            
            maxHeight += Object.keys(this.elements["extraInformationElements"]).length * 30;
                
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
                            if(t.lectures[j].data["ID"] == lectureID){
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
        xmlhttp.open("POST", app.server + "/lecture/getLecture.php?moduleID=" + t.data["ID"], true);//URL
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
                                <input class="ch_lTextInnerInput" type="text" name="code" value="" placeholder="Code" autocomplete="off" >
                            </div>
                            <div class="ch_mTextInner" name="titleHead">
                                <input class="ch_mTextInnerIn" type="text" placeholder="Title"name="titleHeadIn" >
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
            <div class="cInfo cContents" name="extraInfo">
                <div class="formOuter">
                        <div class="formInner">
                            <div class="formField">
                                <div class="ff_upperBand">
                                    Description
                                </div>
                                <div class="ff_lowerBand">
                                    <textarea class="ff_TextNotes" placeholder="" style="background: transparent" name="desc" value="" id="desc"></textarea>
                                </div>
                            </div>
                            <div class="formField">
                                <div class="ff_upperBand">
                                    Leader
                                </div>
                                <div class="ff_lowerBand">
                                    <input class="ff_lbInput" type="text" placeholder="" value="" name="leader" id="leader">
                                </div>
                            </div>
                            <div class="formField" >
                                <div class="ff_upperBand">
                                    Credits
                                </div>
                                <div class="ff_lowerBand">
                                    <input class="ff_lbInput" type="number" placeholder="" value="" min="0" max="100" name="credits" id="credits">
                                </div>
                            </div>
                            <div class="formField">
                                <div class="ff_upperBand">
                                    Exam Percentage
                                </div>
                                <div class="ff_lowerBand">
                                    <input class="ff_lbInput" type="number" placeholder="" value="" min="0" max="100" name="examPer" id="examPer">
                                </div>
                            </div>
                            <div class="formField">
                                <div class="ff_upperBand">
                                    Coursework Percentage
                                </div>
                                <div class="ff_lowerBand">
                                    <input class="ff_lbInput" type="number" placeholder="" value="" min="0" max="100" name="cwPer" id="cwPer">
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
                        
                        <div class="ccNBactionOuter" >
                            <div class="ccNBactionInner" name="actionBar">
                                
                                
                                
                                
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
                    <textarea class="ccTextNotes" name="notes" placeholder="Notes"></textarea>

                </div>


            </div>
        `;
        
        this.elements["outer"] = cardTemplate;
        
        var temp  = ["info","titleHead","contents","add","expand","edit","nolectures","handle","addText","editText","deleteText","lecturesHeader","underline","infoIcon","expandIcon","color","colorText","colorBarInner","colorBar","titleHeadIn", "actionBar","code","extraInfo"];
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }
        
        this.elements["extraInformationElements"] = {};
        var temp = ["credits","cwPer","examPer","desc","leader"];
        for(var i = 0; i < temp.length; i++){
            this.elements["extraInformationElements"][temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }

        
        var actionBar = this.elements["actionBar"];
        
        //Add module action buttons
        for(var i = 0; i < app.moduleActions.length; i++){
            var moduleFoo = app.moduleActions[i];
            this.elements[moduleFoo.text] = new actionButton(moduleFoo.text, moduleFoo.icon, moduleFoo.action, moduleFoo.hideAtStart, moduleFoo.cooldown, this, null);
            this.elements["actionBar"].appendChild(this.elements[moduleFoo.text].button);
            this.actionButtons.push(moduleFoo.text);
            
        }
        //console.log(this.elements);
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
        
        
        
        //Set listeners
        this.elements["expand"].addEventListener("click",this.toggleContents.bind(this));
        //this.elements["color"].addEventListener("click",this.toggleColorChoice.bind(this));
        //this.elements["titleHeadIn"].addEventListener("change",this.setTitle.bind(this));
        this.elements["info"].addEventListener("click",this.toggleExtraInformation.bind(this));
        
        this.setupTitles()
        this.makeLectureList();
    }
    
    display(){
        //console.log("Module: Running display for " + this.data["title"]);
        //Set colours
        this.setFieldsEditable(this.editing);
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
        
        var noLecture = this.elements["nolectures"];
        if(this.lectures.length > 0){
            noLecture.style.display = "none";
        }else{
            noLecture.style.display = "";
        }
        
        //expanded
        var expand = this.elements["expand"];
        var expandText = "";
        (this.expanded == 0) ? expandText = "add" : expandText = "remove";
        expand.children[0].innerHTML = expandText;
        
        this.elements["titleHeadIn"].value = this.data["title"];
        this.elements["titleHeadIn"].setAttribute("title", this.data["title"]);
        
        this.elements["code"].value = this.data["code"];
        this.elements["code"].setAttribute("title", this.data["code"]);
        
        var extraInformation = this.elements["extraInformationElements"];
        var keys = Object.keys(extraInformation);
        for(var i = 0; i < keys.length; i++){
            extraInformation[keys[i]].value = this.data[keys[i]]; 
        }
        
        //Reconfigure max height
        if(this.expanded == 1){
           this.elements["contents"].style.maxHeight = this.maxHeight + "px";  
        }else{
            this.elements["contents"].style.maxHeight = 0 + "px";  
        }
        if(this.extraInformation){
            this.elements["extraInfo"].style.maxHeight = this.maxHeight + "px"; 
        }else{
            this.elements["extraInfo"].style.maxHeight = 0 + "px"; 
        }
        
        
        this.sortLectures();
        
       
        
        
        
    }
    
    
    
    sortLectures(){//Bubble sort but it's the correct sort bby
        
        var sortedLectures = this.lectures;
        
        for(var i = 0; i < sortedLectures.length-1; i++){
            var swapped = false;
            for(var j = 0; j < sortedLectures.length-1; j++){
                if((parseInt(sortedLectures[j].data["week"]) > parseInt(sortedLectures[j+1].data["week"]))){
                    var temp = sortedLectures[j];
                    sortedLectures[j] = sortedLectures[j+1];
                    sortedLectures[j+1] = temp;
                    
                }
            }
            
        }
        this.lectures = sortedLectures;
        
        for(var i = 0; i < this.lectures.length; i++){
            this.elements["contents"].appendChild(this.lectures[i].elements["outer"]);
        }
        
    }

    setColours(){
        var colorP = this.colors[this.chosenColor]["primary"];
        var colorS = this.colors[this.chosenColor]["secondary"];
        var colorT = this.colors[this.chosenColor]["tertiary"];
        
        
        //Primary
        var temp = ["handle","contents","extraInfo"];   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].style.background= colorP;

        }
        
        //Secondary
        var temp = ["lecturesHeader","infoIcon", "expandIcon","nolectures","titleHeadIn","code"];   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].style.color = colorS;
            
        }
        var temp = Object.keys(this.elements["extraInformationElements"]);
        for(var i = 0; i < temp.length; i++){
            var currentElement = this.elements["extraInformationElements"][temp[i]];
            currentElement.style.color = colorS;
            currentElement.parentNode.parentNode.children[0].style.color = colorS;
        }
        

        //Tertiary
        var temp = ["addText", "editText", "colorText", "lecturesHeader","nolectures"];   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].style.color = colorT;
            this.elements[temp[i]].setAttribute("color", colorT);
            
        }
        
        
        
        var temp = this.actionButtons;   
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]].iconEl.style.color = colorT;
            this.elements[temp[i]].iconEl.setAttribute("color", colorT);
            
            
        }
        this.elements["underline"].style.borderBottom = "1px "+colorT+" solid";
        
        
        //Button hover
        var temp = this.actionButtons; 
        for(var i = 0; i < temp.length; i++){
            
            this.elements[temp[i]].button.addEventListener("mouseover",this.mouseInButton);
            this.elements[temp[i]].button.addEventListener("mouseout",this.mouseOutButton);
        }
        
    }
    
    setTitle(){
        this.data["title"] = this.elements["titleHeadIn"].value;
        this.updateModule();
        this.display();
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
        this.updateInformation();
        this.display();
    }
    
    
    //For the hovers
    mouseInButton(){
        this.children[0].style.color = "#4384F4";
    }
    
    mouseOutButton(){
        this.children[0].style.color = this.children[0].getAttribute("color");
    }
    
    
    
    
    updateInformation(){
        var t = this;
        t.data["title"] = t.elements["titleHeadIn"].value;
        t.data["code"] = t.elements["code"].value;
        

        t.data["desc"] =  t.elements["extraInformationElements"]["desc"].value;;
        t.data["leader"] = t.elements["extraInformationElements"]["leader"].value;
        t.data["credits"] =  t.elements["extraInformationElements"]["credits"].value;
        t.data["examPer"] =  t.elements["extraInformationElements"]["examPer"].value;;
        t.data["cwPer"] =  t.elements["extraInformationElements"]["cwPer"].value;;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                if(this.responseText.length <= 0){//If data exists

                }else{
                    console.log(this.responseText);
                    openToast("Something went wrong - try again later");
                }
            }
        };
        xmlhttp.open("GET", app.server + "/module/updateModuleInformation.php?"+
                     "moduleID="+ t.data["ID"] +
                     "&desc=" + t.data["desc"] +
                     "&leader=" + t.data["leader"] +
                     "&credits=" + t.data["credits"] +
                     "&examPer=" + t.data["examPer"] +
                     "&cwPer=" + t.data["cwPer"] +
                     "&color=" + t.chosenColor +
                     "&title=" + t.data["title"] +
                     "&code=" + t.data["code"], true);//URL
        xmlhttp.send();

    }
    
    getInformation(){
        
        var t = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                
                var myArr = JSON.parse(this.responseText);//Parses API json into key-value pairs

                if( myArr != null && myArr.length > 0){//If data exists


                    t.completed = myArr[0]['title'];
                    t.notes = myArr[0]['code'];
                    t.bookmark = myArr[0]['slideBookmark'];
                    t.display();
                    
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", app.server + "/lecture/getLectureByID.php?lectureID=" + t.data["ID"], true);//URL
        xmlhttp.send();
        
    }
    
    archive(){
        
        var t = this;
        confirmThis("Are you sure?", "You're attempting to archive this module and you will need to contact an admin to restore this module", "CANCEL", "OKAY",
        function(){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    //console.log(this.responseText);

                    console.log(this.responseText);

                    if( this.responseText.length > 0){//If data exists





                    }else{//Data doesn't exist
                        t.removeElements();
                    }
                }
            };
            xmlhttp.open("POST", app.server + "/module/archiveModule.php?moduleID=" + t.data["ID"], true);//URL
            xmlhttp.send();
        }.bind(this),
        function(){
        }.bind(this));
        
        
        
    }
    
    makeNewModule(){
        var t = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                if(this.responseText.length > 0){//If data exists
                    t.data["ID"] = parseInt(this.responseText);
                    console.log(t.data["ID"]);
                    
                    //t.getInformation();
                    //t.continueSetup();
                    
                }else{//Data doesn't exist

                }
            }
        };

        xmlhttp.open("POST", app.server + "/module/addModule.php?" +
        "year=" + t.data["year"] +
        "&semester=" + t.data["semester"], true);//URL
        xmlhttp.send();
    }
    
}