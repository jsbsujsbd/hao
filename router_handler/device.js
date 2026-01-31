const db=require('../db/index')
const AddDevice='insert into Device(account,device_specification,bind_time,firmware_version,device_name,device_number,last_online_time,device_model) values ($1,$2,$3,$4,$5,$6,$7,$8)'
const SelectDevice='select * from Device,UserTable where UserTable.account=$1 and Device.device_number=$2 and Device.account=UserTable.account '
exports.AddDevice=(req,res)=>{
    const {account,device_specification,bind_time,firmware_version,device_name,device_number,last_online_time,device_model}=req.body
    db.query(AddDevice,[account,device_specification,bind_time,firmware_version,device_name,device_number,last_online_time,device_model],(err,results)=>{
   if(err){
       return res.cc(err)
   }    
   res.send({
    message:"添加成功",
    status:0
    })

})
}
exports.device_status=(req,res)=>{
    const {account,device_number}=req.query
    db.query(SelectDevice,[account,device_number],(err,results)=>{
        if(err){
            return res.cc(err)
        }
        res.send({
            message:"查询成功",
            status:0,
            data:results.rows
        })
    })
}