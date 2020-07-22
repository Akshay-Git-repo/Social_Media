module.exports.index=function(req,res)
{
    return res.json(200,{
        message:"List Of Posts in version 2",
        posts:[],

    });
}