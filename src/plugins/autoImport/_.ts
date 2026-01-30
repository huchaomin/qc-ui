import { cloneDeep, groupBy, kebabCase, omit, pick, uniqueId } from 'lodash-es'

const _: {
  cloneDeep: typeof cloneDeep
  groupBy: typeof groupBy
  kebabCase: typeof kebabCase
  omit: typeof omit
  pick: typeof pick
  uniqueId: typeof uniqueId
} = {
  cloneDeep,
  groupBy,
  kebabCase,
  omit,
  pick,
  uniqueId,
}

export default _
