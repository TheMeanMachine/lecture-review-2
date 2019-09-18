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
        this.timeoutId = 0;
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
    /*
    Returns index
    */
    searchArrayByObjectID(e, target){
        var cur = e;
        if(e.length < 0){
            return;
        }
        if(e.length == 1){
            return 0;
        }
        
        for(var i =0; i < e.length; i++){

            if(e.data["ID"] == target){
                return i;
            }
        }
        return false;
       
    }
    /* Requires bind */
    toggleEditable(override){
        
        if(app.editingObject != null && this.title == app.editingObject.title){
            //save
            confirmThis("Are you sure?", "You will lose all current changes", "CANCEL", "OKAY",
                function(){
                    this.stopEditingCurrentObject(false);
                    this.toggleEditable();
                }.bind(this),
                function(){
                }.bind(this));
            return;
        }else{
            console.log("toggleEditable: app is overriden or not editing");
            console.log(app.editing);
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
    
    removeElements(){
        
        var outer = this.elements["outer"];
        console.log(outer);
        var parent = outer.parentNode;
        parent.removeChild(outer);
        
    }
    
    stopEditingCurrentObject(save){
        var t = app.editingObject;
        if(save){
            confirmThis("Saving", "Do you want to save?", "CANCEL", "OKAY",
                function(){
                    t.updateInformation();
                    t.stopEditingCurrentObject();
                }.bind(this),
                function(){
                    
                }.bind(this));
            
            return;
        }else{
            t.display();
        
            t.setFieldsEditable(false);

            var editButtonIcon = t.findElementByName(t.elements["actionBar"], "editText");
            editButtonIcon.innerHTML = "edit";
            t.elements["undo"].hide();
            t.editing = false;

            app.editingObject = null;
            app.editing = false;
        }
        
        
    }
    
    setFieldsEditable(editable){
        
        var temp = ["titleHeadIn","code","week","title"];
        
        
        for(var i = 0; i < temp.length; i++){
            if(this.elements[temp[i]] != "undefined" && this.elements[temp[i]] != null ){
                if(!editable){
                    try{
                        this.elements[temp[i]].setAttribute("readonly", "true");
                        this.elements[temp[i]].setAttribute("disabled", "true"); 
                        
                    }catch(e){
                        
                    }
                    
                }else{
                    if(this.elements[temp[i]].hasAttribute("readonly")){
                       this.elements[temp[i]].removeAttribute("readonly"); 
                       this.elements[temp[i]].removeAttribute("disabled"); 
                    }
                }
            }
            
            
        }
        try{
            
            var extraInfoTag = "extraInformationElements";
         
            temp = Object.keys(this.elements[extraInfoTag]);
            for(var i = 0; i < temp.length; i++){
            if(this.elements[extraInfoTag][temp[i]] != "undefined" && this.elements[extraInfoTag][temp[i]] != null ){
                if(!editable){
                        this.elements[extraInfoTag][temp[i]].setAttribute("readonly", "readonly");  
                        this.elements[extraInfoTag][temp[i]].setAttribute("disabled", "true"); 
                }else{
                    if(this.elements[extraInfoTag][temp[i]].hasAttribute("readonly")){
                        this.elements[extraInfoTag][temp[i]].removeAttribute("readonly"); 
                        this.elements[extraInfoTag][temp[i]].removeAttribute("disabled"); 
                    }

                }
            }
            
            
        }
        }catch(e){
            
        }
        
        
    }
    
    mouseIn(list, index){
        var el = list[index];
        var t = this;
        //Long press
        t.timeoutId = setTimeout(
        function(){
            var title = t.elements[el].getAttribute("title");
            if(title == null || title == "" || title == "undefined"){
                  
            }else{
                openToast(title);
            }
            //console.log("2")
            
            
        }
        , 1000);
    }

    mouseOut(){
        var t = this;
        //Long press
        clearTimeout(t.timeoutId);
    }
}