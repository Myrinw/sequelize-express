const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

const cors = require("cors");
app.use(cors())

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

app.post("/todolists", async (req, res, next) => {
    try {
        const newList = await TodoList.create(req.body);
        res.json(newList);
    } catch (e) {
        next(e);
    }
});

app.put("/todolists/:listId", async (req, res, next) => {
    try {
        const listId = parseInt(req.params.listId);
        const listToUpdate = await TodoList.findByPk(listId);
        if (!listToUpdate) {
            res.status(404).send("List not found");
        } else {
            const updatedList = await listToUpdate.update(req.body);
            res.json(updatedList);
        }
    } catch (e) {
        next(e);
    }
});

app.get("/users/:userId/lists", async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await User.findByPk(userId, {
            include: [TodoList],
        });
        if (user) {
            console.log(user.todoLists)
            res.send(user.todoLists);
        } else {
            console.log("not found iiittt");
            res.status(404).send("User not found");
        }
    } catch (e) {
        console.log("noooo")
        next(e);
    }
});

app.post("/users/:userId/lists", async (req, res, next) => {
    try {
        const id = req.params.userId;
        const user = await User.findByPk(id);
        if (user) {
            const newTodo = await TodoList.create({ userId: id, ...req.body });
            res.send(newTodo);
        } else {
            res.status(404).send("user not found")
        }
    } catch (e) {
        next(e);
    }

})

app.delete("users/:userId/lists/:listId", async (req, res, next) => {
    try {

        const listId = req.params.listId;
        const list = await TodoList.findByPk(listId);
        if (list) {
            const remove = await TodoList.destroy(list);
            res.status(202).send(remove);
        } else {
            res.status(404).send("list not found");
        }
    } catch (e) {
        next(e);
    }
});

app.listen(PORT, function () {
    console.log("listening on port", PORT);
})