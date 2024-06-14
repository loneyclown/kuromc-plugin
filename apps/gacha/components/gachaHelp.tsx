import React from 'react'
import Footer from '../../../layout/footer'
export type DataType = {
  name: string
}
export type PropsType = {}
export default function App() {
  return (
    <>
      <div className="kuromc-bg kuromc-help p-10">
        <h2 className="text-3xl font-bold tracking-tight text-center pt-8 kuromc-text-title">鸣潮抽卡帮助</h2>

        <p className="mt-4 text-lg leading-8 kuromc-text">
          抽卡链接绑定：私聊bot发送完整的抽卡链接即可！
        </p>
        <p className="mt-4 text-lg leading-8 kuromc-text">
          抽卡链接获取：手机打开抽卡界面，然后断网点开历史记录；左上角空白长按然后全选复制。
        </p>

        <ul className="kuromc-text divide-y mt-10 p-4">
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)</div>
            <p className='opacity-80'>&gt; 例：kmc唤取</p>
          </li>
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)(角色/武器)</div>
            <p className='opacity-80'>&gt; 例：kmc唤取角色</p>
          </li>
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)(角色常驻/武器常驻)</div>
            <p className='opacity-80'>&gt; 例：kmc唤取角色常驻</p>
          </li>
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)(新手/新手自选)</div>
            <p className='opacity-80'>&gt; 例：kmc唤取新手</p>
          </li>
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)(感恩/感恩自选)</div>
            <p className='opacity-80'>&gt; 例：kmc唤取感恩</p>
          </li>
        </ul>

        <Footer />
      </div>
    </>
  )
}