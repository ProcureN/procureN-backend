const importUser =async()=>{
    try {
        res.status(200).send({status:true,msg :"working"})
    } catch (error) {
    res.status(500).send({status:false,message: error.message})
    }
}

module.exports ={importUser}