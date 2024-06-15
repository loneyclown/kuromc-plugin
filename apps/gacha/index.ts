import { EventType, Plugin, Segment } from 'yunzai/core'
import fs from 'fs'
import util from '../../models/util'
import image from './image'
import { join } from 'path'
import _ from 'lodash'
import GaChaModel from '../../models/gacha'

export default class App extends Plugin {
  jsonPath = join(util.rootPath, 'data', 'kuromc', 'gacha', 'links.json')
  constructor() {
    super()
    this.rule = [
      {
        reg: util.getRuleReg(/(抽卡|唤取|hq)帮助/),
        fnc: this.gachaHelp.name
      },
      {
        reg: util.getRuleReg(/(绑定)?(抽卡|唤取|hq)链接(绑定)?/),
        fnc: this.gachaLinkBind.name
      },
      {
        reg: util.getRuleReg(
          /(抽卡|唤取|hq)(记录)?(\d+|(角色|武器|新手|感恩)(常驻|自选)?)?(?!帮助)/
        ),
        fnc: this.gacha.name
      },
      {
        reg: util.getRuleReg(/(抽卡|唤取|hq)(记录)?更新/),
        fnc: this.updateGacha.name
      }
    ]

    fs.mkdir(
      join(util.rootPath, 'data', 'kuromc', 'gacha'),
      { recursive: true },
      err => {
        if (err) {
          console.log('mkdir error', err)
          return
        }
      }
    )
  }

  async gachaHelp(e: EventType) {
    const UID = e.user_id
    const img = await image.createGachaHelp(UID)
    if (typeof img !== 'boolean') {
      e.reply(Segment.image(img))
    } else {
      e.reply('[抽卡帮助]图片加载失败...')
    }
    return true
  }

  async gachaLinkBind(e: EventType) {
    if (!e.isPrivate) {
      return e.reply('请私聊发送！')
    }
    e.reply('请发送完整的抽卡链接，抽卡链接获取请查看抽卡帮助~')
    this.setContext(this.vGachaBindLink.name)
    return true
  }

  async vGachaBindLink() {
    const url = this.e.msg.match(
      /https:\/\/aki-gm-resources\.aki-game\.com\/aki\/gacha\/index\.html#\/record(?:\?.*)?$/
    )?.[0]
    if (!url) {
      return this.e.reply('抽卡链接不正确！')
    }

    const { user_id } = this.e.sender
    const links = util.readJSON(this.jsonPath) || []
    const link = _.find(links, ['user_id', user_id])
    if (link) {
      link.url = url
    } else {
      links.push({ user_id, url })
    }
    util.writeJSON(this.jsonPath, links)
    this.e.reply('抽卡链接绑定成功！')
    return true
  }

  async gacha() {
    const { user_id } = this.e.sender
    const links = util.readJSON(this.jsonPath) || []
    const link = _.find(links, ['user_id', user_id])
    if (!link) {
      return this.e.reply(
        '请先绑定抽卡链接，直接艾特bot发送完整的抽卡链接即可！'
      )
    }
    const mcModel = new GaChaModel(link)
    const [, , , type] = this.e.msg.match(
      /mc(抽卡|唤取|hq)(记录)?(\d+|(角色|武器|新手|感恩)(常驻|自选)?)?(?!帮助)/
    )
    // const gachaData = await mcModel.gacha(type)
    // const img = await image.createGacha(user_id, {
    //   roleListData: gachaData.五星角色统计Arr
    // })
    // if (typeof img !== 'boolean') {
    //   this.e.reply(Segment.image(img))
    // } else {
    //   this.e.reply('[抽卡记录]图片加载失败...')
    // }
    return true
  }

  async updateGacha() {
    const { user_id } = this.e.sender
    const kmcModel = new GaChaModel(user_id)
    this.e.reply(`正在获取[UID: ${kmcModel.player_id}]的抽卡数据，请稍后...`)
    try {
      await kmcModel.updateGacha()
      this.e.reply(`获取[UID: ${kmcModel.player_id}]抽卡数据成功！`)
      return true
    } catch (error) {
      this.e.reply(`获取[UID: ${kmcModel.player_id}]抽卡数据失败！`)
      return true
    }
  }
}
