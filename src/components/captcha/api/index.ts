/*
 * @Author       : huchaomin peter@qingcongai.com
 * @Date         : 2023-11-02 18:04:44
 * @LastEditors  : huchaomin peter@qingcongai.com
 * @LastEditTime : 2024-01-06 10:30:54
 * @Description  :
 */
// 获取验证图片
export function reqGet(bodyData: any): Promise<any> {
  return new Promise(async (resolve) => {
    const { data } = await $api(
      {
        url: '/captcha/get',
        isWhiteApi: true,
        method: 'post',
      },
      bodyData,
    )
    if (data.value === null) return
    resolve(data.value)
  })
}

// 滑动或者点选验证
export function reqCheck(bodyData: any): Promise<any> {
  return new Promise(async (resolve) => {
    const { data, error } = await $api(
      {
        url: '/captcha/check',
        isWhiteApi: true,
        method: 'post',
        msgOnError: false,
      },
      bodyData,
    )
    resolve(data.value === null ? error.value : data.value)
  })
}
