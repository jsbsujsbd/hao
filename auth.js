// auth.js 只验票，不发送任何响应
module.exports = function mustToken(req, res, next) {
  const raw = req.headers.authorization || req.headers.Authorization;
  if (!raw) return res.status(401).json({ status: 1, message: '缺少令牌' });

  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  try {
    req.user = jwt.verify(token, secretKey);   // 成功挂载
    return next();                             // 交给下一个中间件
  } catch (e) {
    return res.status(401).json({ status: 2, message: '令牌无效或已过期' });
  }
};