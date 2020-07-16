const express = require("express");
const app = express();
const PORT = 4000;

const User = require("./models").user;
const TodoList = require("./models").todoList;

app.use(express.json())

app.post("/echo", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (e) {
        next(e);
    }
})

app.post("/users", async (req, res, next) => {
    try {
        const email = req.body.email;
        if (!email || email === " ") {
            res.status(400).send("Must provide an email address");
        } else {
            const user = await User.create(req.body);
            res.json(user);
        }
    } catch (e) {
        console.log("error bitch")
        next(e);
    }
});

app.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const upToDate = await User.findByPk(id);

    if (upToDate) {
        res.send(upToDate);
    } else {
        res.status(404).send("id not found");
    }
});

app.get("/todolists", async (req, res) => {
    const todos = await TodoList.findAll();
    res.json(todos);
});

app.post("/todolist", async (req, res, next) => {
    try {
        const data = await TodoList.create(req.body);
        res.json(user);
    }
    catch (e) {
        next(e);
    }
})

app.listen(PORT, function () {
    console.log("listening on port", PORT);
})