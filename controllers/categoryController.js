let {categoryModel}= require('../models/categoryModel')
let slugify = require('slugify')
const createCategoryController = async(req,res) =>{
    try{
        const {name} = req.body
        console.log(name)
        if(!name){
            return res.status(401).send({message:"Name is required"})
        }


        let existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already exists"
            })
        }

        const category = await new categoryModel({name,slug:slugify(name)}).save()
        console.log(category)
        res.status(201).send({
            success:true,
            message:'New category created',
            category
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in category"
        })
    } 

}


// update category

const updateCategoryController = async(req,res) => {
try{
   const {name} = req.body
   const {id} = req.params
   const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}) 
   res.status(200).send({
    success: true,
    message: "Category Updated Successfully",
    category,
   })

}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error while updating category'
    })
}
}

// get all category
const categoryController = async(req,res) => {
try{
const category = await categoryModel.find({})
res.status(200).send({
    success:true,
    message:"All Categories List",
    category,
})

}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:'Error while getting all categories'
    })
}
}


const  singleCategoryController = async(req,res) => {
try{

const category = await categoryModel.findOne({slug:req.params.slug})
res.status(200).send({
    success:true,
    message:'Get Single Category Successfully',
    category
})
}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message:"Error while getting single category"
    })
}
}

// delete category

const deleteCategoryController = async(req,res) => {
    try{

        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Category deleted successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while deleting category'
        })
    }
}



module.exports = {createCategoryController , updateCategoryController,categoryController,singleCategoryController,deleteCategoryController}