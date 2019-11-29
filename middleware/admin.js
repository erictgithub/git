const hasAccessAdmin = (req,res,next)=>
{
    if(req.session.userInfo==null || req.session.userInfo.admin == false)
    {
        res.redirect("/user/login");
    }
    else
    {
        next();
    }
}

module.exports=hasAccessAdmin;