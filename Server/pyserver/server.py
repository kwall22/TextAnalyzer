from flask import Flask, request, g
from conversations_db import ConversationsDB
from conversations_db import UsersDB
from passlib.hash import bcrypt
from session_store import SessionStore

session_store = SessionStore() #persistant between the 

# h = bcrypt.hash('password') bcrypt.hash returns the checksum/salt (h) 
#bcrypt.verify("attempt", h) returns true or false, h is the saved checksum/salt 

class MyFlask(Flask):
    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        return super().add_url_rule(rule, endpoint, view_func, provide_automatic_options=False, **options)


def load_session_data():
    print("the cookies:", request.cookies)
    #load the session id from cookie data 
    session_id = request.cookies.get("session_id") #provide the exact name of the cookie and returns none if it cant return the session id 
    #if session id is present : 
    if session_id: 
        #load the session data using the session id 
        session_data = session_store.getSession(session_id)
        
    #if the session id is missing or invalid the session data could not be loaded 
    #if not session_id or not session_data:
    if session_id == None or session_data == None:
        #create a new session with a new session id 
        session_id = session_store.createSession()
        #load the session data using the new session id
        session_data = session_store.getSession(session_id)

    #g stands for global for all code for a particular request, then goes away after the request 
    #save both the session id and session data for use in other functions
    g.session_id = session_id #these are just for each individual client at that request right then 
    g.session_data = session_data

app = MyFlask(__name__)

@app.before_request
def before_request_func():
    load_session_data()

#to create cookie
@app.after_request #gets called right before going back to client
def after_request_func(response):
    print("Session ID:", g.session_id) #shows in server terminal
    print("Session data:", g.session_data)
    #have the opertunity to add headers here 
    response.set_cookie("session_id", g.session_id, samesite="None", secure=True)

    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin")
    response.headers["Access-Control-Allow-Credentials"] = "true"

    #send a cookie to the client with the new session id 
    return response



ANALYSIS = [
  "They literally hate you, srry",
  "They are actually in love with you and you should show up at their house unannounced",
  "It's too hard to tell, but you should chill fr",
  "I hate to be the one to tell you this bestie, but you should move on",
  "Sounds like a proposal to me (send them your ring size)",
  "It's time to queue up Pride & Prejudice (2002)",
  "You should call them"
]


#"/texts/<int:texts>" this is the options response below 
@app.route("/<path:path>", methods=["OPTIONS"])
def cors_preflight(path):
    return "", 200, {
        #"Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers" : "Content-Type"
    }


@ app.route("/analysis", methods=["GET"])
def retrieve_analysis_collection():
    return ANALYSIS

@ app.route("/texts", methods=["GET"])
def retrieve_texts_collection():
    #db = DummyDB('mydatabase.db')
    if "UserID" not in g.session_data:
        return "Unauthorized", 401
    db = ConversationsDB()
    #allTexts = db.readAllRecords()
    allTexts = db.getConversations()
    return allTexts

#retreive 
@ app.route("/texts/<int:text_id>", methods=["GET"])
def retrieve_texts_member(text_id):
    db = ConversationsDB()
    aConversation = db.getConversation(text_id)
    if aConversation:
        #put delete and update functions here for those ones 
        return aConversation
    else: #else if conversation is none 
        return "Conversation with ID {} not found".format(text_id), 404 #do for all 3 of the routes you have to 

#delete
@ app.route("/texts/<int:text_id>", methods=["DELETE"])
def delete_texts_member(text_id):
    db = ConversationsDB()
    aConversation = db.getConversation(text_id)
    if aConversation:
        db.deleteConversation(text_id)
        return "Deleted", 200
    else:
        return "Conversation with ID {} not found".format(text_id), 404

#update
@ app.route("/texts/<int:text_id>", methods=["PUT"])
def update_texts_member(text_id):
    db = ConversationsDB()
    aConversation = db.getConversation(text_id)
    if aConversation:
        pastText = request.form["PastText"]
        pastTime = request.form["PastTime"]
        pastAnalysis = request.form["PastAnalysis"]
        pastFrom = request.form["PastFrom"]
        pastZodiac = request.form["PastZodiac"]
        db.updateConversation(text_id, pastText, pastTime, pastAnalysis, pastFrom, pastZodiac)
        return "Updated", 200
    else:
        return "Conversation with ID {} not found".format(text_id), 404

@ app.route("/texts", methods=["POST"])
def create_in_texts_collection():
    #dictRecord = {'PastText' : request.form["PastText"], 'PastTime' : request.form["PastTime"], 'PastAnalysis' : request.form["PastAnalysis"]}
    pastText = request.form["PastText"]
    pastTime = request.form["PastTime"]
    pastAnalysis = request.form["PastAnalysis"]
    pastFrom = request.form["PastFrom"]
    pastZodiac = request.form["PastZodiac"]
    db = ConversationsDB()
    #db.saveRecord(dictRecord)
    db.createConversation(pastText, pastTime, pastAnalysis, pastFrom, pastZodiac)
    return "Created", 201

#users db 

#create a user 
@ app.route("/users", methods=["POST"])
def create_in_users_collection():
    firstName = request.form["FirstName"]
    lastName = request.form["LastName"]
    emailAddress = request.form["EmailAddress"]
    #TODO do something with the password
    pw = request.form["Password"]
    password = bcrypt.hash(pw)
    db = UsersDB()
    user = db.getUser(emailAddress) #returns none if email isnt in database already 
    if user:
        return "User with Email Address {} already exists".format(emailAddress), 422
    else:
        db.createUser(firstName, lastName, emailAddress, password)
        return "Created", 201

#retrieve all users
#@ app.route("/users", methods=["GET"])
#def retrieve_users_collection():
   # db = UsersDB()
  #  allUsers = db.getUsers()
   #return allUsers


#sessions
@ app.route("/sessions", methods=["POST"])
def authenticate_users_member():
    emailAttempt = request.form["EmailAddress"]
    passAttempt = request.form["Password"]
    db = UsersDB()
    existsAndPassword = db.authenicateUser(emailAttempt)
    if existsAndPassword:
        print(existsAndPassword["password"])
        validated = bcrypt.verify(passAttempt, existsAndPassword["password"])
        if validated == True:
            userDict = db.getUserBasics(emailAttempt) #put the user id in the session data dictionary
            g.session_data["UserID"] = userDict #???? you need to SET the value here idiot 
            #userDict = db.getUserBasics(emailAttempt) #put the user id in the session data dictionary
            return userDict, 201
        else:
            return "Incorrect password", 401
    else:
        return "User with Email Address {} not found".format(emailAttempt), 401



def run():
    app.run(port=8080) 

if __name__ =='__main__':
    run()
