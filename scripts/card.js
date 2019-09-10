class actionButton{
    constructor(text, icon, action, parent, color){
        this.text = text;
        this.icon = icon;
        this.action = action;
        
        //Class the button belongs to
        this.parent = parent;
        
        
        //Outer div
        this.button;
        
        //Make the elements
        this.draw();

        //Event listens for click, runs the action
        this.button.addEventListener("click",this.action.bind(this));
        this.button.addEventListener("mouseover",this.mouseIn);
        this.button.addEventListener("mouseout",this.mouseOut);
        
        
    }
    
    draw(){
        this.button = document.createElement("div");
        this.button.setAttribute("class", "ccNBactionbut");
        this.button.setAttribute("name", this.text);
        
        this.iconEl = document.createElement("i");
        this.iconEl.setAttribute("class", "material-icons");
        this.iconEl.setAttribute("id", "centretext");
        this.iconEl.setAttribute("name", this.text + "Text");
        
        this.button.appendChild(this.iconEl);
        
        this.setIcon();                        
    }
    
    //For the hovers
    mouseIn(){
        this.children[0].style.color = "#4384F4";
    }

    mouseOut(){
        this.children[0].style.color = this.children[0].getAttribute("color");
    }

    setIcon(){
        this.iconEl.innerHTML = this.icon;
    }
}

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
        
        this.editing = false;
        this.editingObject;
        
        this.moduleActions = [];
        this.lectureActions = [];
        
        this.loadPlugins();//Load olugins
        
        this.makeModuleList();//Generate the modules
        
        this.addModuleAction("add", "add", function(){
            var parent = this.parent;
            parent.lectures.push(new lecture("",
                                                             "",
                                                             1,
                                                             "",
                                                             "0",
                                                             "0",
                                                             parent));
            parent.maxHeight = parent.calculateMaxHeight();
            parent.display();
        })
        
        this.addModuleAction("edit", "edit", function(){
            var parent = this.parent;
            parent.toggleEditable();
        })
        
        this.addModuleAction("color", "color_lens",function(){
            this.parent.toggleColorChoice();
        })
        
     
        
        
    }
    
    
    /*
    Adds an action button to the module action bar
    @param text - the text of the action the button performs
    @param icon - the icon name referring to the material-icon package
    @param action - the function needed to run
    */
    addModuleAction(text, icon, action){
        var temp = new actionButton(text, icon, action);
        this.moduleActions.push(temp);
    }
    
    /*
    Adds an action button to the lecture action bar
    @param text - the text of the action the button performs
    @param icon - the icon name referring to the material-icon package
    @param action - the function needed to run
    */
    addLectureAction(text, icon, action){
        var temp = new actionButton(text, icon, action);
        this.lectureActions.push(temp);
        
    }
    
    
    /*
    Forms the list of modules 
    */
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
             
                        var color = myArr[i]['color'];
                       

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
    
    loadPlugins(){
        this.importPlugin("colorSelector");
    }
    
    importPlugin(pluginName){
        document.writeln("<script type='text/javascript' src='/plugins/"+pluginName+".js'></script>");
    }
}

class card{
    constructor(){
        //Colours need to be moved to DB at some point
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
    
    
    /*
    Toggles the contents of the card
    */
    toggleContents(){
        //var contents = this.elements["contents"];
        
        if(this.expanded == 1){//Closing
            this.expanded = 0;
this.maxHeight = this.calculateMaxHeight();
        }else{
            this.expanded = 1;
            
            this.maxHeight = this.calculateMaxHeight();
        }
        
        //contents.style.maxHeight = maxHeight + "px"; 
        this.display();
    }
    
    /*
    Toggles the extra information of the card
    */
    toggleExtraInformation(){

        if(this.extraInformation == 1){//Closing
            this.extraInformation = 0;

        }else{
            this.extraInformation = 1;
            
            this.maxHeight = this.calculateMaxHeight();
        }
        
        //contents.style.maxHeight = maxHeight + "px"; 
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
    /* Requires bind */
    toggleEditable(override){
        if(app.editingObject != null && this.title == app.editingObject.title){
            //save
            this.stopEditingCurrentObject();
            console.log("Saving");
            return;
        }
        if((override == null || override == "undefined") && app.editing){
                confirmThis("Are you sure?", "This will remove all changes you've made", "CANCEL", "CONFIRM",
                function(){
                    this.stopEditingCurrentObject();
                    this.toggleEditable(true);

                }.bind(this),
                function(){
                    
                }.bind(this));
        }else{
            console.log("toggleEditable: app is overriden or not editing");
            app.editing = true;
            this.editing = true;
            app.editingObject = this;
            this.setFieldsEditable(true);
            var editButtonIcon = this.findElementByName(this.elements["actionBar"], "editText");
            editButtonIcon.innerHTML = "done";
            //this.toggleEditSpecifics();
        }
        
    }
    
    stopEditingCurrentObject(){
        var t = app.editingObject;
        t.setFieldsEditable(false);
        
        var editButtonIcon = t.findElementByName(t.elements["actionBar"], "editText");
        editButtonIcon.innerHTML = "edit";
        t.editing = false;
        
        app.editingObject = null;
        app.editing = false;
    }
    
    setFieldsEditable(editable){
        
        var temp = ["titleHeadIn","code"];   
        for(var i = 0; i < temp.length; i++){
            if(!editable){
                this.elements[temp[i]].setAttribute("readonly", "true");
                
            }else{
                this.elements[temp[i]].removeAttribute("readonly");
            }
            
        }
        
        
    }
    
    
}

//==============================================================
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
        
        //function calls
        this.drawElements();
        this.display();
        this.makeLectureList();
        this.display();
        
        //Set listeners
        this.elements["expand"].addEventListener("click",this.toggleContents.bind(this));
        //this.elements["color"].addEventListener("click",this.toggleColorChoice.bind(this));
        this.elements["titleHeadIn"].addEventListener("change",this.setTitle.bind(this));
        this.elements["info"].addEventListener("click",this.toggleExtraInformation.bind(this));
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
            maxHeight += 10;
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
                                <input class="ch_lTextInnerInput" type="text" name="code" value="" placeholder="Code" autocomplete="off" >
                            </div>
                            <div class="ch_mTextInner" name="titleHead">
                                <input class="ch_mTextInnerIn" type="text" name="titleHeadIn" >
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
        
        var actionBar = this.elements["actionBar"];
        
        //Add module action buttons
        for(var i = 0; i < app.moduleActions.length; i++){
            var moduleFoo = app.moduleActions[i];
            this.elements[moduleFoo.text] = new actionButton(moduleFoo.text, moduleFoo.icon, moduleFoo.action, this);
            this.elements["actionBar"].appendChild(this.elements[moduleFoo.text].button);
            this.actionButtons.push(moduleFoo.text);
            
        }
        console.log(this.elements);
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
        
        this.elements["titleHeadIn"].value = this.title;
        
        this.elements["code"].value = this.code;
        
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
        for(var i = 0; i < this.lectures.length; i++){
           //this.lectures[i].display();
            this.elements["contents"].appendChild(this.lectures[i].elements["outer"]);
        }
        
        
        
    }
    
    
    
    sortLectures(){//Bubble sort but it's the correct sort bby
        
        var sortedLectures = this.lectures;
        
        for(var i = 0; i < sortedLectures.length-1; i++){
            var swapped = false;
            for(var j = 0; j < sortedLectures.length-1; j++){
                if(sortedLectures[j].week > sortedLectures[j+1].week){
                    var temp = sortedLectures[j];
                    sortedLectures[j] = sortedLectures[j+1];
                    sortedLectures[j+1] = temp;
                }
            }
            if(!swapped){
                break;
            }
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
            
            this.elements[temp[i]].button.addEventListener("mouseover",this.mouseIn);
            this.elements[temp[i]].button.addEventListener("mouseout",this.mouseOut);
        }
        
    }
    
    setTitle(){
        this.title = this.elements["titleHeadIn"].value;
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
    mouseIn(){
        this.children[0].style.color = "#4384F4";
    }
    
    mouseOut(){
        this.children[0].style.color = this.children[0].getAttribute("color");
    }
    
    updateModule(){
        var t = this;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                if(this.responseText.length <= 0){//If data exists

                }else{
                    openToast("Something went wrong - try again later");
                }
            }
        };
        xmlhttp.open("GET", "http://localhost/lecRev2/module/updateModuleInformation.php?"+
                     "moduleID="+ t.modID +
                     "&desc=" + t.desc +
                     "&leader=" + t.leader +
                     "&credits=" + t.credits +
                     "&examPer=" + t.examPer +
                     "&cwPer=" + t.cwPer +
                     "&color=" + t.chosenColor, true);//URL
        xmlhttp.send();

    }
    
    updateInformation(){
        var t = this;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                if(this.responseText.length <= 0){//If data exists

                }else{
                    openToast("Something went wrong - try again later");
                }
            }
        };
        xmlhttp.open("GET", "http://localhost/lecRev2/module/updateModuleInformation.php?"+
                     "moduleID="+ t.modID +
                     "&desc=" + t.desc +
                     "&leader=" + t.leader +
                     "&credits=" + t.credits +
                     "&examPer=" + t.examPer +
                     "&cwPer=" + t.cwPer +
                     "&color=" + t.chosenColor, true);//URL
        xmlhttp.send();

    }
    
}

//################################################################################
//################################################################################
//################################################################################Just so I notice I scrolled too far
//################################################################################

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
        this.maxHeight = 0;
        //parent
        this.parentModule = module;
        
        //elements
        this.elements = {};
        
        this.drawElements();
        this.display();
        
        //console.log(this.elements);
        
        this.elements["expand"].addEventListener("click",this.toggleContents.bind(this));
        this.elements["check"].addEventListener("click", this.toggleCheck.bind(this));
        this.elements["notes"].addEventListener("blur", this.setNotes.bind(this));
        this.elements["notes"].addEventListener("blur", this.getTimerStart.bind(this));
        this.elements["notes"].addEventListener("focus", this.getTimerStop.bind(this));
        this.elements["bookmark"].addEventListener("blur", this.setSlide.bind(this));
        
        
    }
    
    calculateMaxHeight(){
        var maxHeight;
        if(this.expanded == 0){
            maxHeight = 0;
        }else{
            maxHeight = 200;
        }
        return maxHeight;
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
                            <div class="ch_lTextInner">
                                <input class="ch_lTextInnerInput" type="number" name="week" value="" placeholder="Week" min="0" max="30" >
                            </div>
                            <div class="ch_mTextInner" name="titleHead">
                                <input class="ch_mTextInnerIn" type="text" name="title" >
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
                                <textarea class="ccTextNotes" name="notes" placeholder="Notes"></textarea>
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
        this.elements["title"].value = this.title;
        
        //expanded
        var expand = this.elements["expand"];
        var expandText = "";
        if(this.expanded == 0){//Not expanded
            expandText = "add"
            this.getTimerStop();
        }else{
            expandText = "remove";
            this.getTimerStart();
            
        }
        
        expand.children[0].innerHTML = expandText;
        //colours
        this.setColours();
        
        
        //bookmark
        this.elements["bookmark"].value = this.slideBookmark;

        //notes
        this.elements["notes"].innerHTML = this.notes;
        
        //week
        this.elements["week"].value = this.week;
        
        //Set the height
        this.elements["contents"].style.maxHeight = this.maxHeight + "px"; 
        
        
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
        /*var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://localhost/lecRev2/lecture/updateLectureInformation.php?"+
                     "lectureID=" + this.lectID +
                     "&complete=" + this.completed
                     , true);
        xmlhttp.send();*/
        
        this.updateInformation();
        
        this.display();
    }
    
    setSlide(){
        this.slideBookmark = this.elements["bookmark"].value;
        this.updateInformation();
    }
    
    setNotes(){
        this.notes = this.elements["notes"].value;
        this.updateInformation();
    }
    
    //Updates the information for lecture
    updateInformation(){
        var t = this;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                if(this.responseText.length <= 0){//If data exists
                    
                }else{
                    openToast("Something went wrong - try again later");
                }
            }
        };
        xmlhttp.open("GET", "http://localhost/lecRev2/lecture/updateLectureInformation.php?"+
                     "lectureID="+ t.lectID +
                     "&complete=" + t.completed +
                     "&notes=" + t.notes +
                     "&bookmark=" + t.slideBookmark
                     , true);//URL
        xmlhttp.send();
    }
    
    getTimerStart(){
        this.updateTimer = setInterval(function(){this.getInformation()}.bind(this), 60 * 1000); 
    }
    
    getTimerStop(){
        clearInterval(this.updateTimer); 
    }
    
    getInformation(){
        
        var t = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                //console.log(this.responseText);
                
                var myArr = JSON.parse(this.responseText);//Parses API json into key-value pairs

                if( myArr != null && myArr.length > 0){//If data exists


                    t.completed = myArr[0]['completed'];
                    t.notes = myArr[0]['notes'];
                    t.bookmark = myArr[0]['slideBookmark'];
                    t.display();
                    console.log("Displayed");
                    
                }else{//Data doesn't exist

                }
            }
        };
        xmlhttp.open("POST", "http://localhost/lecRev2/lecture/getLectureByID.php?lectureID=" + t.lectID, true);//URL
        xmlhttp.send();
        
    }
}


var app = new myApp();





