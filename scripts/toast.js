/*

----#------#---#--
---#-#----#-#-#-#-
--#####---#--#--#-
-#-----#--#-----#-
Created By Aaron Machin
2018

*/
var timeout;
//Shows toast with defined message - openToast('CONTENT')
function openToast(content){
    /*var toast = document.getElementById("toast");
    if(toast == null){
        createToast();
    }
    var toast = document.getElementById("toast");*/
    
    var toast = createToast();
    var timeoutTime = content.length*100;
    if(timeoutTime <= 3000){
        timeoutTime = 3000;
    }
    window.clearTimeout(timeout);
    timeout = setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, timeoutTime);
    
    
    var toastInner = document.getElementById("toast_i");
    toastInner.innerHTML = content;
    toast.classList.add("show");
    
    
}

function createToast(){
    var toastContainer = document.getElementById("toast");
    console.log(toastContainer);
    if(toastContainer != null){return toastContainer;}
    toastContainer = document.createElement("div");
    toastContainer.setAttribute("class", "toastContainer");
    toastContainer.setAttribute("id", "toast");
    var toastInner = document.createElement("div");
    toastInner.setAttribute("class", "toastInner");
    toastInner.setAttribute("id", "toast_i");
    
    toastContainer.appendChild(toastInner);
    
    document.body.appendChild(toastContainer);
    return toastContainer;
}