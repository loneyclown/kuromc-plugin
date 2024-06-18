import _ from 'lodash'
import moment from 'moment'
import fs from 'fs'
import { Bot } from 'yunzai/core'
import McKuroApi, {
  CARD_POOL_TYPE,
  type T_GaChaResData,
  type T_ResourceType
} from '../api'
import util from '../util'

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
  resourceId: number
  src: T_GaChaResData
}

export type T_GaCheViewData = {
  data: T_GaChaData[]
  lastNum: number
  totalNum: number
  countStartTime: string
  countEndTime: string
}

export default class GaChaModel {
  #mcApi: McKuroApi
  #jsonDataRootPath: string = `${util.rootPath}/data/kuromc/gacha`
  #jsonLinkPath: string = `${this.#jsonDataRootPath}/links.json`
  #jsonUserGachaPath: string
  link: T_GachaLink
  #user_id: number
  player_id: string
  constructor(user_id: number) {
    const links = util.readJSON(this.#jsonLinkPath) || []
    this.link = _.find(links, ['user_id', user_id])
    this.#user_id = user_id
    this.#jsonUserGachaPath = `${this.#jsonDataRootPath}/${this.#user_id}`
    if (this.link?.url) {
      this.#mcApi = new McKuroApi(this.link.url)
      this.player_id = this.#mcApi.player_id as string
    }
    this.mkdir(this.#jsonDataRootPath)
    this.mkdir(this.#jsonUserGachaPath)
  }

  getGachaData(type: T_CardPoolType = 'UP', isItFourStarCount = false) {
    const roleGachaType =
      type === 'UP' ? CARD_POOL_TYPE.角色精准调谐 : CARD_POOL_TYPE.角色常驻调谐
    const weaponGachaType =
      type === 'UP' ? CARD_POOL_TYPE.武器精准调谐 : CARD_POOL_TYPE.武器常驻调谐
    const roleGachaData: T_GaChaResData[] =
      this.readGachaJSON(`${roleGachaType}`) || []
    const weaponGachaData: T_GaChaResData[] =
      this.readGachaJSON(`${weaponGachaType}`) || []

    const roleCount = this.countGacha(
      roleGachaData,
      roleGachaType,
      isItFourStarCount
    )
    const weaponCount = this.countGacha(
      weaponGachaData,
      weaponGachaType,
      isItFourStarCount
    )
    return {
      role: {
        ...roleCount,
        totalNum: roleGachaData.length,
        ...this.getCountTime(roleGachaData)
      },
      weapon: {
        ...weaponCount,
        totalNum: weaponGachaData.length,
        ...this.getCountTime(weaponGachaData)
      }
    }
  }

  async updateGacha() {
    try {
      const results = await Promise.allSettled([
        this.#mcApi.gacha(CARD_POOL_TYPE.角色精准调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.武器精准调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.角色常驻调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.武器常驻调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.新手调谐),
        this.#mcApi.gacha(CARD_POOL_TYPE.新手自选),
        this.#mcApi.gacha(CARD_POOL_TYPE.感恩自选)
      ])

      let updateNum = 0
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value !== undefined && _.isArray(result.value)) {
            updateNum += this.updateGachaJson(result.value, index + 1)
          } else {
            Bot.logger.warn('This fulfilled promise did not return a value.')
          }
        } else {
          Bot.logger.error('Promise rejected:', result.reason)
        }
      })

      return Promise.resolve({ updateNum })
    } catch (error) {
      return Promise.reject()
    }
  }

  /**
   * 统计扭蛋结果数据中四星和五星物品的数量。
   * @param listData 扭蛋结果数据数组。
   * @param typeId 卡池类型ID，用于区分不同的扭蛋池。
   */
  countGacha(
    listData: T_GaChaResData[],
    typeId: CARD_POOL_TYPE,
    isItFourStarCount = false
  ) {
    let numOf4Star = 0
    let numOf5star = 0
    let lastNum = 0
    const dataArr = _.reduce(
      listData,
      (prev, curr: T_GaChaResData) => {
        // 解构当前扭蛋物品的信息。
        const { name, resourceType, qualityLevel, resourceId } = curr

        const newObj: T_GaChaData = {
          name,
          cardPoolTypeId: typeId,
          src: curr,
          resourceType,
          resourceId,
          count: 1
        }

        lastNum++

        if (isItFourStarCount && qualityLevel === 4) {
          prev.push({ ...newObj, count: numOf4Star + 1 })
          numOf4Star = 0
        } else {
          numOf4Star++
        }

        if (qualityLevel === 5) {
          prev.push({ ...newObj, count: numOf5star + 1 })
          numOf5star = 0
          // 出了5星，4星统计也重置
          numOf4Star = 0
          lastNum = 0
        } else {
          numOf5star++
        }
        return prev
      },
      [] as T_GaChaData[]
    )

    return { data: _.reverse(dataArr), lastNum }
  }

  /**
   * 更新扭蛋资源JSON文件。
   *
   * 该方法用于将新的扭蛋资源数据合并到现有的扭蛋资源JSON文件中。它只会添加更新时间晚于现有最早更新时间的资源。
   * 这样可以确保只添加新的资源，而不会覆盖或重复现有的资源。
   *
   * @param newData 新的扭蛋资源数据数组。
   * @param type 扭蛋资源的类型，用于确定具体的扭蛋资源文件名。
   * @returns 返回成功添加到文件中的资源数量。
   */
  updateGachaJson(newData: T_GaChaResData[], type: CARD_POOL_TYPE) {
    // 初始化更新数量计数器
    let updateNum = 0
    // 根据扭蛋资源类型生成文件名
    const fileName = `${type}`
    // 读取现有的扭蛋资源数据数组，如果文件不存在则返回空数组
    const oldData: T_GaChaResData[] = this.readGachaJSON(fileName) || []
    // 获取现有数据中最早的更新时间，如果没有数据则默认为2024年1月1日
    const latestTime = oldData[oldData.length - 1]?.time || '2024-01-01'
    // 遍历新数据数组的逆序，以便从最新的资源开始检查
    for (let item of _.reverse(newData)) {
      // 如果当前资源的更新时间晚于最早更新时间，则将其添加到现有数据数组中，并增加更新数量计数
      if (moment(item.time).isAfter(moment(latestTime))) {
        oldData.push(item)
        updateNum++
      } else {
        // 如果当前资源的更新时间不晚于最早更新时间，则停止遍历，因为后续资源必定更早
        break
      }
    }
    // 将更新后的扭蛋资源数据数组写入到对应的JSON文件中
    this.writeGachaJSON(fileName, oldData)
    // 返回成功添加到文件中的资源数量
    return updateNum
  }

  readGachaJSON(fileName: string) {
    return util.readJSON(`${this.#jsonUserGachaPath}/${fileName}.json`)
  }

  writeGachaJSON(fileName: string, data: T_GaChaResData[]) {
    return util.writeJSON(`${this.#jsonUserGachaPath}/${fileName}.json`, data)
  }

  mkdir(path: string) {
    fs.mkdir(path, { recursive: true }, err => {
      if (err) {
        Bot.logger.error('mkdir error', err)
      }
    })
  }

  getCountTime(gachaData: T_GaChaResData[]) {
    if (gachaData.length > 0) {
      const startTime = gachaData[0]?.time || ''
      const endTime = gachaData[gachaData.length - 1]?.time || ''
      if (startTime && endTime) {
        return {
          countStartTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
          countEndTime: moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
    return { countStartTime: '', countEndTime: '' }
  }
}
