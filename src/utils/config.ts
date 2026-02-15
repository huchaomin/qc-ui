export const passwordReg =
  // eslint-disable-next-line regexp/no-obscure-range
  /^(?=[!-~]{8,}$)(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])).+$/
export const passwordRegMessage = '密码8位及以上，含大写字母、小写字母、数字、特殊字符中至少三类'
