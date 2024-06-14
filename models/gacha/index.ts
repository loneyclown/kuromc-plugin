import _ from "lodash"
import McKuroApi from "../api"
import util from "../util"

export default class GaChaModel {
  #mcApi
  constructor(link) {
    this.#mcApi = new McKuroApi(link.url)
  }

  async gacha(type: string) {
    const gacheType = util.isNumber(type) ? type : this.getGachaType(type)
    const gachaData = await this.#mcApi.gacha(gacheType)
    let currId = _.uniqueId()
    const 五星角色统计Map = _.reduce(
      _.reverse(gachaData),
      (prev, curr) => {
        const { name, resourceType } = curr
        const obj = prev.get(currId)
        if (curr.qualityLevel === 5) {
          if (obj) {
            obj.count++
            obj.name = name
            obj.resourceType = curr.resourceType
            currId = _.uniqueId()
          } else {
            prev.set(currId, { count: 1, name, resourceType })
            currId = _.uniqueId()
          }
        } else {
          if (obj) {
            obj.count++
          } else {
            prev.set(currId, { count: 1 })
          }
        }
        return prev
      },
      new Map()
    )
    const 五星角色统计Arr = _.map(Array.from(五星角色统计Map), x => {
      const [k, v] = x
      return v
    })
    return 五星角色统计Arr
  }

  getGachaType(str) {
    switch (str) {
      case '角色':
        return 1
      case '武器':
        return 2
      case '角色常驻':
        return 3
      case '武器常驻':
        return 4
      case '新手':
        return 5
      case '自选':
        return 6
      case '感恩':
      case '感恩自选':
        return 7
      default:
        return 1
    }
  }
}