import React from 'react'
import { Component, Puppeteer, createRequire } from 'yunzai/utils'
import GachaHelp from './components/gachaHelp'
import Gacha, { type GaChaAppProps } from './components/gacha'
const require = createRequire(import.meta.url)

// 初始化 组件渲染对象
const Com = new Component()

export class Image {
  Pup:typeof Puppeteer.prototype = null 
  /**
  * 初始化运行Puppeteer
  */
  constructor() {
    // init
    this.Pup = new Puppeteer()
    // start
    this.Pup.start()
  }

  /**
  * 注意，不设置json_dir时，
  * html_head路径应该是../public/output.css
  * 且html_head默认值路径也是../public/output.css
  * 因此，不增加其他head的话，html_head和join_dir都可以省略
  */
  #HtmlHead = [`<link rel="stylesheet" href=${require('../../public/kuromc.css')}></link>`].join('\n')
  
  createGachaHelp(uid) {
    return this.Pup.render(Com.create(<GachaHelp />, {
      join_dir: 'gacha_help',
      html_name: `${uid}.html`,
      html_head: this.#HtmlHead,
    }))
  }

  createGacha(uid, props: GaChaAppProps) {
    return this.Pup.render(Com.create(<Gacha {...props} />, {
      join_dir: 'gacha',
      html_name: `${uid}.html`,
      html_head: this.#HtmlHead,
    }))
  }
}
// 初始化 图片生成对象
export default new Image()