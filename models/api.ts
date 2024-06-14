import qs from 'qs'
import axios, { type AxiosInstance } from 'axios'

class McKuroApi {
  private baseUrl = 'https://gmserver-api.aki-game2.com'
  private axios: AxiosInstance
  private player_id: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  private lang: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  private record_id: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  private resources_id: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  private svr_id: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  private apis = {
    gacha: '/gacha/record/query'
  }

/**
 * 初始化Axios实例和从URL中解析参数。
 * 
 * @param {string} url - 包含参数的URL字符串。
 */
constructor(url: string) {
  // 使用querystring库解析URL中的参数部分
  const params = qs.parse(url.split('?')[1])
  // 从解析的参数中解构出所需字段
  const { player_id, lang, record_id, resources_id, svr_id } = params

  // 将解析出的参数赋值给类的属性
  this.player_id = player_id
  this.lang = lang
  this.record_id = record_id
  this.resources_id = resources_id
  this.svr_id = svr_id

  // 初始化Axios实例，设置基础URL为类的baseUrl属性
  this.axios = axios.create({
    baseURL: this.baseUrl
  })
}

/**
 * 异步函数：进行抽卡操作。
 * @param cardPoolType 抽卡池的类型，默认为1。此参数决定了从哪个卡牌池进行抽取。
 * @returns 返回抽卡结果。如果抽卡成功，返回具体的卡牌信息；如果失败，则返回错误信息。
 */
async gacha(cardPoolType: any = 1) {
  // 构建抽卡请求的数据对象，包含玩家信息和抽卡池信息。
  const data = {
    playerId: this.player_id,
    cardPoolId: this.resources_id,
    cardPoolType,
    serverId: this.svr_id,
    languageCode: this.lang,
    recordId: this.record_id
  }

  try {
    // 发送POST请求到指定的API进行抽卡操作。
    const res = await this.axios.post(this.apis.gacha, data)
    // 如果响应代码为0，表示抽卡成功，返回具体的卡牌数据。
    if (res?.data?.code === 0) {
      return res?.data?.data
    } else {
      // 如果响应代码非0，表示抽卡失败，返回错误信息。
      return Promise.reject(res?.data?.message || '未知错误')
    }
  } catch (error) {
    // 如果请求过程中发生异常，返回该异常。
    return Promise.reject(error)
  }
}
}

export default McKuroApi
