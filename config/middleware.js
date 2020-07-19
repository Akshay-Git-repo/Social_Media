module.exports.setFlash=function(req,res,next)
{
   

    console.log("inside the setflash");
    res.locals.flash=
    {
        "success":req.flash('success'),
        "error":req.flash("error")
    }
    next();
}