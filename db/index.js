const {Pool} =require('pg')
const db=new Pool({
    host:'127.0.0.1',
    port:'52000',
    password:'123456',
    user:'system',
    database:'UserTable',
    max: 50, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 20000, 
})
db.query('SELECT NOW()', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
});

module.exports=db