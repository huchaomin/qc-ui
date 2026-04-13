import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs
