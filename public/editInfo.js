//Onclick funciton for back button on edit info page
function sendAccount(){
    console.log("Hello");
    //For local development
    location.replace("http://localhost:1515/myAccount");

    //Hosted App
    //location.replace("http://isowaytion.com/myAccount");
}

document.getElementById("bck").onclick = sendAccount;