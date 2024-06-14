import React from 'react'
import { Component, Puppeteer } from 'yunzai/utils'
import GachaHelp from './components/gachaHelp'
import util from '../../models/util'

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
  #HtmlHead = [`<link rel="stylesheet" href="../../public/output.css"></link>`, `<link rel="stylesheet" href=${util.pluginHtmlCssRoot}/gacha.css></link>`].join('\n')
  
  createGachaHelp(uid) {
    return this.Pup.render(Com.create(<GachaHelp />, {
      join_dir: 'gacha_help',
      html_name: `${uid}.html`,
      html_head: this.#HtmlHead,
    }))
  }
}
// 初始化 图片生成对象
export default new Image()