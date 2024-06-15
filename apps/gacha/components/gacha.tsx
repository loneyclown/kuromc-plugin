import React, { useMemo } from 'react'
import Footer from '../../../layout/footer'
import _ from 'lodash'

type GachaListItemProps = {
  conut: number
  role: any
}

const GachaListItem: React.FC<GachaListItemProps> = ({ conut, role }) => {

  const conutTextColorClassName = useMemo(() => {
    if (conut <= 30) {
      return 'text-[#84cc16]'
    }
    if (conut <= 60) {
      return 'text-[#f59e0b]'
    }
    return 'text-[#ef4444]'
  }, [conut])

  if (!role) {
    return null
  }

  return <div>
    <div className='bg-black bg-opacity-50 rounded-lg overflow-hidden w-[96px] h-[130px]'>
      <div className='p-4 relative'>
        <img className='w-[60px] h-[60px]' src={role.avatar} />
        <div className='absolute left-0 bottom-0 h-[50%] w-[100%] kuromc-level-4-bgc'></div>
        <div className="absolute top-0 right-0 p-1 rounded bg-emerald-500/10 text-emerald-500 text-[14px] font-semibold leading-none ml-2">up</div>
      </div>
      <div className='py-1 text-center'><span className={`text-[20px] font-bold ${conutTextColorClassName}`}>{conut}</span> 抽</div>
    </div>
  </div>
}

export type GaChaAppProps = {
  roleListData: any[]
}

export default function GaChaApp({ roleListData }: GaChaAppProps) {
  return (
    <>
      <div className="kuromc-bg-img kuromc-bg kuromc-gacha p-10 pb-[72px]">
        <div className='kuromc-gacha-wrap'>
          <div className='kuromc-gacha-header'>
            <div className='kuromc-gacha-title kuromc-text-title text-4xl font-bold'>
              <span>抽卡分析</span>
              <img src="https://web-static.kurobbs.com/resource/wiki/prod/assets/title-underline-mc-3c8ec006.svg" />
            </div>
            <div className='kuromc-gacha-bottom-line'>
              <div className='black-block'></div>
              <div className='black-block' style={{ right: -1, left: 'auto' }}></div>
            </div>
          </div>

          <div className='kuromc-gacha-body'>

            <div className='mt-10 border-l-4 pl-4 kuromc-text border-[#f2d57c]'>
              <div className='py-4 flex justify-between items-center'>
                <div className='text-2xl font-bold'>角色精准调谐</div>
                <div>已唤取<span className='mx-2 text-xl'>388989</span>次</div>
                <div>剩余<span className='mx-2 text-xl'>10</span>次唤取出五星</div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                {_.map(roleListData, (item) => <GachaListItem role={item.role} conut={item.count} />)}
              </div>
            </div>
{/* 
            <div className='mt-10 border-l-4 pl-4 kuromc-text border-[#f2d57c]'>
              <div className='py-4 flex justify-between items-center'>
                <div className='text-2xl font-bold'>武器精准调谐</div>
                <div>已唤取<span className='mx-2 text-xl'>388989</span>次</div>
                <div>剩余<span className='mx-2 text-xl'>10</span>次唤取出五星</div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                {_.map(new Array(10), (item) => <GachaListItem role={role.find((v) => v.名字 === '秧秧')} conut={56} />)}
              </div>
            </div> */}

            <div className='kuromc-text mt-10 text-center opacity-80'>数据统计时间: 2024-05-22 ~ 2024-06-15</div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}