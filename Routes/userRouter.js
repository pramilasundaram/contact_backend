const router=require('express').Router();
const {createUsers,getUsers,getUser,updateUsers,deleteUsers,userExport}=require("../Controllers/userController");

const upload=require('../multerconfig/storageConfig')

router.route("/register").post(upload.single("image"),createUsers)
router.route("/getallusers").get(getUsers)
router.route("/getuser/:id").get(getUser)
router.route("/edit/:id").put(upload.single("image"),updateUsers)
router.route("/delete/:id").delete(deleteUsers)
router.route("/userexport").get(userExport)


module.exports=router;