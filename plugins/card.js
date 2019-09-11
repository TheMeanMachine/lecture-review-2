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
            confirmThis("Save?", "Do you want to save your changes?", "CANCEL", "CONFIRM",
                function(){
                    this.stopEditingCurrentObject(true);

                }.bind(this),
                function(){
                }.bind(this));
            return;
        }
        if((override == null || override == "undefined") && app.editing){
                confirmThis("Are you sure?", "You're currently editing and this will remove all changes you've made", "CANCEL", "CONFIRM",
                function(){
                    this.stopEditingCurrentObject(false);
                    this.toggleEditable(true);

                }.bind(this),
                function(){
                }.bind(this));
        }else{
            console.log("toggleEditable: app is overriden or not editing");
            app.editing = true;
            this.editing = true;
            
            this.elements["undo"].show();
            
            app.editingObject = this;
            this.setFieldsEditable(true);
            var editButtonIcon = this.findElementByName(this.elements["actionBar"], "editText");
            editButtonIcon.innerHTML = "done";
            //this.toggleEditSpecifics();
        }
        
    }
    
    stopEditingCurrentObject(save){
        var t = app.editingObject;
        if(save){
            t.updateInformation();
            
        }
        
        
        
        t.setFieldsEditable(false);
        
        var editButtonIcon = t.findElementByName(t.elements["actionBar"], "editText");
        editButtonIcon.innerHTML = "edit";
        t.elements["undo"].hide();
        t.editing = false;
        
        app.editingObject = null;
        app.editing = false;
    }
    
    setFieldsEditable(editable){
        
        var temp = ["titleHeadIn","code","week","title"];   
        for(var i = 0; i < temp.length; i++){
            if(this.elements[temp[i]] != "undefined" && this.elements[temp[i]] != null ){
                if(!editable){
                    this.elements[temp[i]].setAttribute("readonly", "true");
                
                }else{
                    if(this.elements[temp[i]].hasAttribute("readonly")){
                       this.elements[temp[i]].removeAttribute("readonly"); 
                    }

                }
            }
            
            
        }
        
        
    }
    
    
}