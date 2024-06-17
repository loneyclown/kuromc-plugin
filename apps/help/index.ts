import { Plugin, Segment } from 'yunzai/core'
import util from '../../models/util'
import image from '../../models/image'

export default class App extends Plugin {
  constructor() {
    super()
    this.rule = [
      { reg: util.getRuleReg(/(帮助|help)/), fnc: this.pluginHelp.name }
    ]
  }

  async pluginHelp() {
    const { user_id } = this.e.sender
    const img = await image.createPage(user_id, 'help/index')
    if (typeof img !== 'boolean') {
      this.e.reply(Segment.image(img))
    } else {
      this.e.reply('[kmc帮助]图片加载失败...')
    }
    return true
  }
}
