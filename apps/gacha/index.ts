import { EventType, Plugin, Segment } from 'yunzai/core'
import util from '../../models/util'
import image from './image'
export default class App extends Plugin {
  constructor () {
    super({
      // 可省略，默认9999
      // priority: 700,
    })
    this.rule = [
        {
          reg: util.getRuleReg(/(抽卡|唤取|hq)帮助/),
          fnc: this.gacheHelp.name
        },
      ]
  }
  async gacheHelp (e: EventType) {
    const UID = e.user_id
    const img = await image.createGachaHelp(UID)
    if (typeof img !== 'boolean') {
      e.reply(Segment.image(img))
    } else {
      e.reply('[抽卡帮助]图片加载失败...')
    }
    return true
  }
}