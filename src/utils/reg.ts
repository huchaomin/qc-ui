// 必须包含数字和大写字母小写字母，最低8位
export const passwordReg = /^(?=\S{8,}$)(?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])\S+$/
