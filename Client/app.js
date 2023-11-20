
var analyzeButton = document.querySelector("#make-analyze-button");
console.log("Analyze button", analyzeButton);

var createUserButton = document.querySelector("#create-user-button");
console.log("Create User button", createUserButton);

var loginUserButton = document.querySelector("#login-user-button");
console.log("Login User button", loginUserButton);

var allAnalysisList = [];
var allTextsList = [];

var conversationText = document.querySelector(".past-text");
var conversationTime = document.querySelector(".time-sent");
var conversationAnalysis = document.querySelector(".an-analysis");
var conversationContact = document.querySelector(".contact");

var conversationTextItem = document.createElement("p");
var conversationTimeItem = document.createElement("p");
var conversationAnalysisItem = document.createElement("p");
var conversationContactItem = document.createElement("p");

function checkboxValue (aCheckBox){
    if (aCheckBox.checked == true){
        return "@ too late o'clock";
    }
    else{
        return "@ irrelevant o'clock";
    }
};


analyzeButton.onclick = function (){

    console.log("Analyze button was clicked");

    console.log("hopefully my list of stuff", allAnalysisList);

    var nameInput = document.querySelector("#name-input");
    console.log("the name typed:", nameInput.value);

    var zodiacInput = document.querySelector("#zodiac-input");
    console.log("the zodiac typed:", zodiacInput.value);

    var textInput = document.querySelector("#text-input");
    console.log("the text typed:", textInput.value);

    var checkBox = document.querySelector("#after10");
    console.log("checkbox value", checkBox.checked);

    var pastTextsList = document.querySelector("#past-texts-list");
    var newListItem = document.createElement("li");


    var randomIndex = Math.floor(Math.random() * allAnalysisList.length);
    console.log("random index", randomIndex);
    var randomAdvice = allAnalysisList[randomIndex];


    newListItem.innerHTML = textInput.value + ", " + checkboxValue(checkBox) + ": " + randomAdvice;
    pastTextsList.appendChild(newListItem);

    conversationTextItem.innerHTML = textInput.value;
    console.log("should be the user input as well", conversationTextItem);
    conversationText.appendChild(conversationTextItem);

    conversationTimeItem.innerHTML = checkboxValue(checkBox);
    conversationTime.appendChild(conversationTimeItem);

    conversationAnalysisItem.innerHTML = randomAdvice;
    conversationAnalysis.appendChild(conversationAnalysisItem);

    conversationContactItem.innerHTML = nameInput.value;
    conversationContact.appendChild(conversationContactItem);

    var newTextDict = {};
    newTextDict["Message"] = textInput.value;
    newTextDict["Time"] = checkboxValue(checkBox);
    newTextDict["Analysis"] = randomAdvice;
    newTextDict["From"] = nameInput.value;
    newTextDict["Zodiac"] = zodiacInput.value;
    console.log("new dictionary made", newTextDict);
    allTextsList.push(newTextDict);
    console.log("should be a list of text dictionaries", allTextsList);

    textInput.value = "";
    console.log("input box was cleared");
    checkBox.checked = false;
    console.log("checkbox is unchecked");
    nameInput.value = "";
    console.log("name box was cleared");
    zodiacInput.value = "";
    console.log("zodiac box was cleared");
   
    console.log(newTextDict);
    data = "PastText=" + encodeURIComponent(newTextDict["Message"]);
    data += "&PastTime=" + encodeURIComponent(newTextDict["Time"]);
    data += "&PastAnalysis=" + encodeURIComponent(newTextDict["Analysis"]);
    data += "&PastFrom=" + encodeURIComponent(newTextDict["From"]);
    data += "&PastZodiac=" + encodeURIComponent(newTextDict["Zodiac"]);
    console.log("data to be sent to the server", data);
    fetch("http://localhost:8080/texts", {
        credentials: "include",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response){
        console.log("success");
        loadDataFromServer();
    });
};



var textInput = document.querySelector("#text-input");
textInput.onclick = function(){
    console.log("user pressed text box");

    conversationAnalysisItem.innerHTML = "";
    conversationText.innerHTML = "";
    conversationTime.innerHTML = "";
    conversationContact.innerHTML = "";
    console.log("conversation stuff should be empty");
};

function loadAnalyses() {
    fetch("http://localhost:8080/analysis", {
        credentials: "include",
    }).then(function (response){
        response.json().then(function (data) {
            console.log("response data received:", data);

            allAnalysisList = data;
        });
    });
}


var globalLoggedIn = false;
var loggedInBody = document.getElementById("body-if-logged-in");
var registerAndLoginButtons = document.getElementById("login-and-register-div");
var headerButtons = document.getElementById("header-button-div");

function loadDataFromServer(){
    fetch("http://localhost:8080/texts", {
        credentials: "include",
    }).then(function (response){
        if (response.status == 401){
            console.log("not logged in");
            loggedInBody.style.display = "none";
            headerButtons.style.display = "block";
            registerAndLoginButtons.style.display = "block";
            return;
        }
        else if (response.status == 200){
            registerAndLoginButtons.style.display = "none";
            headerButtons.style.display = "none";
            loggedInBody.style.display = "block";
            loadAnalyses();
        }
        response.json().then(function (data){
            console.log("the text data recieved", data);

            allTextsList = data;
            var pastTextsList = document.querySelector("#past-texts-list");
            pastTextsList.innerHTML = "";

            allTextsList.forEach(function (APastConversation){
                var newListItem = document.createElement("li");
                newListItem.innerHTML = "From: " + APastConversation.pastFrom + ". They said '" + APastConversation.pastText + "'. " + "It's definitely giving " + APastConversation.pastZodiac + " vibes, oof. " + APastConversation.pastTime + ": " + APastConversation.pastAnalysis;
                pastTextsList.appendChild(newListItem);

                var breakElement = document.createElement("br");
                newListItem.appendChild(breakElement);

                var editButton = document.createElement("button");
                editButton.innerHTML = "Edit";
                editButton.onclick = function(){
                    console.log("edit button was clicked", APastConversation.id);
                    editConversation(APastConversation.id);
                };
                newListItem.appendChild(editButton);

                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "Delete";
                deleteButton.onclick = function(){
                    if (window.confirm("Are you sure you want to delete?")){
                    console.log("delete button was clicked", APastConversation.id); //how to know very important 
                    deleteConversation(APastConversation.id);
                    //call the delete function on the .id which has a fetch request i think 
                    //dont reload the list here, reload it inside the delete function  
                    };
                };
                newListItem.appendChild(deleteButton);
            });

        });
    });
};
loadDataFromServer();

function interpretCheckbox(stringValue){
    if (stringValue == "@ too late o'clock"){
        return true;
    }
    else{
        return false;
    }
};

function editConversation(conversation_id){
    var id = conversation_id;
    var modal = document.getElementById("modalDivID");
    modal.style.display = "block";
    var closeButton = document.getElementsByClassName("close-modal")[0];
    closeButton.onclick = function() {
        modal.style.display = "none";
    };
    var submitButton = document.getElementById("submit-edit-button");
    var edit_conversation_dict = {};
    //retrieving conversation member
    fetch("http://localhost:8080/texts/" + id, {
        credentials: "include",
        method: "GET",
    }).then(function (response){
        response.json().then(function (data) {
            console.log("response data received:", data);
            edit_conversation_dict = data;
            //filling in the fields
            var modalNameInput = document.getElementById("modal-name-input");
            modalNameInput.value = edit_conversation_dict["pastFrom"];
            var modalZodiacInput = document.getElementById("modal-zodiac-input");
            modalZodiacInput.value = edit_conversation_dict["pastZodiac"];
            var modalTextInput = document.getElementById("modal-text-input");
            modalTextInput.value = edit_conversation_dict["pastText"];
            var modalTimeCheckbox = document.getElementById("modal-time-checkbox");
            modalTimeCheckbox.checked = interpretCheckbox(edit_conversation_dict["pastTime"]);
            var modalAnalysis = document.getElementById("modal-analysis");
            modalAnalysis.innerHTML = edit_conversation_dict["pastAnalysis"];
        });
    });
    
    submitButton.onclick = function(){
        updateConversation(id);
    };
};

function updateConversation(conversation_id){
    var id = conversation_id;
    var modalNameInput = document.getElementById("modal-name-input");
    var modalZodiacInput = document.getElementById("modal-zodiac-input");
    var modalTextInput = document.getElementById("modal-text-input");
    var modalTimeCheckbox = document.getElementById("modal-time-checkbox");
    var modalAnalysis = document.getElementById("modal-analysis");
    //new analysis
    
    var randomIndex = Math.floor(Math.random() * allAnalysisList.length);
    console.log("random index", randomIndex);
    var randomAdvice = allAnalysisList[randomIndex];
    modalAnalysis.innerHTML = randomAdvice;

    data = "PastText=" + encodeURIComponent(modalTextInput.value);
    data += "&PastTime=" + encodeURIComponent(checkboxValue(modalTimeCheckbox));
    data += "&PastAnalysis=" + encodeURIComponent(randomAdvice);
    data += "&PastFrom=" + encodeURIComponent(modalNameInput.value);
    data += "&PastZodiac=" + encodeURIComponent(modalZodiacInput.value);
    console.log("data to be sent to the server", data);

    fetch("http://localhost:8080/texts/" + id, {
        credentials: "include",
        method: "PUT",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
     }).then(function (response){
        console.log("success");
       loadDataFromServer();
       var modal = document.getElementById("modalDivID");
       modal.style.display = "none";
       displayBubbles(id, modalTextInput, modalTimeCheckbox, modalNameInput, randomAdvice);
    }); 
};

//update the conversation bubbles 
function displayBubbles(conversation_id, text, timeCheckbox, contact, advice){
    console.log("updating the conversation bubbles for the edited conversation", conversation_id);
    conversationTextItem.innerHTML = text.value;
    console.log("should be the user input as well", conversationTextItem);
    conversationText.appendChild(conversationTextItem);

    conversationTimeItem.innerHTML = checkboxValue(timeCheckbox);
    conversationTime.appendChild(conversationTimeItem);

    conversationAnalysisItem.innerHTML = advice;
    conversationAnalysis.appendChild(conversationAnalysisItem);

    conversationContactItem.innerHTML = contact.value;
    conversationContact.appendChild(conversationContactItem);
}

function deleteConversation(conversation_id){
    fetch("http://localhost:8080/texts/" + conversation_id, {
        credentials: "include",
        method: "DELETE",
    }).then(function (response){
        console.log(" delete success");
        loadDataFromServer();
    });
};
//AHHHHHHHHH
createUserButton.onclick = function(){
    var submitNewUserButton = document.getElementById("submit-new-user-button");
    console.log("create user button was clicked");
    var UserModal = document.getElementById("createUserModalDiv");
    UserModal.style.display = "block";
    var closeButton = document.getElementsByClassName("close-UserModal")[0];
    closeButton.onclick = function() {
        UserModal.style.display = "none";
        var firstNameInput = document.getElementById("firstName-input");
        var lastNameInput = document.getElementById("lastName-input");
        var emailAddress = document.getElementById("emailAddress-input");
        var password = document.getElementById("password-input");
        firstNameInput.value = "";
        lastNameInput.value = "";
        emailAddress.value = "";
        password.value = "";
    };
    submitNewUserButton.onclick = function(){
        var firstNameInput = document.getElementById("firstName-input");
        var lastNameInput = document.getElementById("lastName-input");
        var emailAddress = document.getElementById("emailAddress-input");
        var password = document.getElementById("password-input");

        data = "FirstName=" + encodeURIComponent(firstNameInput.value);
        data += "&LastName=" + encodeURIComponent(lastNameInput.value);
        data += "&EmailAddress=" + encodeURIComponent(emailAddress.value);
        data += "&Password=" + encodeURIComponent(password.value);
        console.log("data to be sent to the server", data);
        fetch("http://localhost:8080/users", {
            credentials: "include",
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response){
            if (response.ok) {
                console.log("success", response);
                //loadDataFromServer();
                var thankyou = document.createElement("p");
                thankyou.innerHTML = "successful register";
                
                var UserModal = document.getElementById("createUserModalDiv");
                UserModal.style.display = "none";
                var firstNameInput = document.getElementById("firstName-input");
                var lastNameInput = document.getElementById("lastName-input");
                var emailAddress = document.getElementById("emailAddress-input");
                var password = document.getElementById("password-input");
                firstNameInput.value = "";
                lastNameInput.value = "";
                emailAddress.value = "";
                password.value = "";
            }
            if (!response.ok) {
                console.log("failure", response);
                //loadDataFromServer();
                //var UserModalContent = document.getElementById("UserModal-contentDiv");
                var ErrorMessageP = document.getElementById("possible-error-message");
                ErrorMessageP.innerHTML = "Email Address is already in use";
                ErrorMessageP.style.color = "#c91812";
            }
            loadDataFromServer();
        });
    }
};

loginUserButton.onclick = function(){
    console.log("Main login button was clicked");
    var LoginUserModal = document.getElementById("loginUserModalDiv");
    LoginUserModal.style.display = "block";
    var closeButton = document.getElementsByClassName("close-loginUserModal")[0];
    closeButton.onclick = function() {
        LoginUserModal.style.display = "none";
        var emailAddress = document.getElementById("loginEmail-input");
        var password = document.getElementById("loginPassword-input");
        emailAddress.value = "";
        password.value = "";
    };
    var submitLoginUserButton = document.getElementById("submit-login-user-button");
    submitLoginUserButton.onclick = function(){
        var LoginEmail = document.getElementById("loginEmail-input");
        var LoginPassword = document.getElementById("loginPassword-input");

        data = "EmailAddress=" + encodeURIComponent(LoginEmail.value);
        data += "&Password=" + encodeURIComponent(LoginPassword.value);
        console.log("data to be sent to the server", data);
        fetch("http://localhost:8080/sessions", {
            credentials: "include",
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response){
            if (response.ok){
                console.log("success", response);
                globalLoggedIn = true;

                loadDataFromServer();
                //var LoginUserModal = document.getElementById("loginUserModalDiv");
                //LoginUserModal.style.display = "none";
                var loginErrorMessage = document.getElementById("loginErrorMessage");
                loginErrorMessage.innerHTML = "Successfully Logged in";
                loginErrorMessage.style.color = "#319138";

                response.json().then(function (data) {
                    console.log("response data received:", data);
                    user_Basics_Dict = data;
                    console.log("User ID:", user_Basics_Dict["id"]);
                });
            }
            if (!response.ok){
                console.log("failure", response);
                var loginErrorMessage = document.getElementById("loginErrorMessage");
                loginErrorMessage.innerHTML = "Invalid Email or Password";
                loginErrorMessage.style.color = "#c91812";
            }
        });
    };
};

//am i logged in 
/* inside load data from server 
When the page loads 
say 401 if they arent logged in 
200 if they are 
if (response.status == 401){
    hide the data, change the style in the dom to display none 
    show log in and register UI 

    when user logs in successfully: 
        loadDataFromServer() just start back over 

}else if (response.status == 200){
    show the data 
    hide the register and log in ui 
} */