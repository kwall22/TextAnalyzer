# TextAnalyzer
TextAnalyzer is a web application that allows users to analyze messages and receive random responses. Built with Flask for the server-side and SQLite for the database, this app includes features for user registration, authentication, and text analysis.

## Features
- User registration, authentication, and authorization
- Text message input and analysis
- Random response generation based on the input message
- RESTful API with CRUD operations
- SQLite database for user and message storage

## Technologies Used
- **Flask**: For building the server-side application
- **SQLite**: For the database
- **Python**: For server-side scripting
- **HTML/CSS/JavaScript**: For the client-side interface
- **RESTful API**: For handling CRUD operations

## Resource

**Text**
Attributes:
- From (string)
- Zodiac (string)
- Text (string)
- Time (string)
- Analysis (string)

**Users** 
Attributes:
- FirstName (string)
- LastName (string)
- EmailAddress (string)
- Password (string)

## Schema

``` sql 
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    pastText TEXT, 
    pastTime TEXT, 
    pastAnalysis TEXT, 
    pastFrom TEXT, 
    pastZodiac TEXT);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    emailAddress TEXT,
    password TEXT);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|----------------
Retrieve text collection       | GET    | /texts
Retrieve text member           | GET    | /texts/*\<id\>*
Create text member             | POST   | /texts
Update text member             | PUT    | /texts/*\<id\>*
Delete text member             | DELETE | /texts/*\<id\>*
Create user member             | POST   | /users
Create session member          | POST   | /sessions

## Password Hashing

**BCrypt Documentation**

[BCrypt](https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html)