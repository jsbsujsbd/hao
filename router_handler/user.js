const express=require('express')
const db=require('../db/index')
const bcryptjs=require('bcryptjs')
const axios=require('axios')
const jwt=require('jsonwebtoken')
const deepseek_key="sk-vaqkzmvfegfwhlskqcllqivrhxjgotplzhbnzmcqsdzbxfjh"
const DEEPSEEK_URL = 'https://api.siliconflow.cn/v1/chat/completions';
//登录部分
const dl='select * from UserTable where account=$1'
const zc='insert into UserTable (account,password,username) values ($1,$2,$3)'
const {secretKey} =require('../jwt')
// const auth=require('../auth')
// const { message } = require('rhea')
// const { date } = require('joi')
// exports.login=(req,res)=>{
//     const userinfo=req.body
//     db.query(dl,userinfo.idCard,(err,results)=>{
//         if(err){
//           return  res.cc(err)
//         }
//         if(results.length==0){
//            console.log("用户不存在")
//            return  res.cc("用户不存在")
//         }



        
//     })
// }
exports.regUser=(req,res)=>{
 const {account,password,username}=req.body
 db.query(dl,[account],(err,results)=>{
    if(err){
        console.log(err)
        return res.cc('注册失败')
    }
    console.log(results.rows.length)
    if(results.rows.length>0){
        console.log(results)
        return res.cc("该账号被占用")
    }
     hashPwd=bcryptjs.hashSync(password,10)
       db.query(zc,[account,hashPwd,username],(err,results)=>{
    if(err){
        return res.cc("注册失败")
    }
    if(results.rowCount!=1){
      return res.cc(err)
    }
    console.log("注册成功")
    res.cc("注册成功",0)
 })
 })


}

exports.forGectPwd=(req,res)=>{
    const {newPassword,account}=req.body
     if(!newPassword){
            return res.cc('密码不能为空')
        }
    const updatePwd='update UserTable set password=$1 where account=$2'
    hashPwd=bcryptjs.hashSync(newPassword,10)
    db.query(updatePwd,[hashPwd,account],(err,results)=>{
        if(err){
            return res.cc(err)
        }
       
    })

}
exports.userSearch = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  /* ========== 1. 有令牌 → 验票/续期 ========== */
  if (token) {
    let decoded;   // 提前声明，避免重复声明
    try {
      decoded = jwt.verify(token, secretKey);
      const accountFromToken = decoded.account;

      db.query('SELECT id,account,username FROM UserTable WHERE account=$1', [accountFromToken], (err, results) => {
        if (err) return res.cc(err);
        if (results.rows.length === 0) return res.cc('用户不存在');

        return res.send({   // 1. 正常令牌 → 只发一次
          status: 0,
          message: '自动登录成功',
          data: results.rows[0]
        });
      });
      return; // 阻止继续往下走
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        decoded = jwt.decode(token);   // 复用变量
        if (decoded?.account) {
          const newToken = jwt.sign({ account: decoded.account }, secretKey, { expiresIn: '30d' });

          db.query('SELECT id,account,username FROM UserTable WHERE account=$1', [decoded.account], (err, results) => {
            if (err) return res.cc(err);
            if (results.rows.length === 0) return res.cc('用户不存在');

            return res.send({   // 2. 过期续期 → 只发一次
              status: 0,
              message: '令牌已过期，已自动续期',
              data: results.rows[0],
              token: newToken
            });
          });
          return; // 阻止继续往下走
        }
      }
      // 3. 其他令牌错误 → 只发一次
      return res.status(401).json({
        status: 2,
        message: `令牌验证失败: ${e.message}`
      });
    }
  }

  /* ========== 2. 无令牌 → 普通登录 ========== */
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(400).json({ status: 1, message: '账号和密码不能为空' });
  }

  db.query('SELECT id,account,username,password FROM UserTable WHERE account=$1', [account], (err, results) => {
    if (err) return res.cc(err);
    if (results.rows.length === 0) return res.cc('用户不存在');

    const isMatch = bcryptjs.compareSync(password, results.rows[0].password);
    if (!isMatch) return res.cc('账号或密码错误');

    const newToken = jwt.sign({ account }, secretKey, { expiresIn: '30d' });
    return res.send({   // 4. 登录成功 → 只发一次
      status: 0,
      message: '登录成功',
      data: {
        id: results.rows[0].id,
        account: results.rows[0].account,
        username: results.rows[0].username
      },
      token: newToken
    });
  });
};



exports.ChangeAccount=(req,res)=>{
    const {account,newAccount}=req.body
    db.query('select account from UserTable where account=$1',[account],(err,results)=>{
        if(results.rows.length==0){
            return res.cc('用户不存在')
        }
        db.query('update UserTable set account=$2 where account=$3',[newAccount,account],(err,results)=>{
        if(err){
           console.log(err)
           return res.cc('修改失败')
       }        
       res.send({
        status:0,
        message:"修改成功",
       

       })
}
)
    })

}


exports.ChangeUserName=(req,res)=>{
    const {account,newUserName}=req.body
    db.query('select account from UserTable where account=$1',[account],(err,results)=>{
        if(results.rows.length==0){
            return res.cc('用户不存在')
        }
        // if(err){
        //     return res.cc(err)
        // }
        db.query('update UserTable set username=$1 where account=$2',[newUserName,account],(err,results)=>{
        if(err){
           console.log(err)
           return res.cc('修改失败')
       }        
       res.send({
        status:0,
        message:"修改成功",
       

       })
}
)
    })

}





exports.ai=async(req,res)=>{
    res.setHeader('Content-Type','text/plain;charset=utf-8');
    try{
        const {messages}=req.body;
        const answer=await axios.post(
              DEEPSEEK_URL,{
            model: 'deepseek-ai/DeepSeek-V3.1-Terminus',
            messages,
            stream:false,
        },
        {headers:{Authorization:`Bearer ${deepseek_key}`}}
        );
        res.send(answer.data.choices[0].message.content);
    }catch(e){
        console.log(e.response?.data || e.message)
       res.status(500).send('server error');
    }
}
// exports.booksSearch=(req,res)=>{
//     const userinfo=req.body
//     let book='select * from books where 1=1 '
//     let params=[]
//     const {title,author,isbn,publish_date,bookId}=req.query
//     if(title){
//         book+='and title like $1';
//         params.push(`%${title}%`);
//     }
//     if(author){
//         book+='and author like $1';
//         params.push(`%${author}%`)
//     }
//     if(isbn){ 
//          book+='and isbn like $1';
//          params.push(`%${isbn}%`)
        
//     }
//     if(publish_date){
//           book+='and publish_date like $1';
//           params.push(`%${publish_date}%`)
//     }
//     if(bookId){
//           book+='and bookId like $1';
//           params.push(`%${bookId}%`)
//     }
//     db.query(book,params,(err,results)=>{
//         if(err){
//             return res.cc(err)
//         }
//         if(results.length==0){
//             console.log("书籍不存在")
//             return res.cc("查找的书籍不存在")
//         }
//         res.send({
//             status:0,
//             message:"检索成功",
//             data:results

//         })
//         console.log(results)
//     })
// }
