import { createRequire } from 'yunzai/utils'

const require = createRequire(import.meta.url)

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
}