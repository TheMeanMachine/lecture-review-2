class actionButton{
    constructor(text, icon, action, hideAtStart, cooldown, parent, color){
        this.text = text;
        this.title_grammarifed = this.text.charAt(0).toUpperCase() + this.text.substring(1);
        this.icon = icon;
        this.action = action;
        this.hideAtStart = hideAtStart;
        
        //Class the button belongs to
        this.parent = parent;
        
        this.cooldown = cooldown;
        //Outer div
        this.button;
        
        //Make the elements
        this.draw();

        //Event listens for click, runs the action
        this.button.addEventListener("click",function(){
            this.processor(this.action);
        }.bind(this));
        this.button.addEventListener("mouseover",this.mouseIn.bind(this));
        this.button.addEventListener("mouseout",this.mouseOut.bind(this));
        
        
        if(this.hideAtStart){
            this.hide();
        }
        
        this.timeoutId = 0;
        
        this.disabled = false;
         
    }
    
    processor(action){
        if(this.disabled == false){
            action.call(this);
            this.disabled = true;
            setTimeout(this.timeoutTime.bind(this), this.cooldown * 1000);  
        }

    }
    
    timeoutTime(){
        this.disabled = false;
    }
    
    createToastForTitle(){
        openToast(this.title_grammarifed);
    }
    
    draw(){
        this.button = document.createElement("div");
        this.button.setAttribute("class", "ccNBactionbut");
        this.button.setAttribute("name", this.text);
        
        this.button.setAttribute("title", this.title_grammarifed);
        
        this.iconEl = document.createElement("i");
        this.iconEl.setAttribute("class", "material-icons matIcon");
        this.iconEl.setAttribute("id", "centretext");
        this.iconEl.setAttribute("name", this.text + "Text");
        
        this.button.appendChild(this.iconEl);
        
        this.setIcon();                        
    }
    
    //For the hovers
    mouseIn(){
        this.iconEl.style.color = "#4384F4";
        var t = this;
        //Long press
        this.timeoutId = setTimeout(
        function(){
            t.createToastForTitle();
        }.bind(this)
        , 1000);
    }

    mouseOut(){
        this.iconEl.style.color = this.iconEl.getAttribute("color");
        
        //Long press
        clearTimeout(this.timeoutId);
    }

    setIcon(){
        this.iconEl.innerHTML = this.icon;
    }
    
    hide(){
        this.button.style.maxWidth = 0 + "px";
        this.iconEl.style.fontSize = 0 + "em";
        this.button.style.margin = 0;
    }
    
    show(){
        this.button.style.maxWidth = 50 + "px";
        this.iconEl.style.fontSize = 1.5 + "em";
        this.button.style.margin = "0 10 0 10";
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
        
        this.year = 3;
        this.semester = 1 ;
        
        this.server = "https://focus-hub.co.uk/lecture-review-2/php";
        
        $(window).on('load', function() {//Needed to ensure plugins are loaded properly
            this.loadPlugins();//Load plugins
            setTimeout(function(){
                this.continueSetup();
            }.bind(this), 50);
        }.bind(this));
        
        
        
        
    }
    
    continueSetup(){
        try{
            
            this.makeModuleList();//Generate the modules
            this.updateCategory();
        }
        catch(e){//Makes sure plugins are loaded properly if problems occur
            if(e instanceof SyntaxError || e instanceof ReferenceError){

                this.loadPlugins();
                this.makeModuleList();
            }
            
        }
        
        /* Modules */ 
        this.addModuleAction("add", "add", function(){
            var parent = this.parent;
            parent.lectures.unshift(new lecture(null,
                                                             null,
                                                             1,
                                                             null,
                                                             null,
                                                             "undefined",
                                                             parent));
            parent.maxHeight = parent.calculateMaxHeight();
            parent.display();
        },false, 2);
        
        this.addModuleAction("edit", "edit", function(){
            var parent = this.parent;
            if(app.editing && app.editingObject.data["ID"] == parent.data["ID"]){
                parent.stopEditingCurrentObject(true);
            }else{
                parent.toggleEditable();
            }
        },false, 0);
        
        this.addModuleAction("undo", "undo", function(){
            confirmThis("Are you sure?", "You will lose all current changes", "CANCEL", "OKAY",
            function(){
                this.parent.stopEditingCurrentObject();
                this.parent.display();
            }.bind(this),
            function(){
                
            }.bind(this));
        },true, 0);
        
        this.addModuleAction("archive", "archive", function(){
            this.parent.archive();
        },false, 1);
        
        this.addModuleAction("color", "color_lens",function(){
            this.parent.toggleColorChoice();
        },false, 0);
        
        
        /*Lecture*/
        
        this.addLectureAction("edit", "edit", function(){
            var parent = this.parent;
            
            if(app.editing && app.editingObject.data["ID"] == parent.data["ID"]){
                parent.stopEditingCurrentObject(true);
                
            }else{
                parent.toggleEditable();
            }
            
            
        },false, 0);
        
        this.addLectureAction("undo", "undo", function(){
            confirmThis("Are you sure?", "You will lose all current changes", "CANCEL", "OKAY",
            function(){
                this.parent.stopEditingCurrentObject();
                this.parent.display();
            }.bind(this),
            function(){
                
            }.bind(this));
            
        },true, 0);
        
        
        
        this.addLectureAction("delete", "delete", function(){
            console.log("delete");
            this.parent.delete();
        },false, 1);
        
        this.updateCategory();
        
    }
    /*
    Adds an action button to the module action bar
    @param text - the text of the action the button performs
    @param icon - the icon name referring to the material-icon package
    @param action - the function needed to run
    
    @return index of new button
    */
    addModuleAction(text, icon, action, hide, cooldown){
        var temp = new actionButton(text, icon, action, hide, cooldown, null, null);
        this.moduleActions.push(temp);
        return this.moduleActions.length-1;
    }
    
    /*
    Adds an action button to the lecture action bar
    @param text - the text of the action the button performs
    @param icon - the icon name referring to the material-icon package
    @param action - the function needed to run
    
    @return index of new button
    */
    addLectureAction(text, icon, action, hide, cooldown){
        var temp = new actionButton(text, icon, action, hide, cooldown, null, null);
        this.lectureActions.push(temp);
        return this.lectureActions.length-1;
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
                       
                        var showOnStart;
                        
                        (year == t.year && sem == t.semester) ? showOnStart = true : showOnStart = false;

                        if(myArr[i]["archived"] == 1){
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
                                               color,
                                                showOnStart);
                            
                            var flag = true;
                            for(var j = 0; j < t.modules.year[year].sem[sem].length; j++){
                                if(t.modules.year[year].sem[sem][j].data["ID"] == id){
                                    flag = false;
                                }
                            }

                            (flag) ? t.modules.year[year].sem[sem].push(newMod) : console.log("already exists");
                        }
                        

                        
                        
                        
                        
                        
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
        this.importPlugin("lecture");
        this.importPlugin("module");
    }
    
    importPlugin(pluginName){
        //document.writeln("<script type='text/javascript' src='/plugins/"+pluginName+".js'></script>");
        try{
            $.getScript('/plugins/'+pluginName+'.js');  
        }catch(e){
            this.loadPlugins();
        }
        
        
    
    }
    
    updateCategory(){
        var t = app;
        console.log(t.modules);
        var prevYear = t.year;
        var prevSemester = t.semester;
        
        var yearSelect = document.getElementById("years");
        var semesterSelect = document.getElementById("semester");
        t.year = yearSelect.value;
        t.semester = semesterSelect.value;
        
        var temp = t.modules.year[prevYear].sem[prevSemester];
        console.log(temp);
        for(var i = 0; i < temp.length;i++){
            temp[i].removeElements();
        }
        
        var temp = t.modules.year[t.year].sem[t.semester];

        for(var i = 0; i < temp.length;i++){
            temp[i].drawElements();
            temp[i].display();
        }
    }
    
    createNewModule(){
        var newMod = new module(null,
                                               null,
                                               null,
                                               app.semester,
                                               app.year,
                                               null,
                                               null,
                                               null,
                                               null,
                                               null,
                                               null,
                               true);
        app.modules.year[app.year].sem[app.semester].push(newMod);
    }
}

var app = new myApp();


function randomInspiration(){
    var inspirations = [
        "Smile! Dianabasi loves you!", "At least you'll be dead ONE day...", "Oh... inspiration... come back another day. You're terrible today", "If you try to fail, and succeed, which have you done?", "People say nothing is impossible, but I do nothing every day... just like you now :)", "Even if you are on the right track, you’ll get run over if you just sit there.", "A diamond is merely a lump of coal that did well under pressure.", "If you hit the target every time it’s too near or too big.", "I didn’t fail the test. I just found 100 ways to do it wrong. (Hazar)" 
    ];
    var number = Math.floor(Math.random() * inspirations.length); 
    openToast(inspirations[number]);
}


