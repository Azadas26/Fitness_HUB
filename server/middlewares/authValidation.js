import joi from 'joi';

export const registerValidation = (req,res,next)=>{
    const Schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(3).max(1000).required()
    })

    const {error} = Schema.validate(req.body);
    if(error){
        return res.status(400).json({success:false,message:"Bad request",error})
    }
    next()
}

export const LoginValidation = (req,res,next)=>{
    const Schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(1).max(1000).required()
    })

    const {error} = Schema.validate(req.body);
    if(error){
        return res.status(400).json({success:false,message:"Bad request",error})
    }
    next()
}