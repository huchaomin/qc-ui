import alovaInstance from '../../index'
import { createApis } from './createApis'
import userConfig from './userConfig'

export { userConfig as $$userConfigMap, alovaInstance }

export default createApis(alovaInstance, userConfig)
