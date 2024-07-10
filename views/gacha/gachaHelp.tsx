import React from 'react'
import Page from '../../layout/page'

export type PropsType = {}

export default function App() {
  return (
    <>
      <Page>
        <h2 className="text-4xl font-bold tracking-tight text-center pt-8 kuromc-text-title">
          鸣潮抽卡帮助
        </h2>

        <ul className="kuromc-text divide-y mt-10 p-4">
          <li className="p-4">
            <div>kmc(唤取/抽卡/hq)(UP/常驻)</div>
            <p className="opacity-80">
              &gt; 例：kmc唤取UP （ps：第二参数不传时默认为UP池数据）
            </p>
          </li>
          <li className="p-4">
            <div>抽卡链接绑定：kmc抽卡链接绑定/kmc绑定抽卡链接</div>
            <p className="opacity-80">
              &gt; 例：kmc绑定抽卡链接（ps：仅限私聊）
            </p>
          </li>
          <li className="p-4">
            <div>抽卡链接获取：kmc获取抽卡链接</div>
            <p className="opacity-80">
              &gt; 例：kmc获取抽卡链接（ps：仅限私聊）
            </p>
          </li>
          <li className="p-4">
            <div>更新抽卡记录：kmc抽卡更新</div>
            <p className="opacity-80">
              &gt; 例：kmc抽卡更新
            </p>
          </li>
        </ul>

        <div className="kuromc-text border-l-4 bg-black bg-opacity-50 p-4 border-[#f2d57c]">
          <h4 className="text-xl font-bold">抽卡链接获取</h4>
          <div>
            <p className="mt-1">
              手机打开抽卡界面，然后断网点开历史记录；左上角空白长按然后全选复制。
            </p>
            <p className="mt-1">
              电脑打开抽卡，然后找到鸣潮安装目录找到Wuthering Waves\Wuthering
              Waves
              Game\Client\Saved\Logs\Client.log文件打开，搜索aki-gm-resources最后一条记录就是抽卡链接。
            </p>
          </div>
        </div>
      </Page>
    </>
  )
}
