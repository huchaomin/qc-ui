import alovaInstance from '../../index'
import { createApis, withConfigType } from './createApis'

export const $$userConfigMap = withConfigType({})

export default createApis(alovaInstance, $$userConfigMap)

export { alovaInstance }
