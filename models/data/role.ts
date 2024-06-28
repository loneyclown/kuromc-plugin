import { createRequire } from 'module'
import profile, { T_Profile } from "./profile";

const require = createRequire(import.meta.url)

export type T_RoleData = {
  名字: string,
  resourceId?: number,
  性别: string,
  生日: string,
  属性: T_Profile,
  武器: string,
  所属: string,
  星级: number,
  avatar: string,
  up?: boolean
}

export default [
  { 名字: '秧秧', resourceId: 1402, 性别: '女', 生日: '10月11日', 属性: profile.气动, 武器: '迅刀', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_1_UI.png') },
  { 名字: '炽霞', 性别: '女', 生日: '4月18日', 属性: profile.热熔, 武器: '佩枪', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_2_UI.png') },
  { 名字: '维里奈', 性别: '女', 生日: '5月18日', 属性: profile.衍射, 武器: '音感仪', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_3_UI.png') },
  { 名字: '漂泊者-男', 性别: '女', 生日: '', 属性: {}, 武器: '', 所属: '', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_4_UI.png') },
  { 名字: '漂泊者-女', 性别: '女', 生日: '', 属性: {}, 武器: '', 所属: '', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_5_UI.png') },
  { 名字: '白芷', 性别: '女', 生日: '9月10日', 属性: profile.冷凝, 武器: '音感仪', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_6_UI.png') },
  { 名字: '散华', resourceId: 1102, 性别: '女', 生日: '1月20日', 属性: profile.冷凝, 武器: '迅刀', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_7_UI.png') },
  { 名字: '安可', 性别: '女', 生日: '3月21日', 属性: profile.热熔, 武器: '音感仪', 所属: '黑海岸', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_8_UI.png') },
  { 名字: '桃祈', resourceId: 1601, 性别: '女', 生日: '2月25日', 属性: profile.湮灭, 武器: '长刃', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_9_UI.png') },
  { 名字: '丹瑾', 性别: '女', 生日: '8月31日', 属性: profile.湮灭, 武器: '迅刀', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_10_UI.png') },
  { 名字: '忌炎', 性别: '男', 生日: '12月14日', 属性: profile.气动, 武器: '长刃', 所属: '今州', 星级: 5, up: true, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_11_UI.png') },
  { 名字: '秋水', resourceId: 1403, 性别: '男', 生日: '6月11日', 属性: profile.气动, 武器: '佩枪', 所属: '黑海岸', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_12_UI.png') },
  { 名字: '莫特斐', 性别: '男', 生日: '11月6日', 属性: profile.热熔, 武器: '佩枪', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_13_UI.png') },
  { 名字: '凌阳', 性别: '男', 生日: '8月8日', 属性: profile.冷凝, 武器: '臂铠', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_14_UI.png') },
  { 名字: '渊武', resourceId: 1303, 性别: '男', 生日: '10月2日', 属性: profile.导电, 武器: '臂铠', 所属: '今州', 星级: 4, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_15_UI.png') },
  { 名字: '吟霖', resourceId: 1302, 性别: '女', 生日: '9月17日', 属性: profile.导电, 武器: '音感仪', 所属: '今州', 星级: 5, up: true, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_17_UI.png') },
  { 名字: '卡卡罗', 性别: '男', 生日: '7月8日', 属性: profile.导电, 武器: '长刃', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_18_UI.png') },
  { 名字: '鉴心', 性别: '女', 生日: '4月6日', 属性: profile.气动, 武器: '臂铠', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_23_UI.png') },
  { 名字: '今汐', resourceId: 1304,性别: '女', 生日: '', 属性: profile.衍射, 武器: '长刃', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_24_UI.png') },
  { 名字: '长离', 性别: '女', 生日: '', 属性: profile.热熔, 武器: '迅刀', 所属: '今州', 星级: 5, avatar: require('../../public/assets/image/IconRoleHead175/T_IconRoleHead175_26_UI.png') },
] as T_RoleData[]