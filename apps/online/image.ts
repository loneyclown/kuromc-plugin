import { Puppeteer } from 'yunzai/utils'

export default class OnlineImage {
  Pup: typeof Puppeteer.prototype = null
  url: string

  constructor(url) {
    this.Pup = new Puppeteer()
    this.Pup.start()
    this.url = url
  }

  async createHomeEleImg(selector) {
    if (!(await this.Pup.isStart())) return false

    try {
      const page = await this.Pup.browser?.newPage().catch(err => {
        console.error(err)
      })

      if (!page) return false

      // 设置视口宽度为1200，高度暂时不设置，稍后根据元素动态调整
      await page.setViewport({ width: 430, height: 800 })

      await page.goto(this.url, {
        timeout: 120000,
        waitUntil: 'networkidle2'
      })

      // 确保页面和元素加载完全
      await page.waitForFunction(
        sel => {
          const element = document.querySelector(sel)
          return (
            element && typeof (element as HTMLElement).offsetWidth === 'number'
          )
        },
        {},
        selector
      )

      await new Promise(resolve => setTimeout(resolve, 500))

      const elementHandle = await page.$(selector)
      if (!elementHandle) return false

      await new Promise(resolve => setTimeout(resolve, 1000))

      await page.evaluate(element => {
        const topbarEle = document.querySelector(
          '.topbar-layout'
        ) as HTMLElement
        if (topbarEle) topbarEle.style.display = 'none'

        element.scrollIntoView({
          behavior: 'instant',
          block: 'start',
          inline: 'nearest'
        })
      }, elementHandle)

      await page.evaluate(() => {
        const backTopEle = document.querySelector(
          '.ant-back-top'
        ) as HTMLElement
        if (backTopEle) backTopEle.style.display = 'none'
      }, elementHandle)

      const boundingRect = await page.evaluate(element => {
        const rect = element.getBoundingClientRect()
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      }, elementHandle)

      // 设置视口高度，确保高度足够覆盖内容
      await page.setViewport({
        width: 430,
        height: Math.trunc(boundingRect.height + 0)
      })

      // 根据计算好的边界信息截图
      const buff = await page
        .screenshot({
          type: 'png'
          // clip
        })
        .catch(err => {
          console.error('[puppeteer]', 'screenshot with clip', err)
          return false
        })

      await page.close().catch(err => {
        console.error('[puppeteer]', 'page close', err)
      })

      if (!buff) {
        console.error('[puppeteer]', selector)
        return false
      }
      return buff
    } catch (error) {
      console.error('[puppeteer] newPage', error)
      return false
    }
  }
}
