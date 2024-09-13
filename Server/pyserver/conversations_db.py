import sqlite3 


def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}


class ConversationsDB:

    def __init__(self):
        self.connection = sqlite3.connect("conversations_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
        
    
    def createConversation(self, pastText, pastTime, pastAnalysis, pastFrom, pastZodiac):
        data = [pastText, pastTime, pastAnalysis, pastFrom, pastZodiac]
        self.cursor.execute("INSERT INTO conversations (pastText, pastTime, pastAnalysis, pastFrom, pastZodiac) VALUES (?, ?, ?, ?, ?)", data)
        self.connection.commit()
    
    def getConversations(self):
        self.cursor.execute("SELECT * FROM conversations")
        records = self.cursor.fetchall()
        return records
    
    def getConversation(self, text_id):
        data = [text_id]
        self.cursor.execute("SELECT * FROM conversations WHERE id = ?", data) 
        record = self.cursor.fetchone()
        return record 
    
    def deleteConversation(self, text_id):
        data = [text_id]
        self.cursor.execute("SELECT * FROM conversations WHERE id = ?", data)
        exists = self.cursor.fetchone()
        if exists:
            self.cursor.execute("DELETE FROM conversations WHERE id = ?", data)
            self.connection.commit()
        else:
            return None
        
    def updateConversation(self, text_id, pastText, pastTime, pastAnalysis, pastFrom, pastZodiac):
        just_id = [text_id]
        data = [pastText, pastTime, pastAnalysis, pastFrom, pastZodiac, text_id]
        self.cursor.execute("SELECT * FROM conversations WHERE id = ?", just_id)
        exists = self.cursor.fetchone()
        if exists:
            self.cursor.execute("UPDATE conversations SET pastText = ?, pastTime = ?, pastAnalysis = ?, pastFrom = ?, pastZodiac = ? WHERE id = ?", data)
            self.connection.commit()
        else:
            return None

class UsersDB:

    def __init__(self):
        self.connection = sqlite3.connect("conversations_db.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def getUser(self, emailAddress):
        just_email = [emailAddress]
        self.cursor.execute("SELECT * FROM users WHERE emailAddress = ?", just_email)
        exists = self.cursor.fetchone()
        return exists

    def createUser(self, firstName, lastName, emailAddress, password):
        data = [firstName, lastName, emailAddress, password]
        just_email = [emailAddress]
        #check if email is unique
        self.cursor.execute("SELECT * FROM users WHERE emailAddress = ?", just_email)
        exists = self.cursor.fetchone() #returns none if there isnt a record 
        if exists:
            return None
        if exists == None:
            self.cursor.execute("INSERT INTO users (firstName, lastName, emailAddress, password) VALUES (?, ?, ?, ?)", data)
            self.connection.commit()

    def getUsers(self):
        self.cursor.execute("SELECT * FROM users")
        records = self.cursor.fetchall()
        return records
    
    def authenicateUser(self, emailAddress):
        EmailAttempt = [emailAddress]
        self.cursor.execute("SELECT * FROM users WHERE emailAddress = ?", EmailAttempt)
        emailExists = self.cursor.fetchone()
        if emailExists == None:
            return None #if email isnt found, return none 
        if emailExists:
            self.cursor.execute("SELECT password FROM users WHERE emailAddress = ?", EmailAttempt)
            encryptedPassword = self.cursor.fetchone()
            return encryptedPassword
    
    def getUserBasics(self, emailAddress):
        just_email = [emailAddress]
        self.cursor.execute("SELECT id FROM users WHERE emailAddress = ?", just_email)
        record = self.cursor.fetchone()
        return record

