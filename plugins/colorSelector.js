class colorSelector{
    constructor(){
        console.log("hello");
        
        app.addModuleAction("color", "color_lens", function(){
            this.parent.toggleColorChoice();
        })
        
        

    }
    //carry later ----------- AM. stop.
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
        this.parent.display();
    }
   
}

var colorSelect = new colorSelector();
