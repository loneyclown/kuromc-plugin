import React from 'react'
import Page from '../../layout/page'

export type PropsType = {}

export default function App() {
  return (
    <>
      <Page>
        <h2 className="text-4xl font-bold tracking-tight text-center pt-8 kuromc-text-title">
          鸣潮插件帮助
        </h2>

        <ul className="kuromc-text border-t border-b divide-y mt-10 p-4">
          <li className="p-4">
            <div className="text-lg">kmc帮助</div>
            <p className="text-sm opacity-80">插件帮助信息</p>
          </li>
          <li className="p-4">
            <div className="text-lg">kmc抽卡帮助</div>
            <p className="text-sm opacity-80">抽卡帮助信息</p>
          </li>
          <li className="p-4">
            <div className="text-lg">kmc(唤取/抽卡/hq)(UP/常驻)</div>
            <p className="text-sm opacity-80">抽卡分析</p>
          </li>
          <li className="p-4">
            <div className="text-lg">kmc版本活动</div>
            <p className="text-sm opacity-80">查看当前鸣潮游戏正在进行的活动</p>
          </li>
          <li className="p-4">
            <div className="text-lg">kmc当期up</div>
            <p className="text-sm opacity-80">查看鸣潮当前正在up的角色</p>
          </li>
        </ul>
      </Page>
    </>
  )
}
