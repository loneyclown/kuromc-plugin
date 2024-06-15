import fs from 'fs'
import { join } from 'path'

export default new class Util {
  pluginName = 'kuromc-plugin'
  pluginHtmlCssRoot = `../../plugins/${this.pluginName}/public`
  rootPath = process.cwd().replace(/\\/g, '/')
  pluginRootPath = `${this.rootPath}/plugins/${this.pluginName}`

  getRuleReg(reg: RegExp, prefix: string = 'kmc') {
    // 获取原正则表达式的字符串表示形式和标志
  let source = reg.source
  const flags = reg.flags

  // 如果正则表达式以 ^ 开头，则去掉它，以便在新正则表达式中重新插入
  if (source.startsWith('^')) {
    source = source.substring(1)
  }

  // 如果正则表达式以 $ 结尾，则去掉它，以便在新正则表达式中重新插入
  if (source.endsWith('$')) {
    source = source.substring(0, source.length - 1)
  }

  // 构建新的正则表达式，重新插入 ^ 和 $ 以确保其语义
  return new RegExp(`^(${prefix})?${source}$`, flags)
  }

  /**
   * 读取JSON数据
   * @param filePath
   * @returns
   */
  readJSON(filePath: string): any {
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      // console.error('读取JSON文件失败:', error)
      return null
    }
  }

    /**
   * 写入JSON数据
   * @param filePath
   * @param jsonData
   */
    writeJSON(filePath: string, jsonData: any): void {
      try {
        const data = JSON.stringify(jsonData, null, 2)
        fs.writeFileSync(filePath, data)
        console.log('写入JSON文件成功')
      } catch (error) {
        console.error('写入JSON文件失败:', error)
      }
    }

  get version() {
    const pkg = this.readJSON(join(this.pluginRootPath, 'package.json'))
    return pkg.version
  }

  isNumber(value: string | number) {
    if (typeof value === 'number') {
      return true
    }
    if (typeof value === 'string') {
      return !isNaN(Number(value)) && value.trim() !== ''
    }
    return false
  }
}()