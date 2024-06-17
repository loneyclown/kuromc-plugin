import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export enum E_Profile_Key {
  '气动' = '气动',
  '导电' = '导电',
  '热熔' = '热熔',
  '衍射' = '衍射',
  '冷凝' = '冷凝',
  '湮灭' = '湮灭',
}

export type T_Profile = {
  key: string,
  name: string,
  icon: string
}

export default {
  '气动': {
    key: 'Wind',
    name: '气动',
    icon: require('../../public/assets/image/IconElement/T_IconElementWind3.png'),
  },
  '导电': {
    key: 'Thunder',
    name: '导电',
    icon: require('../../public/assets/image/IconElement/T_IconElementThunder3.png'),
  },
  '热熔': {
    key: 'Fire',
    name: '热熔',
    icon: require('../../public/assets/image/IconElement/T_IconElementFire3.png'),
  },
  '衍射': {
    key: 'Light',
    name: '衍射',
    icon: require('../../public/assets/image/IconElement/T_IconElementLight3.png'),
  },
  '冷凝': {
    key: 'Ice',
    name: '冷凝',
    icon: require('../../public/assets/image/IconElement/T_IconElementIce3.png'),
  },
  '湮灭': {
    key: 'Dark',
    name: '湮灭',
    icon: require('../../public/assets/image/IconElement/T_IconElementDark3.png'),
  }
} as Record<E_Profile_Key, T_Profile>