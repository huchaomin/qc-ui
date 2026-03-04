import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'

dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)

export default dayjs
