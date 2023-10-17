let productModel = require('../models/productModel');
let slugify = require('slugify');
let {categoryModel} = require('../models/categoryModel');
let fs = require('fs')
let braintree = require("braintree");
const dotenv = require('dotenv')
let {orderModel}  = require('../models/orderModel')
dotenv.config();


// payment gatway


let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

let createProductController = async(req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        // validation
        switch(true){
            case !name:
                return res.status(500).send({message:'Name is Required'})
 
            case !description:
                return res.status(500).send({message:'Description is Required'}) 
            case !price:
                return res.status(500).send({message:'Price is Required'})    
            case !category:
                 return res.status(500).send({message:'Category is Required'})  
                 
            case !quantity:
                return res.status(500).send({message:'Quantity is Required'}) 
            case photo && photo.size>1000000:
                 return res.status(500).send({message:'Photo is required and should be less then 1mb'})      
        }

        const product = new productModel({...req.fields, slug:slugify(name)})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        console.log(product)
        await product.save()
        res.status(201).send({
           success:true,
           message:"Product Created Successfully" ,
           product,
        })



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while creating products",
            error
        })
    }

}

// get all product
const getProductController = async(req,res) =>{
try{
const product = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
res.status(200).send({
    productCount: product.length,
    success:true,
    message:'All Products',
    product
    
})


}catch(error){
   console.log(error) 
   res.status(500).send({
    success:false,
    message:'Error in getting products',
    error
   })
}
}


// get single product

const getSingleProductController = async(req,res) =>{
  try{
 const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
 res.status(200).send({
    success:true,
    message:"Single product fetched",
    product
 })

  }catch(error){
    console.log(error)
    res.status(500).json({
        success:false,
        message:"Error while getting single product",
        error
    })
  }
}

// get photo

const productPhotoController = async(req,res)=>{
try{
const product = await productModel.findById(req.params.pid).select("photo")
if(product.photo.data){
    res.set('Content-type', product.photo.contentType);
   return res.status(200).send(product.photo.data)
}


}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error while getting photo",
        error
    })
}
}

// delete product
const deleteProductController = async(req,res)=>{
try{

await productModel.findByIdAndDelete(req.params.pid).select("-photo")
res.status(200).send({
    success:true,
    message:'Product deleted successfully'
})


}catch(error){
   console.log(error) 
   res.status(500).send({
    success:false,
    message:"Error while deleting product",
    error
})
}
}


// update product

const updateProductController = async(req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        // validation
        switch(true){
            case !name:
                return res.status(500).send({message:'Name is Required'})
 
            case !description:
                return res.status(500).send({message:'Description is Required'}) 
            case !price:
                return res.status(500).send({message:'Price is Required'})    
            case !category:
                 return res.status(500).send({message:'Category is Required'})  
                 
            case !quantity:
                return res.status(500).send({message:'Quantity is Required'}) 
            case photo && photo.size>1000000:
                 return res.status(500).send({message:'Photo is required and should be less then 1mb'})      
        }

        const product = await  productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)}, {new:true})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

         await product.save()
        res.status(200).send({
           success:true,
           message:"Product update Successfully" ,
           product,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while updating products",
            error
        })
    }
}

// filter product

const productFilterController = async(req,res)=>{
    try{
    const {checked,radio} = req.body
    let args = {}
    if(checked.length >0) args.category = checked
    if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
    const product = await productModel.find(args)
    res.status(200).send({
        success:true,
        product,
    })

    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while filtering product",
            error
        })
    }

}

// pagination functionality

const productCountController = async(req,res) =>{
    try{
   const total = await productModel.find({}).estimatedDocumentCount()
   res.status(200).send({
    success:true,
    total
   })

    }catch(error){
        console.log(error)
        res.status(400).send({
            message:'Error in product count',
            error,
            success:false
        })
    }
}

// product per page

const productListController = async(req,res) =>{
    try{
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const product = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            product
        })

    }catch(error){
        console.log(error)
        res.status(400).send({
            message:'Error in count per page',
            success:false,
            error
        })
    }
}


// search product

const searchProductController = async(req,res)=>{
    try{
    let {keyword} = req.params
    console.log(keyword)
    const result = await productModel.find({
        $or:[
            {name:{$regex : keyword, $options:'i'}},
            {description:{$regex : keyword, $options :'i'}}
        ]
    }).select("-photo")
    res.json(result)

    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error in search",
            error
        })
    }
}


const relatedProductController = async(req,res) => {
    try{
    const {pid,cid} = req.params
    const product = await productModel.find({
        category:cid,
        _id:{$ne:pid}
    }).select("-photo").limit(3).populate("category")
   
    res.status(200).send({
        success:true,
        product,
    })


    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error whilw getting related product'
        })
    }
}

//  getting  product by category

const productCategoryController = async(req,res) =>{
    try{
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
        success:true,
        category,
        products
    })


    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error whilw getting  product'
        })
    }

}

// payment gateway api
//token
const braintreeTokenController = async(req,res)=>{
    try{
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })

    }catch(error){
        console.log(error)
    }

}

// payment
const braintreePaymentController = async(req,res)=>{
    try{
        const {cart,nonce} = req.body
        let total = 0
        cart.map((i)=> {total+= i.price})
        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
              const order = new orderModel({
                products:cart,
                payment:result,
                buyer:req.user._id
              }).save()
              res.json({ok:true})
            }else{
                res.status(500).send(error)
            }
        }
        )

    }catch(error){
        console.log(error)
    }

}

module.exports = {createProductController, getProductController,getSingleProductController,productPhotoController,deleteProductController,updateProductController,productFilterController,productCountController,productListController,searchProductController,relatedProductController,productCategoryController,braintreeTokenController,braintreePaymentController}