/* eslint-disable space-before-function-paren */
import lodash from 'lodash'
import config from './models/config/index.js'

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'kuromc-plugin',
      title: '鸣潮插件',
      description: '鸣潮游戏相关信息查询。',
      author: ['@loneyclown'],
      authorLink: ['https://github.com/loneyclown'],
      // 仓库地址
      link: 'https://github.com/loneyclown/kuromc-plugin',
      isV4: true,
      isV3: false,
      isV2: false,
      showInMenu: 'auto',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'face-id-solid',
      iconColor: '#f2d57c'
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      // iconPath: path.join(_paths.pluginRoot, 'resources/images/icon.png'),
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        // {
        //   field: 'base.checkUpdate',
        //   label: '检查更新',
        //   helpMessage: '启动时和每天凌晨4点自动检查更新，并发送消息提醒（每个版本只提醒一次）',
        //   bottomHelpMessage: '是否自动检查更新，并发送消息提醒',
        //   component: 'Switch',
        // },
        {
          field: 'gacha.isItFourStarCount',
          label: '是否统计四星',
          component: 'Switch'
        }
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData() {
        return config.baseConfig
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData(data, { Result }) {
        const cfg = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(cfg, keyPath, value)
        }
        config.setBaseConfig(cfg)
        return Result.ok({}, '保存成功~')
      }
    }
  }
}
