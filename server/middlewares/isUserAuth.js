import jsonwebtoken from 'jsonwebtoken';

export const isuserauth = async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(400).json({success:false,message:"Tocken missing,please Login"});
    }
    try {
        const tokenDecode =  jsonwebtoken.verify(token,process.env.JWT_SECRET);
        
        if(tokenDecode){
            
            req.body.userId = tokenDecode._id;
        }else{
            return res.status(400).json({success:false,message:"Unotorized Login,Login Again"});
        }
        //console.log(req.body);
        next()
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}