import { EventType, Plugin, Segment } from 'yunzai/core'
import util from '../../models/util'
import { join } from 'path'
import _ from 'lodash'
import GaChaModel from '../../models/gacha'
import image from '../../models/image'
import { GaChaAppProps } from '../../views/gacha'

export default class App extends Plugin {
  jsonPath = join(util.rootPath, 'data', 'kuromc', 'gacha', 'links.json')
  constructor() {
    super()
    this.rule = [
      { reg: util.getRuleReg(/(抽卡|唤取|hq)帮助/), fnc: this.gachaHelp.name },
      {
        reg: util.getRuleReg(/(绑定)?(抽卡|唤取|hq)链接(绑定)?/),
        fnc: this.gachaLinkBind.name
      },
      {
        reg: util.getRuleReg(/获取(抽卡|唤取|hq)链接/),
        fnc: this.getGachaLink.name
      },
      {
        reg: util.getRuleReg(/(抽卡|唤取|hq)(记录)?(up|UP|常驻|)?(?!帮助)/),
        fnc: this.gacha.name
      },
      {
        reg: util.getRuleReg(
          /((抽卡|唤取|hq)(记录)?更新)|(更新(抽卡|唤取|hq)(记录)?)/
        ),
        fnc: this.updateGacha.name
      }
    ]
  }

  async gachaHelp(e: EventType) {
    const { user_id } = this.e.sender
    const img = await image.createPage(user_id, 'gacha/gachaHelp')
    if (typeof img !== 'boolean') {
      e.reply(Segment.image(img))
    } else {
      e.reply('[抽卡帮助]图片加载失败...')
    }
    return true
  }

  async gachaLinkBind(e: EventType) {
    if (!e.isPrivate) {
      e.reply('请私聊发送！')
      return true
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
      this.e.reply('抽卡链接不正确！')
      return true
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
    this.finish(this.vGachaBindLink.name)
    const kmcModel = new GaChaModel(user_id)
    return await this.updateGachaFunc(kmcModel);
  }

  async getGachaLink() {
    const { user_id } = this.e.sender
    const { link } = new GaChaModel(user_id)
    if (link) {
      this.e.reply(link.url)
    } else {
      this.e.reply('你还未绑定抽卡链接！绑定方法请查看抽卡帮助！')
    }
    return true
  }

  async gacha() {
    const { user_id } = this.e.sender
    const { link } = new GaChaModel(user_id)
    if (!link) {
      this.e.reply('请先绑定抽卡链接，绑定方法请查看抽卡帮助！')
      return true
    }
    const type = this.e.msg.includes('常驻') ? '常驻' : 'UP'
    const gcm = new GaChaModel(user_id)
    const gachaData = gcm.getGachaData(type)
    const img = await image.createPage<GaChaAppProps>(user_id, 'gacha/index', {
      roleData: gachaData.role,
      weaponData: gachaData.weapon,
      type
    })
    if (typeof img !== 'boolean') {
      this.e.reply(Segment.image(img))
    } else {
      this.e.reply('[抽卡记录]图片加载失败...')
    }
    return true
  }

  async updateGacha() {
    const { user_id } = this.e.sender
    const kmcModel = new GaChaModel(user_id)
    if (!kmcModel.link) {
      this.e.reply('请先绑定抽卡链接，绑定方法请查看抽卡帮助！')
      return true
    }
    return await this.updateGachaFunc(kmcModel);
  }

  async updateGachaFunc(kmcModel: GaChaModel) {
    this.e.reply(`正在获取[UID: ${kmcModel.player_id}]的抽卡数据，请稍后...`)
    try {
      const { updateNum } = await kmcModel.updateGacha()
      const img = await image.createPage(kmcModel.user_id, 'gacha/gachaHelp')
      const replys: any[] = [
        `获取[UID: ${kmcModel.player_id}]抽卡数据成功！本次更新了${updateNum}条记录`
      ]
      if (typeof img !== 'boolean') {
        replys.push(Segment.image(img))
      }
      this.e.reply(replys)
      return Promise.resolve(true);
    } catch (error) {
      this.e.reply(`获取[UID: ${kmcModel.player_id}]抽卡数据失败！请稍后重试`)
      return Promise.resolve(true);
    }
  }
}
