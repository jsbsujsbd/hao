const joi = require('joi');

// 1. 身份证号验证规则
// 规则说明：
// - 18位字符
// - 前17位为数字
// - 最后1位可以是数字或大写X（符合国家标准）
const idCard = joi.string()
  .pattern(/^(^\d{17}(\d|X|x)$)/) // 核心正则：17位数字 + 1位数字/X/x
  .required()
  .message('请输入有效的18位身份证号（最后一位可为X）');

// 2. 密码验证规则
// 规则说明：
// - 6-20位
// - 不能包含空格
// - 必须包含字母和数字（增强安全性）
const password = joi.string()
  .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[^\s]{6,20}$/) // 包含字母+数字+无空格+6-20位
  .required()
  .message('密码必须为6-20位，包含字母和数字，且不能有空格');
exports.reg_login_schema={
    body:{
        idCard,
        password
    }
}