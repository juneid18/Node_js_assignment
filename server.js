const express = require('express')
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

app.use(express.json());


const taskQueue = {};
const rateLimit = {};

async function task(user_id) {
    const LogMessage = `${user_id} - task completed at -${Date.now()}\n`;
    await fs.appendFile('task_log.txt',LogMessage);
    console.log(LogMessage.trim());
}

async function handleTask(user_id) {
    const Now = Date.now();

    if(!rateLimit[user_id]){
        rateLimit[user_id] = {count: 0, lastTaskTime: 0};
        taskQueue[user_id] = [];
    }
    const { count, lastTaskTime } = rateLimit[user_id];
    if (count < 20 || Now - lastTaskTime > 60000) {
        if (Now - lastTaskTime >= 1000 || count === 0) {
            // Reset counters if more than a minute has passed
            if (Now - lastTaskTime > 60000) rateLimit[user_id].count = 0;

            // Allow task execution
            rateLimit[user_id].count++;
            rateLimit[user_id].lastTaskTime = Now;
            await task(user_id);

            // Check if any queued tasks for the user
            if (taskQueue[user_id].length > 0) {
                const nextTask = taskQueue[user_id].shift();
                setTimeout(() => handleTask(nextTask.user_id), 1000); // Process next task after 1 second
            }
        } else {
            // Queue task if executed in less than 1 second
            console.log(`Task for ${user_id} queued.`);
            taskQueue[user_id].push({ user_id });
        }
    } else {
        // If 20-per-minute limit reached, reset in a minute and queue task
        taskQueue[user_id].push({ user_id });
        console.log(`Task for ${user_id} queued due to 20-per-minute limit.`);
        setTimeout(() => {
            rateLimit[user_id].count = 0;
            handleTask(user_id);
        }, 60000 - (Now - lastTaskTime));
    }
}
app.post('/task', async (req,res) => {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).send("User ID is required.");

    await handleTask(user_id);
    res.status(200).send("Task received.");
})

app.listen(PORT, () =>{
    console.log('server is running on Port' + PORT);
});