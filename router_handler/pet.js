const db=require('../db/index')
//登录部分
const IrPet='insert into petTable(account,petName,petKind,petWeight,petBirth) values ($1,$2,$3,$4,$5)'
exports.addPet=(req,res)=>{
    const {account,petName,petKind,petWeight,petBirth}=req.body
    db.query(IrPet,[account,petName,petKind,petWeight,petBirth],(err,results)=>{
       if(err){
           return res.cc(err)
       } 
       if(this.account==''||this.petName==''||this.petKind==''||this.petWeight==''||this.petBirth==''){
        return res.cc("信息不能为空")
       }   
       res.send({
        message:"添加成功",
        status:0
       }) 
       
       
    })}
exports.findPet=(req,res)=>{
    const {account}=req.query
       if(!account){
            return res.cc('手机号不能为空')
        }
    const ac=''
    const fd='SELECT petTable.* FROM petTable,UserTable WHERE UserTable.account =$1 AND UserTable.account =petTable.account'
  
    db.query(fd,[account],(err,results)=>{
        if(err){
            return res.cc(err)
        }
     
       
        res.send({
            message:'查找成功',
            status:0,
            data:results.rows
        })
        
      
    
    })
}



exports.DeletePet=(req,res)=>{
   const {account,petName}=req.body
   if(!account||!petName){
    return res.cc('信息不能为空')
   }
   const dp1='delete from petTable where account=$1 and petName=$2'
   const dp2='delete from petHealthMessage where account=$1 and petName=$2'
   db.query(dp2,[account,petName],(err,results)=>{
    if(err){
        return res.cc(err)  
    }             
   db.query(dp1,[account,petName],(err,results)=>{
    if(err){                
        return res.cc(err)      
       
       
    }
    res.send({
    message:'删除成功',
    status:0
   })
   })

})
}
exports.ChangePetMessage=(req,res)=>{
    const {activite_count,eat_count,drink_count,sleep_count,account,petName}=req.body
    const pm='update  petHealthMessage set activite_count=$1,eat_count=$2,drink_count=$3,sleep_count=$4 from petHealthMessage As ph ,UserTable As ue,petTable As pe where ph.account=$5 and pe.petName=$6 and ue.account=pe.account and pe.petName=ph.petName and ph.account=ue.account'
    db.query(pm,[activite_count,eat_count,drink_count,sleep_count,account,petName],(err,results)=>{
        if(err){
            console.log(err)
            return res.cc(err)
        }
        res.send({
            message:'更新成功',
            status:0,
            data:results.rows
        })
    })
}    



exports.FindPetHealthMessage=(req,res)=>{
    const {account,petName,dateTime}=req.query
    console.log(req.query)
    if(!account || !petName||!dateTime){
        return res.cc('信息不能为空')
    }
    const fphm='SELECT petHealthMessage.* FROM petHealthMessage,UserTable,petTable WHERE UserTable.account =$1 AND petTable.petName=$2 AND petHealthMessage.dateTime=$3  and petHealthMessage.petName=petTable.petName and petHealthMessage.account=UserTable.account'
    db.query(fphm,[account,petName,dateTime],(err,results)=>{
        if(err){
            return res.cc(err)
        }
        if(results.rows.length==0){
            return res.cc('未查找到数据')
        }
        res.send({
        message:'查询成功',
        status:0,
        data:results.rows
    })
    })

}

exports.UpdateHealthMessage=(req,res)=>{
    const {account,petName,activite_count,eat_count,drink_count,sleep_count,dateTime}=req.body
    const updateFphm='update  petHealthMessage set activite_count=$1,eat_count=$2,drink_count=$3,sleep_count=$4 from petHealthMessage As ph ,UserTable As ue,petTable As pe where ph.account=$5 and pe.petName=$6 and ue.account=pe.account and pe.petName=ph.petName and ph.account=ue.account'
    const aphm='insert into petHealthMessage(account,petName,activite_count,eat_count,drink_count,sleep_count,dateTime) values ($1,$2,$3,$4,$5,$6,$7)' 
    const fphm='SELECT petHealthMessage.* FROM petHealthMessage,UserTable,petTable WHERE UserTable.account =$1 AND petTable.petName=$2 AND petHealthMessage.dateTime=$3  and petHealthMessage.petName=petTable.petName and petHealthMessage.account=UserTable.account'    
    if(!account || !petName||!activite_count||!eat_count||!drink_count||!sleep_count||!dateTime){
        return res.cc('信息不能为空')
    }
    db.query(fphm,[account,petName,dateTime],(err,results)=>{
        if(err){
            return res.cc(err)
        } 
                
        if(results.rows.length>0){
            db.query(updateFphm,[activite_count,eat_count,drink_count,sleep_count,account,petName],(err,results)=>{
                if(err){
                    return res.cc(err)
                }
                return res.send({
                    message:'更新成功',
                    status:0
                })
            })          
 



        }    else{   
            
            

            db.query(aphm,[account,petName,activite_count,eat_count,drink_count,sleep_count,dateTime],(err,results)=>{
            if(err){
                return res.cc(err)
            }
            res.send({
                message:'添加成功',
                status:0
            })
        })

}




    })

}