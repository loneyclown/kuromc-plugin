import React, { useMemo } from 'react'
import Page from '../../../layout/page'
import _ from 'lodash'
import {
  T_CardPoolType,
  T_GaChaData,
  T_GaCheViewData
} from '../../../models/gacha'
import role from '../../../models/data/role'
import weapon from '../../../models/data/weapon'

type GachaListItemProps = {
  record: T_GaChaData
  type: '角色' | '武器'
}

const GachaListItem: React.FC<GachaListItemProps> = ({ record, type }) => {
  const { name, resourceId, count } = record
  const conutTextColorClassName = useMemo(() => {
    if (count <= 30) {
      return 'text-[#84cc16]'
    }
    if (count <= 60) {
      return 'text-[#f59e0b]'
    }
    return 'text-[#ef4444]'
  }, [count])

  if (!record || !record.name) {
    return null
  }

  // console.log('record', record)

  const items = type === '角色' ? role : weapon
  const item = _(items).find(
    x => x.resourceId === resourceId || x.名字 === name
  )

  if (!item) {
    return null
  }

  return (
    <div>
      <div className="bg-black bg-opacity-50 rounded-lg overflow-hidden w-[96px] h-[130px]">
        <div className="p-4 relative">
          <img className="w-[60px] h-[60px]" src={item.avatar} />
          <div
            className={`absolute left-0 bottom-0 h-[50%] w-[100%] kuromc-level-${item.星级 || record.src.qualityLevel}-bgc`}
          ></div>
          {item.up && (
            <div className="absolute top-0 right-0 p-1 rounded bg-emerald-500/10 text-emerald-500 text-[14px] font-semibold leading-none ml-2">
              up
            </div>
          )}
        </div>
        <div className="py-1 text-center">
          <span className={`text-[20px] font-bold ${conutTextColorClassName}`}>
            {count}
          </span>{' '}
          抽
        </div>
      </div>
    </div>
  )
}

export type GaChaAppProps = {
  roleData: T_GaCheViewData
  weaponData: T_GaCheViewData
  type: T_CardPoolType
}

export default function GaChaApp({
  roleData,
  weaponData,
  type
}: GaChaAppProps) {
  const viewType = type === 'UP' ? '精准' : '常驻'

  return (
    <>
      <Page>
        <div>
          <div className="relative">
            <div className="kuromc-text-title text-4xl font-bold">
              <span>抽卡分析</span>
              <img
                className="mt-[4px] h-[36px] w-[210px]"
                src="https://web-static.kurobbs.com/resource/wiki/prod/assets/title-underline-mc-3c8ec006.svg"
              />
            </div>
            <div className="kuromc-gacha-bottom-line">
              <div className="black-block"></div>
              <div
                className="black-block"
                style={{ right: -1, left: 'auto' }}
              ></div>
            </div>
          </div>

          <div className="kuromc-gacha-body">
            <div className="mt-10 border-l-4 pl-4 kuromc-text border-[#f2d57c]">
              <div className="py-4 flex justify-between items-center">
                <div className="text-2xl font-bold">角色{viewType}调谐</div>
                <div>
                  总计已唤取
                  <span className="mx-2 text-xl">{roleData.totalNum}</span>次
                </div>
                <div>
                  剩余
                  <span className="mx-2 text-xl">{80 - roleData.lastNum}</span>
                  次唤取必出五星
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {_.map(roleData.data, (item, index) => (
                  <GachaListItem key={index} record={item} type="角色" />
                ))}
              </div>

              {roleData.countStartTime && roleData.countEndTime && (
                <div className="kuromc-text mt-10 text-center opacity-80">
                  数据统计时间: {roleData.countStartTime} ~{' '}
                  {roleData.countEndTime}
                </div>
              )}
            </div>

            <div className="mt-10 border-l-4 pl-4 kuromc-text border-[#f2d57c]">
              <div className="py-4 flex justify-between items-center">
                <div className="text-2xl font-bold">武器{viewType}调谐</div>
                <div>
                  已唤取
                  <span className="mx-2 text-xl">{weaponData.totalNum}</span>次
                </div>
                <div>
                  剩余
                  <span className="mx-2 text-xl">
                    {80 - weaponData.lastNum}
                  </span>
                  次唤取出五星
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {_.map(weaponData.data, (item, index) => (
                  <GachaListItem key={index} record={item} type="武器" />
                ))}
              </div>

              {weaponData.countStartTime && weaponData.countEndTime && (
                <div className="kuromc-text mt-10 text-center opacity-80">
                  数据统计时间: {weaponData.countStartTime} ~{' '}
                  {weaponData.countEndTime}
                </div>
              )}
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}
