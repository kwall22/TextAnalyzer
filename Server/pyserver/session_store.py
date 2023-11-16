import os
import base64


#this class is the session store box on the servers side 
class SessionStore:

    def __init__(self):
        #initialize data
        #data we need: a dictionary that contains the unique session id as a key 
        self.sessionData = {} #entire session store 


    def generateSessionId(self):
        #generate a large random number for session Id
        rnum = os.urandom(32) #pass in the bytes you want, uses operating systems way 
        rstr = base64.b64encode(rnum).decode("utf-8") #condenses the big rnumber to just a few characters  
        return rstr #goes into the cookie 

    def createSession(self):
        #make new session id 
        sessionId = self.generateSessionId()
        # add a new session to the session store 
        #maybe calls generate session id or recieves session id
        #append to session data
        #the session id creates a new session 
        self.sessionData[sessionId] = {}
        return sessionId #also goes into a cookie 
    
    def getSession(self, sessionId):
        #retreive an existing session from the session store
        #check if exists, you get a key error if you look for a bad key which crashes 
        if sessionId in self.sessionData:
            return self.sessionData[sessionId] #returns the dictionnary by reference so you can actually modify it, its not a copy 
        else: 
            return None # the session id isnt valid, if the user messes with the session id on the cookie 
            #if you restart your server, there goes your session store,but the cookies are just on everyones computers 
            
        
    
    
    
    
    #to log them out, you just unwrite the user id from the session they were on 
