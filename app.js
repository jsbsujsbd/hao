const express=require('express')
const { expressjwt } = require('express-jwt'); 
const {secretKey} =require('./jwt')  // 7.x 必须解构
const app=express()
const cors=require("cors")
const router=require('../宠物管理后台/router/user')
const { default: axios } = require('axios')
const auth=require('./auth')
app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use((req,res,next)=>{
    console.log('原始头：', req.headers.authorization);
    res.cc=function(err,status=1){
        res.send({
            status,
            message:err instanceof Error?err.message:err
        })
        console.log(err)
         
    }
    next()
})

// app.use(expressjwt({secret:secretKey,algorithms: ['HS256'] }) .unless({ path: [/^\/userSearch/, /^\/regUser/]}))
app.use(router)

app.use((err,req,res,next)=>{
   console.log(err)
   res.cc("服务器内部错误")
})

app.listen(9090, ()=>{
    console.log("启动成功")
})