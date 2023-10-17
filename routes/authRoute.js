let express = require('express');
let {registerController,loginController,testController, forgetPasswordController, updateProfileController} = require('../controllers/authController.js')
let {requireSignIn,isAdmin} = require('../middleware/authMiddleware.js');
let router = express.Router();


// register
router.post('/register',registerController)

// login

router.post('/login',loginController)

// forget Password
router.post('/forgot-password', forgetPasswordController)

router.get('/test',requireSignIn,isAdmin, testController)

// protected user-route auth
router.get('/user-auth', requireSignIn, (req,res) =>{
    res.status(200).send({ok:true})
})

// protected admin-route auth

router.get('/admin-auth',requireSignIn, isAdmin, (req,res) =>{
 
    res.status(200).send({ok:true})
})

// update profile

router.put('/profile', requireSignIn, updateProfileController)

module.exports = router