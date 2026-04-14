<script lang="ts" setup>
/**
 * @description: https://www.freeformatter.com/cron-expression-generator-quartz.html
 * @description: https://www.cnblogs.com/pugang/p/17126841.html
 * @description: https://bradymholt.github.io/cRonstrue/#cronstrue-demo
 * @description: cron-expression-validator(validate quartz cron expressions) 可用 cron-validate 代替
 * @description: cron-parser 不支持 LW L-n nW 等表达式
 * @description: quartzcron 不支持 n#n 表达式, 也支持 校验 Quartz Cron 表达式
 * @description: cronstrue 支持 Quartz Job Scheduler
 */
import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'
// @ts-expect-error quartzcron 暂无类型文件
import QuartzCron from 'quartzcron'
import Day from './Day.vue'
import Hour from './Hour.vue'
import Minute from './Minute.vue'
import Month from './Month.vue'
import Second from './Second.vue'
import 'cronstrue/locales/zh_CN'

const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {},
)
const defaultValue = '0 * * ? * *'

function getInitCronArr(): string[] {
  let str = defaultValue

  // eslint-disable-next-line no-empty
  if (props.modelValue === '') {
  } else if (validateCronString(props.modelValue) === true) {
    str = props.modelValue
  } else {
    $msg.error(`${props.modelValue} 不是一个有效的 cron 表达式, 已使用默认值 ${defaultValue}`)
  }

  return str.split(' ')
}

function validateCronString(str: string): string | true {
  if (typeof str !== 'string') {
    return '不是一个有效的 cron 表达式'
  }

  if (str === '') {
    return '表达式不能为空'
  }

  const qc = new QuartzCron()
  const result = qc.validate(`${str} *`)

  if (result.valid === true) {
    return true
  }

  return result.errors[0]
}

const cronArr = getInitCronArr()
const secondsText = ref(cronArr[0])
const minutesText = ref(cronArr[1])
const hoursText = ref(cronArr[2])
const daysText = ref(cronArr[3])
const monthsText = ref(cronArr[4])
const weeksText = ref(cronArr[5])
const cronConcat = computed(() => {
  return `${secondsText.value} ${minutesText.value} ${hoursText.value} ${daysText.value} ${monthsText.value} ${weeksText.value}`
})
const cronText = ref('')
const recentExecutionTimes = ref('')
const errorMessage = ref('')

watch(
  cronConcat,
  (val) => {
    cronText.value = val
    recentExecutionTimes.value = ''
    errorMessage.value = ''

    try {
      const result = validateCronString(val)

      if (result !== true) {
        throw new Error(result)
      }

      if (val.includes('#')) {
        const interval = CronExpressionParser.parse(val) // 这一步也有可能出错

        recentExecutionTimes.value = interval
          .take(10)
          .map((date) => dayjs(date.toDate()).format('YYYY-MM-DD HH:mm:ss'))
          .join('\n')
      } else {
        recentExecutionTimes.value = new QuartzCron(`${val} *`) // 这一步也有可能出错
          .next({
            n: 10,
          })
          .map((date: Date) => {
            return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss')
          })
          .join('\n')
      }
    } catch (error) {
      errorMessage.value = (error as Error).message ?? '解析失败'
    }
  },
  {
    immediate: true,
  },
)

function handleCronTextChange(val: string) {
  errorMessage.value = ''

  const result = validateCronString(val)

  if (result === true) {
    const arr = val.split(' ')

    secondsText.value = arr[0]
    minutesText.value = arr[1]
    hoursText.value = arr[2]
    daysText.value = arr[3]
    monthsText.value = arr[4]
    weeksText.value = arr[5]
  } else {
    errorMessage.value = result
  }
}

const cronstrueText = computed(() => {
  try {
    if (errorMessage.value !== '') {
      return errorMessage.value
    }

    return cronstrue.toString(cronText.value, {
      dayOfWeekStartIndexZero: false,
      locale: 'zh_CN',
      trimHoursLeadingZero: true,
      use24HourTimeFormat: true,
      // verbose: true,
    })
  } catch (error) {
    return (error as Error).message ?? '解析失败'
  }
})

function handleSubmit(): Promise<string> {
  return new Promise((resolve) => {
    const result = validateCronString(cronText.value)

    if (result === true) {
      resolve(cronText.value)
    } else {
      $msg.error(result)
    }
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <TTabs default-value="second">
    <TTabPanel value="second" label="秒">
      <Second v-model="secondsText" />
    </TTabPanel>
    <TTabPanel value="minute" label="分">
      <Minute v-model="minutesText" />
    </TTabPanel>
    <TTabPanel value="hour" label="时">
      <Hour v-model="hoursText" />
    </TTabPanel>
    <TTabPanel value="day" label="日">
      <Day v-model:day="daysText" v-model:week="weeksText" />
    </TTabPanel>
    <TTabPanel value="month" label="月">
      <Month v-model="monthsText" />
    </TTabPanel>
  </TTabs>
  <div class="mt-8 grid grid-cols-4 gap-3">
    <TInput v-model="secondsText" :adornment="{ prepend: () => '秒' }" />
    <TInput v-model="minutesText" :adornment="{ prepend: () => '分' }" />
    <TInput v-model="hoursText" :adornment="{ prepend: () => '时' }" />
    <div class="row-span-4 flex flex-col gap-1">
      <span class="text-xs">近十次执行时间：</span>
      <TTextarea
        :model-value="recentExecutionTimes"
        placeholder=""
        readonly
        class="flex-1"
        maxlength=""
      ></TTextarea>
    </div>
    <TInput v-model="daysText" :adornment="{ prepend: () => '日' }" />
    <TInput v-model="monthsText" :adornment="{ prepend: () => '月' }" />
    <TInput v-model="weeksText" :adornment="{ prepend: () => '星期' }" />
    <TInput
      v-model="cronText"
      :status="validateCronString(cronText) === true ? 'default' : 'error'"
      class="col-span-3"
      :adornment="{ prepend: () => '式' }"
      @change="(val) => handleCronTextChange(String(val))"
    />
    <TTextarea
      class="col-span-3"
      :model-value="cronstrueText"
      placeholder=""
      readonly
      maxlength=""
    ></TTextarea>
  </div>
</template>

<style scoped>
:deep() {
  .t-radio-group {
    flex-direction: column;
    row-gap: 12px;
    align-items: flex-start;
    width: 100%;
    margin-top: 16px;

    .t-radio {
      display: inline-flex;
      align-items: start;
      width: 100%;
      margin-right: 0;

      .t-radio__input {
        top: 6px;
        flex-shrink: 0;
      }

      .t-radio__label {
        flex: 1;
        line-height: 32px;
      }
    }
  }

  .t-checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
    gap: 8px;
  }

  .t-select__wrap {
    display: inline-flex;
    width: 100px;
  }
}

.t-textarea {
  :deep() {
    .t-textarea__inner {
      height: 100% !important;
    }
  }
}
</style>
