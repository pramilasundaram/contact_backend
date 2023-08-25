const User = require('../models/userSchema')
const moment = require('moment')
const csv = require("fast-csv")
const fs = require("fs")
const BASE_URL=process.env.BASE_URL;

//get all users
//method:GET
//path:user/getallusers

const getUsers = async (req, res) => {
    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const sort = req.query.sort || ""
const page=req.query.page||1
const ITEM_PER_PAGE=4;

const query = {
        fullname: { $regex: search, $options: "i" }
    }
    if (gender !== "All") {
        query.gender = gender
    }
    try {
        const skip=(page-1)*ITEM_PER_PAGE;

        const count=await User.countDocuments(query)

        const users = await User.find(query)
        .sort({ dateCreated: sort == "new" ? -1 : 1 })
        .limit(ITEM_PER_PAGE)
        .skip(skip)

        const pagecount=Math.ceil(count/ITEM_PER_PAGE);

        return res.status(200).json({pagination:{count,pagecount},users})
    } catch (error) {
        return res.status(400).json(error)
    }
}


//register user
//method:POST
//path:user/register

const createUsers = async (req, res) => {
    const image = req.file.filename
    // console.log(req.body, image)
    const { fullname, email, phonenumber, gender, location } = req.body;
    if (!fullname || !email || !phonenumber || !gender || !location) {
        return res.status(400).json({ error: "All fields required" })
    }

    try {
        const old_user = await User.findOne({ email: email })

        if (old_user) {
            return res.status(400).json({ error: "user already exists" })
        }
        else {
            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

            const userData = new User({
                fullname, email, image: image, location, phonenumber, gender, dateCreated: datecreated
            })
            await userData.save();
            return res.status(200).json(userData)
        }
    } catch (error) {
        return res.status(400).json(error)
    }
}


//get single user
//method:GET
//path:user/getuser/:id

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findOne({ _id: id })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json(error)
    }
}


//edit user
//method:PUT
//path:user/edit/:id
const updateUsers = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, phonenumber, gender, location, image } = req.body;
    const file = req.file ? req.file.filename : image;
    const dateupdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
    try {
        const updateduserData = await User.findByIdAndUpdate({ _id: id }, {
            fullname, email, image: file, location, phonenumber, gender, dateUpdated: dateupdated
        }, { new: true })
        await updateduserData.save();
        return res.status(200).json(updateduserData);

    } catch (error) {
        return res.status(400).json(error)
    }
}

//delete user
//method:DELETE
//path:user/delete/:id
const deleteUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteuserData = await User.findByIdAndDelete({ _id: id });
        return res.status(200).json(deleteuserData);
    } catch (error) {
        return res.status(400).json(error)
    }
}

//export Csv 

const userExport = async (req, res) => {
    try {
        const users = await User.find();
        const csvStream = csv.format({ headers: true });

        
        const writablestream = fs.createWriteStream("public/users.csv")
        csvStream.pipe(writablestream);
        writablestream.on("finish",function () {
            res.json({url:`${BASE_URL}/public/users.csv`})
        });     
            users.map((user) => {
                csvStream.write({
                    Fullname: user.fullname ? user.fullname : "-",
                    email: user.email ? user.email : "-",
                    phonenumber: user.phonenumber ? user.phonenumber : "-",
                    gender: user.gender ? user.gender : "-",
                    image: user.image ? user.image : "-",
                    location: user.location ? user.location : "-",
                    dateCreated: user.dateCreated ? user.dateCreated : "-",
                    dateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                })
            })
        
        csvStream.end();
        writablestream.end();
       
    } catch (error) {
        res.json(error)
    }
}


module.exports = { getUsers, updateUsers, deleteUsers, createUsers, getUser, userExport }