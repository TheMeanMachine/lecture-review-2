class actionButton{
    constructor(text, icon, action, parent, color, hideAtStart){
        this.text = text;
        this.icon = icon;
        this.action = action;
        this.hideAtStart = hideAtStart;
        
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
        
        
        if(this.hideAtStart){
            this.hide();
        }
    }
    
    draw(){
        this.button = document.createElement("div");
        this.button.setAttribute("class", "ccNBactionbut");
        this.button.setAttribute("name", this.text);
        
        this.iconEl = document.createElement("i");
        this.iconEl.setAttribute("class", "material-icons matIcon");
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
            parent.lectures.push(new lecture("",
                                                             "",
                                                             1,
                                                             "",
                                                             "0",
                                                             "0",
                                                             parent));
            parent.maxHeight = parent.calculateMaxHeight();
            parent.display();
        },false);
        
        this.addModuleAction("edit", "edit", function(){
            var parent = this.parent;
            parent.toggleEditable();
        },false);
        
        this.addModuleAction("undo", "undo", function(){
            this.parent.stopEditingCurrentObject();
            this.parent.display();
        },true);
        
        this.addModuleAction("color", "color_lens",function(){
            this.parent.toggleColorChoice();
        },false);
        
        
        /*Lecture*/
        
        this.addLectureAction("edit", "edit", function(){
            var parent = this.parent;
            parent.toggleEditable();
            
        },false);
        
        this.addLectureAction("undo", "undo", function(){
            this.parent.stopEditingCurrentObject();
            this.parent.display();
        },true);
        
        
        
        this.addLectureAction("delete", "delete", function(){
            console.log("delete");
        },false);
        
    }
    /*
    Adds an action button to the module action bar
    @param text - the text of the action the button performs
    @param icon - the icon name referring to the material-icon package
    @param action - the function needed to run
    
    @return index of new button
    */
    addModuleAction(text, icon, action, hide){
        var temp = new actionButton(text, icon, action, null, null, hide);
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
    addLectureAction(text, icon, action, hide){
        var temp = new actionButton(text, icon, action, null, null, hide);
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
        this.importPlugin("card");
        this.importPlugin("colorSelector");
        this.importPlugin("lecture");
        this.importPlugin("module");
        
    }
    
    importPlugin(pluginName){
        //document.writeln("<script type='text/javascript' src='/plugins/"+pluginName+".js'></script>");
        $.getScript('/plugins/'+pluginName+'.js');
        
    
    }
}



//==============================================================


//################################################################################
//################################################################################
//################################################################################Just so I notice I scrolled too far
//################################################################################




var app = new myApp();





