# TextAnalyzer

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
