import { Events } from 'yunzai/core'
import * as rules from './apps'
// import demo from './demo'

const event = new Events()

Bot.logger.info(`🙏🏻 佛祖保佑，永无bug 🙏🏻`)
Bot.logger.info(`🛡️ 鸣潮插件开始初始化`)

let conut = 0
for (const key in rules) {
  const app = rules[key]
  if (app.ok) {
    event.use(app.ok)
  } else {
    event.use(app)
  }
  conut++
}

// event.use(demo)

Bot.logger.info(`🛡️ 鸣潮插件加载完成，共计加载${conut}个app`)
Bot.logger.info(`🙏🏻 愿此代码洁净如莲，佛祖保佑，永无bug 🙏🏻`)

export const apps = event.ok