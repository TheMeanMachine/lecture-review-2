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
        this.editing = false;
        //elements
        this.elements = {};
        this.actionButtons = [];
        
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
                                        <div class="ccNBactionInner" name="actionBar">
                                           
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
        
        var temp  = ["check","title","expand","contents","bookmark","edit","delete","notes","week","handle", "actionBar"];
        for(var i = 0; i < temp.length; i++){
            this.elements[temp[i]] = this.findElementByName(cardTemplate, temp[i]);
        }
        
        var actionBar = this.elements["actionBar"];
        
        //Add module action buttons
        for(var i = 0; i < app.lectureActions.length; i++){
            var foo = app.lectureActions[i];
            this.elements[foo.text] = new actionButton(foo.text, foo.icon, foo.action, this, null, foo.hideAtStart);
            this.elements["actionBar"].appendChild(this.elements[foo.text].button);
            this.actionButtons.push(foo.text);
            
          
        }
        
         //Attach itself
        this.parentModule.elements["contents"].appendChild(this.elements["outer"]);
        //document.getElementById("pc").appendChild(this.elements["outer"]);
        //this.display();
    }
    
   
    
    removeElements(){
        
        var outer = this.elements["outer"];
        var parent = outer.parentNode;
        parent.deleteChildren(outer);
    }
    
    display(){
        this.setFieldsEditable(this.editing);
        
        //Set the checkbox
        var checkText;
        (this.completed == 1) ? checkText = "check_box_outline_blank" : checkText = "check_box";
        //console.log();
        this.elements["check"].children[0].innerHTML = checkText;
        
        //Set the title
        this.elements["title"].value = this.title;
        this.elements["title"].setAttribute("title", this.title);
        
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
        
        console.log("Lecture: Running display for " + this.title);
        
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
                     "&bookmark=" + t.slideBookmark +
                     "&title=" + t.title +
                     "&week=" + t.week
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