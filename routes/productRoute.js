const express = require('express')
const formidableMiddleware = require('express-formidable');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } = require('../controllers/productController')

const router = express.Router()

// routes

router.post('/create-product', requireSignIn,isAdmin,formidableMiddleware(),createProductController)

// update product
router.put('/update-product/:pid', requireSignIn,isAdmin,formidableMiddleware(),updateProductController)

// get product
router.get('/get-product',getProductController)

// get single product

router.get('/get-product/:slug', getSingleProductController)

// get photo

router.get('/product-photo/:pid', productPhotoController)

// delete product

router.delete('/delete-product/:pid', deleteProductController)

// filter product

router.post('/product-filter', productFilterController);

// pagination

router.get('/product-count', productCountController)

// product per page

router.get('/product-list/:page' , productListController)

// serach product

router.get('/search/:keyword', searchProductController)

// similar product

router.get("/related-product/:pid/:cid", relatedProductController )

// categories wise product
router.get('/product-category/:slug', productCategoryController)

// payment route
//token
router.get('/braintree/token',braintreeTokenController)

// payment
router.post('/braintree/payment' , requireSignIn, braintreePaymentController)







module.exports = router