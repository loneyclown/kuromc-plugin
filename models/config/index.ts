import _ from "lodash";
import util from "../util";

type T_Config = {
  base: T_baseConfig
}
type T_baseConfig = {
  gacha: {
    /** 是否统计4星 */
    isItFourStarCount: boolean
  }
}

const defaultConfig: T_Config = {
  base: {
    gacha: {
      isItFourStarCount: false
    }
  }
}

export default new (class Config {
  #configRootPath = `${util.pluginRootPath}/config`;
  #configBasePath = `${this.#configRootPath}/base.yaml`;

  constructor() {
    if (!util.fileExists(this.#configBasePath)) {
      util.writeYAML(this.#configBasePath, defaultConfig.base);
    }
    // this.#config.base = util.readYAML(this.#configBasePath);
  }

  get baseConfig(): T_baseConfig {
    return util.readYAML(this.#configBasePath);
  }

  setBaseConfig(config: T_baseConfig) {
    const oldConfig = util.readYAML(this.#configBasePath);
    util.writeYAML(this.#configBasePath, _.merge(oldConfig, config));
  }
})();
