<script lang="ts" setup>
const dayValue = defineModel<string>('day', { required: true })
const weekValue = defineModel<string>('week', { required: true })
const configObject = reactive({
  dayIncrement: '1',
  dayIncrementStart: '1',
  daySpecifyArr: [] as string[],
  lastDaysOfMonth: '1',
  lastXqOfMonth: '1',
  nearestWeekday: '1',
  nthXqOfMonthNth: '1',
  nthXqOfMonthXq: '1',
  type: 'every' as
    | 'dayLoop'
    | 'daySpecify'
    | 'every'
    | 'lastDayOfMonth'
    | 'lastDaysOfMonth'
    | 'lastWeekdayOfMonth'
    | 'lastXqOfMonth'
    | 'nearestWeekday'
    | 'nthXqOfMonth'
    | 'weekLoop'
    | 'weekSpecify',
  weekIncrement: '1',
  weekIncrementStart: '1',
  weekSpecifyArr: [] as string[],
})
const weekOptions = [
  {
    label: '日',
    value: '1',
  },
  {
    label: '一',
    value: '2',
  },
  {
    label: '二',
    value: '3',
  },
  {
    label: '三',
    value: '4',
  },
  {
    label: '四',
    value: '5',
  },
  {
    label: '五',
    value: '6',
  },
  {
    label: '六',
    value: '7',
  },
]
const weekOptionsWithXq = weekOptions.map((item) => ({
  ...item,
  label: `星期${item.label}`,
}))

watch(
  configObject,
  () => {
    switch (configObject.type) {
      case 'dayLoop':
        dayValue.value = `${configObject.dayIncrementStart}/${configObject.dayIncrement}`
        weekValue.value = '?'
        break
      case 'daySpecify':
        dayValue.value = configObject.daySpecifyArr.join(',') || '*'
        weekValue.value = '?'
        break
      case 'lastDayOfMonth':
        dayValue.value = 'L'
        weekValue.value = '?'
        break
      case 'lastDaysOfMonth':
        dayValue.value = `L-${configObject.lastDaysOfMonth}`
        weekValue.value = '?'
        break
      case 'lastWeekdayOfMonth':
        dayValue.value = 'LW'
        weekValue.value = '?'
        break
      case 'lastXqOfMonth':
        dayValue.value = '?'
        weekValue.value = `${configObject.lastXqOfMonth}L`
        break
      case 'nearestWeekday':
        dayValue.value = `${configObject.nearestWeekday}W`
        weekValue.value = '?'
        break
      case 'nthXqOfMonth':
        dayValue.value = '?'
        weekValue.value = `${configObject.nthXqOfMonthXq}#${configObject.nthXqOfMonthNth}`
        break
      case 'weekLoop':
        dayValue.value = '?'
        weekValue.value = `${configObject.weekIncrementStart}/${configObject.weekIncrement}`
        break
      case 'weekSpecify':
        dayValue.value = '?'
        weekValue.value = configObject.weekSpecifyArr.join(',') || '*'
        break
      case 'every':
      default:
        dayValue.value = '?'
        weekValue.value = '*'
    }
  },
  {
    deep: true,
  },
)
watch(
  () => `${dayValue.value} ${weekValue.value}`,
  () => {
    if (dayValue.value === '?') {
      if (weekValue.value.endsWith('L')) {
        configObject.type = 'lastXqOfMonth'
        configObject.lastXqOfMonth = weekValue.value.split('L')[0]
        return
      }

      if (weekValue.value.includes('#')) {
        configObject.type = 'nthXqOfMonth'
        configObject.nthXqOfMonthNth = weekValue.value.split('#')[1]
        configObject.nthXqOfMonthXq = weekValue.value.split('#')[0]
        return
      }

      if (weekValue.value.includes('/')) {
        configObject.type = 'weekLoop'
        configObject.weekIncrementStart = weekValue.value.split('/')[0]
        configObject.weekIncrement = weekValue.value.split('/')[1]
        return
      }

      if (weekValue.value.includes(',') || isValidNumberString(weekValue.value)) {
        configObject.type = 'weekSpecify'
        configObject.weekSpecifyArr = weekValue.value === '*' ? [] : weekValue.value.split(',')
        return
      }

      if (!['every', 'weekSpecify'].includes(configObject.type)) {
        configObject.type = 'every'
      }

      if (configObject.type === 'weekSpecify') {
        configObject.weekSpecifyArr = []
      }

      return
    }

    if (dayValue.value === 'L') {
      configObject.type = 'lastDayOfMonth'
      return
    }

    if (dayValue.value === 'LW') {
      configObject.type = 'lastWeekdayOfMonth'
      return
    }

    if (dayValue.value.includes('/')) {
      configObject.type = 'dayLoop'
      configObject.dayIncrementStart = dayValue.value.split('/')[0]
      configObject.dayIncrement = dayValue.value.split('/')[1]
      return
    }

    if (dayValue.value.endsWith('W')) {
      configObject.type = 'nearestWeekday'
      configObject.nearestWeekday = dayValue.value.split('W')[0]
      return
    }

    if (dayValue.value.startsWith('L-')) {
      configObject.type = 'lastDaysOfMonth'
      configObject.lastDaysOfMonth = dayValue.value.split('-')[1]
      return
    }

    configObject.type = 'daySpecify'
    configObject.daySpecifyArr = dayValue.value === '*' ? [] : dayValue.value.split(',')
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <TRadioGroup v-model="configObject.type">
    <TRadio value="every">每天</TRadio>
    <TRadio value="weekLoop"
      >循环(按星期)
      <span class="ml-10">
        从星期
        <TSelect
          v-model="configObject.weekIncrementStart"
          :options="weekOptions"
          :clearable="false"
          :filterable="false"
        ></TSelect>
        开始，间隔
        <TSelect
          v-model="configObject.weekIncrement"
          :options="
            Array.from({ length: 7 }, (_, index) => index + 1).map((val) => ({
              label: String(val),
              value: String(val),
            }))
          "
          :clearable="false"
          :filterable="false"
        ></TSelect>
        天
      </span>
    </TRadio>
    <TRadio value="dayLoop"
      >循环(按日)
      <span class="ml-10">
        从
        <TSelect
          v-model="configObject.dayIncrementStart"
          :options="
            Array.from({ length: 31 }, (_, index) => index + 1).map((val) => ({
              label: String(val),
              value: String(val),
            }))
          "
          :clearable="false"
          :filterable="false"
        ></TSelect>
        日开始，间隔
        <TSelect
          v-model="configObject.dayIncrement"
          :options="
            Array.from({ length: 31 }, (_, index) => index + 1).map((val) => ({
              label: String(val),
              value: String(val),
            }))
          "
          :clearable="false"
          :filterable="false"
        ></TSelect>
        天
      </span>
    </TRadio>
    <TRadio value="weekSpecify">
      <div class="flex flex-col gap-1">
        <span>指定星期</span>
        <TCheckboxGroup
          v-model="configObject.weekSpecifyArr"
          :options="weekOptionsWithXq"
        ></TCheckboxGroup>
      </div>
    </TRadio>
    <TRadio value="daySpecify">
      <div class="flex flex-col gap-1">
        <span>指定日</span>
        <TCheckboxGroup
          v-model="configObject.daySpecifyArr"
          :options="
            Array.from({ length: 31 }, (_, index) => index + 1).map((val) => ({
              label: String(val),
              value: String(val),
            }))
          "
        ></TCheckboxGroup>
      </div>
    </TRadio>
    <TRadio value="lastDayOfMonth">月最后一天</TRadio>
    <TRadio value="lastWeekdayOfMonth">月最后一个工作日</TRadio>
    <TRadio value="lastXqOfMonth"
      >月最后一个星期
      <TSelect
        v-model="configObject.lastXqOfMonth"
        :options="weekOptions"
        :clearable="false"
        :filterable="false"
      ></TSelect
    ></TRadio>
    <TRadio value="lastDaysOfMonth"
      >月最后
      <TSelect
        v-model="configObject.lastDaysOfMonth"
        :options="
          Array.from({ length: 31 }, (_, index) => index + 1).map((val) => ({
            label: String(val),
            value: String(val),
          }))
        "
        :clearable="false"
        :filterable="false"
      ></TSelect>
      天</TRadio
    >
    <TRadio value="nearestWeekday">
      <TSelect
        v-model="configObject.nearestWeekday"
        :options="
          Array.from({ length: 31 }, (_, index) => index + 1).map((val) => ({
            label: String(val),
            value: String(val),
          }))
        "
        :clearable="false"
        :filterable="false"
      ></TSelect>
      日最近的一个工作日</TRadio
    >
    <TRadio value="nthXqOfMonth"
      >月第
      <TSelect
        v-model="configObject.nthXqOfMonthNth"
        :options="
          Array.from({ length: 5 }, (_, index) => index + 1).map((val) => ({
            label: String(val),
            value: String(val),
          }))
        "
        :clearable="false"
        :filterable="false"
      ></TSelect>
      个星期
      <TSelect
        v-model="configObject.nthXqOfMonthXq"
        :options="weekOptions"
        :clearable="false"
        :filterable="false"
      ></TSelect>
    </TRadio>
  </TRadioGroup>
</template>
