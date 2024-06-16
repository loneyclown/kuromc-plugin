import { makeForwardMsg, Plugin } from 'yunzai/core'
import lodash from 'lodash'
import fs from 'node:fs'
import { Restart } from '../../system/apps/restart.js'
import {} from 'yunzai/core'
import { sleep } from 'yunzai/utils'
import { exec, execSync } from 'child_process'
import { BOT_NAME } from 'yunzai/config'
import util from '../models/util.js'

let uping = false

export default class update extends Plugin {
  typeName = BOT_NAME
  messages = []
  isUp
  isNowUp
  oldCommitId

  constructor() {
    super()
    this.rule = [
      {
        reg: util.getRuleReg(/更新日志/),
        fnc: this.updateLog.name
      },
      {
        reg: util.getRuleReg(/(强制)?更新/),
        fnc: this.update.name
      }
    ]
  }

  async update() {
    if (!this.e.isMaster) return false
    if (uping) return this.reply('已有命令更新中..请勿重复操作')

    if (/详细|详情|面板|面版/.test(this.e.msg)) return false

    /** 获取插件 */
    let Plugin = this.getPlugin()
    if (Plugin === false) return false

    /** 执行更新 */
    if (Plugin === '') {
      await this.runUpdate('')
      await sleep(1000)
      Plugin = this.getPlugin(util.pluginName)
      await this.runUpdate(Plugin as any)
    } else {
      await this.runUpdate(Plugin)
    }

    /** 是否需要重启 */
    if (this.isUp) {
      // await this.reply('即将执行重启，以应用更新')
      setTimeout(() => this.restart(), 2000)
    }
  }

  getPlugin(Plugin = '') {
    if (!Plugin) {
      Plugin = this.e.msg.replace(util.getRuleReg(/(强制)?更新(日志)?/), '')
      if (!Plugin) return ''
    }

    if (!fs.existsSync(`Plugins/${Plugin}/.git`)) return false

    this.typeName = Plugin
    return Plugin
  }

  async execSync(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }

  async runUpdate(Plugin = '') {
    this.isNowUp = false

    let cm = 'git pull --no-rebase'

    let type = '更新'
    if (this.e.msg.includes('强制')) {
      type = '强制更新'
      cm = `git reset --hard && git pull --rebase --allow-unrelated-histories`
    }
    if (Plugin) cm = `cd "Plugins/${Plugin}" && ${cm}`

    this.oldCommitId = await this.getcommitId(Plugin)

    logger.mark(`${(this.e as any).logFnc} 开始${type}：${this.typeName}`)

    await this.reply(`开始${type} ${this.typeName}`)
    uping = true
    const ret = await this.execSync(cm)
    uping = false

    if ((ret as any).error) {
      logger.mark(`${(this.e as any).logFnc} 更新失败：${this.typeName}`)
      this.gitErr((ret as any).error, (ret as any).stdout)
      return false
    }

    const time = await this.getTime(Plugin)

    if (/Already up|已经是最新/g.test((ret as any).stdout)) {
      await this.reply(`${this.typeName} 已是最新\n最后更新时间：${time}`)
    } else {
      await this.reply(`${this.typeName} 更新成功\n更新时间：${time}`)
      this.isUp = true
      await this.reply(await this.getLog(Plugin))
    }

    logger.mark(`${(this.e as any).logFnc} 最后更新时间：${time}`)
    return true
  }

  async getcommitId(Plugin = '') {
    let cm = 'git rev-parse --short HEAD'
    if (Plugin) cm = `cd "Plugins/${Plugin}" && ${cm}`

    const commitId = await execSync(cm, { encoding: 'utf-8' })
    return lodash.trim(commitId)
  }

  async getTime(Plugin = '') {
    let cm = 'git log -1 --pretty=%cd --date=format:"%F %T"'
    if (Plugin) cm = `cd "Plugins/${Plugin}" && ${cm}`

    let time = ''
    try {
      time = await execSync(cm, { encoding: 'utf-8' })
      time = lodash.trim(time)
    } catch (error) {
      logger.error(error.toString())
      time = '获取时间失败'
    }

    return time
  }

  async gitErr(err, stdout) {
    const msg = '更新失败！'
    const errMsg = err.toString()
    stdout = stdout.toString()

    if (errMsg.includes('Timed out')) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      return this.reply(`${msg}\n连接超时：${remote}`)
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      return this.reply(`${msg}\n连接失败：${remote}`)
    }

    if (errMsg.includes('be overwritten by merge')) {
      return this.reply(
        `${msg}\n存在冲突：\n${errMsg}\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改`
      )
    }

    if (stdout.includes('CONFLICT')) {
      return this.reply(
        `${msg}\n存在冲突：\n${errMsg}${stdout}\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改`
      )
    }

    return this.reply([errMsg, stdout])
  }

  restart() {
    new Restart().restart()
  }

  async getLog(Plugin: any = ''): Promise<any> {
    let cm = 'git log -100 --pretty="%h||[%cd] %s" --date=format:"%F %T"'
    if (Plugin) cm = `cd "Plugins/${Plugin}" && ${cm}`

    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8' })
    } catch (error) {
      logger.error(error.toString())
      await this.reply(error.toString())
    }

    if (!logAll) return false

    logAll = logAll.trim().split('\n')

    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    let line = log.length
    log = log.join('\n\n') as any

    if (log.length <= 0) return ''

    let end = ''
    try {
      cm = 'git config -l'
      if (Plugin) cm = `cd "Plugins/${Plugin}" && ${cm}`
      end = await execSync(cm, { encoding: 'utf-8' })
      end = end
        .match(/remote\..*\.url=.+/g)
        .join('\n\n')
        .replace(/remote\..*\.url=/g, '')
        .replace(/\/\/([^@]+)@/, '//')
    } catch (error) {
      logger.error(error.toString())
      await this.reply(error.toString())
    }

    return makeForwardMsg(
      this.e,
      [log, end],
      `${Plugin || util.pluginName} 更新日志，共${line}条`
    )
  }

  async updateLog() {
    const Plugin: any = this.getPlugin()
    if (Plugin === false) return false
    return this.reply(await this.getLog(Plugin))
  }
}
