import _ from 'lodash'
import { Bot } from 'yunzai/core'
import McKuroApi, {
  CARD_POOL_TYPE,
  T_GaChaResData,
  T_ResourceType
} from '../api'
import util from '../util'
import role from '../data/role'
import { join } from 'path'
import MyMap from '../myMap'
import moment from 'moment'

export type T_CardPoolType = 'UP' | '常驻'

export type T_GachaLink = {
  user_id: string
  url: string
}

export type T_GaChaJson = {}

export type T_GaChaData = {
  cardPoolTypeId: CARD_POOL_TYPE
  count: number
  name: string
  resourceType: T_ResourceType
  src: T_GaChaResData
}

export default class GaChaModel {
  #mcApi: McKuroApi
  #jsonPath: string = join(
    util.rootPath,
    'data',
    'kuromc',
    'gacha',
    'links.json'
  )
  link: T_GachaLink
  #user_id: string
  player_id: string
  constructor(user_id) {
    const links = util.readJSON(this.#jsonPath) || []
    this.link = _.find(links, ['user_id', user_id]) || {}
    this.#user_id = user_id
    this.#mcApi = new McKuroApi(this.link.url)
    this.player_id = this.#mcApi.player_id as string
  }

  // async gacha(type: string) {
  //   const gacheType = util.isNumber(type) ? type : this.getGachaType(type)
  //   const gachaData = await this.#mcApi.gacha(gacheType)
  //   let currId = _.uniqueId()
  //   const 五星角色统计Map = _.reduce(
  //     _.reverse(gachaData),
  //     (prev, curr) => {
  //       const { name, resourceType } = curr
  //       const obj = prev.get(currId)
  //       if (curr.qualityLevel === 5) {
  //         if (obj) {
  //           obj.count++
  //           obj.name = name
  //           obj.resourceType = curr.resourceType
  //           obj.props = curr
  //           obj.role = _.find(role, ['名字', name])
  //           currId = _.uniqueId()
  //         } else {
  //           prev.set(currId, { count: 1, name, resourceType })
  //           currId = _.uniqueId()
  //         }
  //       } else {
  //         if (obj) {
  //           obj.count++
  //         } else {
  //           prev.set(currId, { count: 1 })
  //         }
  //       }
  //       return prev
  //     },
  //     new Map()
  //   )
  //   const 五星角色统计Arr = _.map(Array.from(五星角色统计Map), x => {
  //     const [k, v] = x
  //     return v
  //   })
  //   return { 五星角色统计Arr, 总次数: gachaData.length }
  // }

  async updateGacha() {
    try {
      const results = await Promise.allSettled([
        this.#mcApi.gacha(CARD_POOL_TYPE.角色精准调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.武器精准调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.角色调谐_常驻),
        this.#mcApi.gacha(CARD_POOL_TYPE.武器调谐_常驻),
        this.#mcApi.gacha(CARD_POOL_TYPE.新手调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.新手自选),
        this.#mcApi.gacha(CARD_POOL_TYPE.感恩自选)
      ])

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value !== undefined && _.isArray(result.value)) {
            this.countGacha(result.value, index + 1)
          } else {
            Bot.logger.warn('This fulfilled promise did not return a value.')
          }
        } else {
          Bot.logger.error('Promise rejected:', result.reason)
        }
      })

      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  /**
   * 统计扭蛋结果数据中四星和五星物品的数量。
   * @param listData 扭蛋结果数据数组。
   * @param typeId 卡池类型ID，用于区分不同的扭蛋池。
   */
  countGacha(listData: T_GaChaResData[], typeId: CARD_POOL_TYPE) {
    // 初始化四星和五星物品的唯一ID，用于在Map中作为键。
    let fourStarPointerId = _.uniqueId()
    let fiveStarPointerId = _.uniqueId()

    // 使用Lodash的reduce函数来聚合数据，构建一个Map，其中键是唯一ID，值是扭蛋物品统计信息。
    const dataMap = _.reduce(
      listData,
      (prev, curr: T_GaChaResData) => {
        // 解构当前扭蛋物品的信息。
        const { name, resourceType, qualityLevel } = curr
        // 获取当前四星物品在Map中的对象。
        const fourStarObj = prev.get(fourStarPointerId)
        // 获取当前五星物品在Map中的对象。
        const fiveStarObj = prev.get(fiveStarPointerId)

        // 如果当前物品是四星，则增加其计数。
        // 统计4星
        if (qualityLevel === 4) {
          if (fourStarObj) {
            fourStarObj.count++
          } else {
            // 如果Map中还没有当前四星物品的记录，则创建一个新的记录。
            prev.set(fourStarPointerId, {
              count: 1,
              name,
              cardPoolTypeId: typeId,
              src: curr,
              resourceType
            })
            // 生成一个新的唯一ID，用于下一个四星物品。
            fourStarPointerId = _.uniqueId()
          }
        }
        // 如果当前物品是五星，则增加其计数。
        // 统计5星
        if (qualityLevel === 5) {
          if (fiveStarObj) {
            fiveStarObj.count++
          } else {
            // 如果Map中还没有当前五星物品的记录，则创建一个新的记录。
            prev.set(fiveStarPointerId, {
              count: 1,
              name,
              cardPoolTypeId: typeId,
              src: curr,
              resourceType
            })
            // 生成一个新的唯一ID，用于下一个五星物品。
            fiveStarPointerId = _.uniqueId()
          }
        }

        // 返回更新后的Map。
        return prev
      },
      new Map<string, T_GaChaData>()
    )

    // 打印统计结果。
    console.log('dataMap', dataMap)
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

  readGachaJson(user_id) {
    return util.readJSON(
      join(util.rootPath, 'data', 'kuromc', 'gacha', user_id, `gacha.json`)
    )
  }

  // getUniqueId(obj) {
  //   return `${obj.resourceId}_${moment(obj.time).}`
  // }
}
