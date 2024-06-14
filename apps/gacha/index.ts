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
      // {
      //   reg: util.getRuleReg(/(绑定)?(抽卡|唤取|hq)链接(绑定)?/),
      //   fnc: this.gachaLinkBind.name
      // },
      {
        reg: util.getRuleReg(/https:\/\/aki-gm-resources\.aki-game\.com\/aki\/gacha\/index\.html#\/record(?:\?.*)?$/),
        fnc: this.gachaBindLink.name
      },
      {
        reg: util.getRuleReg(/mc(抽卡|唤取|hq)(记录)?(\d+|(角色|武器|新手|感恩)(常驻|自选)?)?(?!帮助)/),
        fnc: this.gacha.name
      }
    ]
    // this.jsonPath = join(util.rootPath, 'data', 'kuromc', 'gacha', 'links.json')

    fs.mkdir(join(util.rootPath, 'data', 'kuromc', 'gacha'), { recursive: true }, err => {
      if (err) {
        console.log('mkdir error', err)
        return
      }
    })
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

  // async gachaLinkBind(e: EventType) {
  //   if (!e.isPrivate) {
  //     return e.reply('请私聊发送！')
  //   }
  //   e.reply('请发送完整的抽卡链接，抽卡链接获取请查看抽卡帮助~')
  //   this.setContext(this.vBindLink.name)
  //   return true
  // }

  async gachaBindLink() {
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
      return this.e.reply('请先绑定抽卡链接，直接艾特bot发送完整的抽卡链接即可！')
    }
    const mcModel = new GaChaModel(link)
    const [, , , type] = this.e.msg.match(
      /mc(抽卡|唤取|hq)(记录)?(\d+|(角色|武器|新手|感恩)(常驻|自选)?)?(?!帮助)/
    )
    const gachaData = await mcModel.gacha(type)
     this.e.reply([
      `当前卡池累计已抽取${gachaData.length}次\n`,
      ..._.map(
        gachaData,
        x => `【★★★★★】[${x.count}抽] >>> ${x.name || '???'}\n`
      )
    ])
  }
}