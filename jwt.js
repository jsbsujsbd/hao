// config/jwt.js
module.exports = {
  secretKey: 'itheimaNo1^_^',   // 将来改 env 也只需改这里
  expiresIn: '30d'
};
console.log(token);
console.log('过期时间：', new Date(jwt.decode(token).exp * 1000));