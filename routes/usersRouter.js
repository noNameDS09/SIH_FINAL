const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
router.get("/", async(req, res) => {
    res.send("usersRouter");
    try{
        let user = await userModel.create({
            email,
            password,
            username
        });
        res.send(user)
    }catch(err){
        res.send(err.message);
    }
})
module.exports = router;