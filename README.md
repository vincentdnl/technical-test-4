# Technical test

## Introduction

Fabien just came back from a meeting with an incubator and told them we have a platform “up and running” to monitor people's activities and control the budget for their startups !

All others developers are busy and we need you to deliver the app for tomorrow.
Some bugs are left and we need you to fix those. Don't spend to much time on it.

We need you to follow these steps to understand the app and to fix the bug : 
 - Sign up to the app
 - Create at least 2 others users on people page ( not with signup ) 
 - Edit these profiles and add aditional information 
 - Create a project
 - Input some information about the project
 - Input some activities to track your work in the good project
  
Then, see what happens in the app and fix the bug you found doing that.

## Then
Time to be creative, and efficient. Do what you think would be the best for your product under a short period.

### The goal is to fix at least 3 bugs and implement 1 quick win feature than could help us sell the platform

## Setup api

- cd api
- Run `npm i`
- Run `npm run dev`

## Setup app

- cd app
- Run `npm i`
- Run `npm run dev`

## Finally

Send us the project and answer to those simple questions : 
- What bugs did you find ? How did you solve these and why ? 
- Which feature did you develop and why ? 
- Do you have any feedback about the code / architecture of the project and what was the difficulty you encountered while doing it ? 

## Answers

- **What bugs did you find ? How did you solve these and why ?**
    - Sign up to the app
        - Password “test” doesn’t let you create a user but there is no form validation visual feedback in the UI
            - Problem: the api route /user/signup does send `ok: false` with `“PASSWORD_NOT_VALIDATED”` as an error code. But the UI doesn’t display it.
            - Fix: check if the api response is not ok and display the “Wrong login” toast. Note: also fixed the `toast.error` (`app/src/scenes/auth/signup.js:33`) that had the wrong syntax and would only display “Wrong login” (but not the error code).
    - Create at least 2 others users on people page ( not with signup )
        - “name” field is not filled when creating users in the UI
            - Problem: the field is called username in the form (`app/src/scenes/user/list.js:131`) and name in the model (`api/src/models/user.js:9`)
            - Fix: given the context of delivering the fix for tomorrow, I’ll rename the field in the form from username to name, to avoid a database migration. Later on, I feel like this field should be properly renamed to username, which describes better what it represents.
            - Problem: creating two users with the same name, given the previous bug, made me realize that the field name should be required in the user model. The api should not let the client create invalid users.
            - Fix: adding `required: true` to the name field (in `api/src/models/user.js:9`)
        - “password” field makes password visible and this might be a security issue
            - Problem: the field has no type which defaults to “text”
            - Fix: adding type: “password” to the Password field (`app/src/scenes/user/list.js:142`)
    - Edit these profiles and add additional information
        - Can’t update the user
            - Problem: nothing happens when clicking on the “Update” button
            - Fix: Change `onChange` to `onClick`
    - Create a project
        - The project is created but only appears after a refresh
            - Problem: nothing happens after the project is created
            - Fix: refresh the project list after the project is created
    - Input some information about the project
        - `project.name` is undefined
            - Problem: The api route project/:id returns a list of projects instead of one project. This comes from the use of the `find` method from mongoose.
            - Fix: `findOne` should be used instead.
    - Input some activities to track your work in the good project
        - No bug found here
- **Which feature did you develop and why ?**
    - I chose to implement a feature that let people see the latest activities performed by a user. It will help identify quickly which projects a user has been working on lately.
- **Do you have any feedback about the code / architecture of the project and what was the difficulty you encountered while doing it ?**
    - There are lots of bugs which can be overwhelming for a developer to tackle them all. Like for example an out-of-scope bug that doesn’t let a user that logged out log back in (which is due to a bad comparison between the password and the hash in database).
    - The architecture seems fine. Some situations, like having the API return a 200 (success) with a payload containing an `ok: false` flag might be better handled with status codes in my opinion.
