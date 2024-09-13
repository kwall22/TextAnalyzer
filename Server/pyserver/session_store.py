import os
import base64


#this class is the session store box on the servers side 
class SessionStore:

    def __init__(self): 
        self.sessionData = {}


    def generateSessionId(self):
        rnum = os.urandom(32)  
        rstr = base64.b64encode(rnum).decode("utf-8")   
        return rstr #goes into the cookie 

    def createSession(self):
        sessionId = self.generateSessionId() 
        self.sessionData[sessionId] = {}
        return sessionId #also goes into a cookie 
    
    def getSession(self, sessionId):
        #retreive an existing session from the session store 
        if sessionId in self.sessionData:
            return self.sessionData[sessionId] 
        else: 
            return None # the session id isnt valid, if the user messes with the session id on the cookie  
 
