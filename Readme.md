## Task Management Server Documentation ##
-- Welcome --
This is a lightweight Express.js server that I created to manage tasks for users. Designed to manage the queue efficiently with some rate limiting and queuing mechanisms, it allows every user to submit up to 20 tasks per minute and should properly space those out not to overwhelm the server.

-- Getting Started --
    Dependencies
        To run this server, you'll need a couple of packages:

        Express: This is the web framework I used in making the server and handling every single HTTP request.
        fs (File System): This is the one of the built-in module that is assisting me with file operations, and for asynchronous file handling, I am using its promises API.
        Setting up the Server
        The server is listed at port 3000 and is using middleware express.json() when parsing incoming requests JSON payload. It makes pretty easy to work around the incoming data.
 
-- Global Variables --
taskQueue: A data structure storing any tasks to be queued for a user.
rateLimit: Here we keep track of the number of tasks a user has done as well as when he last did one.
Functions
task(user_id)
This function is in charge of completing a task for a user.
 
It writes a message claiming the task is completed with a timestamp.
Parameter: user_id — ID of the user completing the task.
handleTask(user_id)
This is the magic function for task management.

Checks if the user has already exceeded his limit for tasks.
Runs the task. If a user has surpassed his limits, it sends the task to the queue to be run later
Parameter: user_id-ID of the user whose task we are processing.
API Endpoint
POST /task
It accepts the request from a user requesting to post their tasks

-- Request Body --
user_id: It's a mandatory field because that's going to be the identifier of the user.
Responses :
200 OK: Accepts the request, queues, and processes.
400 Bad Request: If a user ID is missing, we return an error.