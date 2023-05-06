Instructions: How to run the project,

1. Unzip the folder

2. On Terminal : run the command :   1.'npm-install' 2. 'node server.js'
(Make sure node is installed on the local system)

3.Now you can vist the website on http://localhost:2020/

-------------------------------------------------------------------------------------------------------------------------------------
                          IMPORTANT POINTS
----------------------------------------------------------------------------------------------------------------------------------------

4. Now there are two Entries/users that have already been created as sample Users
5. One of it has admin rights and it's loginInfo : email: abc@gmail.com password:'1234' => IMPORTANT =>>> Right now there is only one admin with the following credentials who can access all the userInfo

6. If a new user registers he is automatically given a role  of a normal user. hence our admin is only and only :{email: abc@gmail.com password:'1234' }

7. The second sample User login info: {
    email: qwerty@gmail.com,
    password : '1234'
}
8. Both of these users do not have any resume files as they are just sample users
-------------------------------------------------------------------------------------------------------------------------------------
9. If the user is admin all the information is rendered 
 
10. If the user has a role of 'user' information only specific to that user is sent

----------------------------------------------------------------------------------
Information about architecture in architecture.txt and Sample Sql Database Screenshots in folder: db-screenshots
--------------------------------------------------------------------------------------