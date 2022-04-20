const chat = require("../models/chat");

const express = require("express"),
    router = express.Router(),
    user = require("../models/user");

router.get("/", function(req, res) {
    user.find({ userName: { '$nin': ['admin'] } }, function(err, data) {
        if (err) {
            res.send(response(false, err, null));
            return;
        }
        res.send(response(true, 'success!', data));
    });
}).get("/:id", function(req, res) {
    const id = req.params.id;
    user.find({ _id: id }, function(err, data) {
        if (err) {
            res.send(response(false, err, null));
            return;
        }
        res.send(response(true, 'success!', data[0]));
    });
}).post("/", function(req, res) {
    const obj = req.body;
    const model = new user(obj);

    model.save(function(err, result) {
        if (err) {
            res.send(response(false, 'Same User Name Already created', null));
            return;
        }
        res.send(response(true, 'created', result));
    });

}).put("/:id", function(req, res) {
    const id = req.params.id;
    const obj = req.body;
    user.findByIdAndUpdate(id, { name: obj.name, userName: obj.userName, password: obj.password },
        function(err, result) {
            if (err) {
                res.send(response(false, err, null));
                return;
            }
            res.send(response(true, 'updated', result));
        });
}).delete("/:id", function(req, res) {
    const id = req.params.id;
    user.findByIdAndRemove(id, function(err, result) {
        if (err) {
            res.send(response(false, err, null));
            return;
        }
        res.send(response(true, 'deleted', result));
    });
}).post("/login", function(req, res) {
    console.log(req.body,"body");
    const obj = req.body;
    user.find({ userName: obj.userName, password: obj.password }, function(err, data) {
        if (err) {
            res.send("error");
            return;
        } else {
            if (data.length === 0)
                res.send(response(false, "Wrong Username/ Password", null));
            else res.send(response(true, "success", data[0]));
        }
    });
}).post("/home", function (req,res) {
    chat.find({curentUserId: req.body.curentId,fromUserId: req.body.friendId}, function(err,data) {
        if(err) {
            console.log(err,"err");
            res.send("error")
            return
        } else {
            user.find({_id:req.body.friendId}, function(erruser,dataUser) {
                if(erruser) {
                    console.log(erruser);
                    res.send("error")
                    return
                } else {res.send(response(true,'success'))}
            })
            if (data.length === 0) {
                console.log(req.body,'bbbb');
                createChat(req.body.curentId,req.body.friendId,[])
                res.send(response(true, "Create new chat", null));
            } else {
                res.send(response(true,"success",data))
            }
        }
    })
})

//this will create resoinse object.
function response(success, message, data) {
    return { success: success, message: message, data: data }
}

function createChat(curentId,fromUserId,message) {
    const model = new chat({ curentUserId: curentId, fromUserId: fromUserId, message: message });
    model.save(function(err, result) {
        if (err) {
            console.log("error on Admin creation: ", err);
            return;
        }
        console.log("Chat created:");
    });
}

module.exports = router;