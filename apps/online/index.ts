import { Plugin, Segment } from 'yunzai/core'
import util from '../../models/util'
import OnlineImage from './image'

export default class App extends Plugin {
  constructor() {
    super()
    this.rule = [
      { reg: util.getRuleReg(/版本活动/), fnc: this.versionActivity.name },
      { reg: util.getRuleReg(/当期(UP|up)/), fnc: this.currUp.name }
    ]
  }

  async versionActivity() {
    const onLineImg = new OnlineImage('https://wiki.kurobbs.com/mc/home')
    const img = await onLineImg.createHomeEleImg('.hot-content-side')
    if (typeof img !== 'boolean') {
      this.e.reply(Segment.image(img))
    } else {
      this.e.reply('[版本活动]图片加载失败...')
    }
    return true
  }

  async currUp() {
    const onLineImg = new OnlineImage('https://wiki.kurobbs.com/mc/home')
    const img = await onLineImg.createHomeEleImg('.home-module.events-side')
    if (typeof img !== 'boolean') {
      this.e.reply(Segment.image(img))
    } else {
      this.e.reply('[版本活动]图片加载失败...')
    }
    return true
  }
}
