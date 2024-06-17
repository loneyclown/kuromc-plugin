import React from 'react'
import {
  Component,
  ComponentCreateOpsionType,
  Puppeteer,
  createDynamic
} from 'yunzai/utils'
import { createRequire } from 'module'

const requireDynamic = createDynamic(import.meta.url)
const require = createRequire(import.meta.url)

// 初始化 组件渲染对象
const com = new Component()

export class Image {
  Pup: typeof Puppeteer.prototype = null
  /**
   * 初始化运行Puppeteer
   */
  constructor() {
    // init
    this.Pup = new Puppeteer()
    // start
    this.Pup.start()
  }

  #HtmlHead = [
    `<link rel="stylesheet" href=${require('../public/kuromc.css')}></link>`
  ].join('\n')

  async createPage<T = any>(
    uid: number,
    page: string,
    props: T = {} as T,
    ComponentCreateOpsion?: ComponentCreateOpsionType
  ) {
    const Page = (await requireDynamic(`../views/${page}`)).default
    return this.Pup.render(
      com.create(<Page {...props} />, {
        join_dir: page,
        html_name: `${uid}.html`,
        html_head: this.#HtmlHead,
        ...ComponentCreateOpsion
      })
    )
  }
}
// 初始化 图片生成对象
export default new Image()
