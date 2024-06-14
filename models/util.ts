export default new class Util {

  pluginName = 'kuromc-plugin'
  // pluginRoot = `./plugins/${this.pluginName}/`
  pluginHtmlCssRoot = `../../plugins/${this.pluginName}/public`

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
}()