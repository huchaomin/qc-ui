<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    selectLength: number
    startZero?: boolean
    unit: string
  }>(),
  {
    startZero: true,
  },
)
const modelValue = defineModel<string>({ required: true })
const configObject = reactive({
  increment: '1',
  incrementStart: props.startZero ? '0' : '1',
  rangeEnd: props.startZero ? '1' : '2',
  rangeStart: props.startZero ? '0' : '1',
  specifyArr: [] as string[],
  type: 'every' as 'every' | 'loop' | 'range' | 'specify',
})

watch(
  configObject,
  () => {
    switch (configObject.type) {
      case 'loop':
        modelValue.value = `${configObject.incrementStart}/${configObject.increment}`
        break
      case 'range':
        modelValue.value = `${configObject.rangeStart}-${configObject.rangeEnd}`
        break
      case 'specify':
        if (configObject.specifyArr.length > 0) {
          let str = ''

          ;[...configObject.specifyArr]
            .sort((a, b) => Number(a) - Number(b))
            .forEach((val) => {
              str += `${val},`
            })
          modelValue.value = str.slice(0, -1)
        } else {
          modelValue.value = '*'
        }

        break
      case 'every':
      default:
        modelValue.value = '*'
        break
    }
  },
  {
    deep: true,
  },
)
watch(
  modelValue,
  (str) => {
    if (str.includes('/')) {
      configObject.type = 'loop'

      const [start, increment] = str.split('/')

      configObject.incrementStart = start
      configObject.increment = increment
      return
    }

    if (str.includes('-')) {
      configObject.type = 'range'

      const [start, end] = str.split('-')

      configObject.rangeStart = start
      configObject.rangeEnd = end
      return
    }

    if (str.includes(',') || isValidNumberString(str)) {
      configObject.type = 'specify'
      configObject.specifyArr = str.split(',')
      return
    }

    if (!['every', 'specify'].includes(configObject.type)) {
      configObject.type = 'every'
    }

    if (configObject.type === 'specify') {
      configObject.specifyArr = []
    }
  },
  {
    immediate: true,
  },
)

function handleRangeEndChange() {
  if (isFalsy(configObject.rangeStart) || isFalsy(configObject.rangeEnd)) {
    return
  }

  if (Number(configObject.rangeEnd) <= Number(configObject.rangeStart)) {
    configObject.rangeStart = String(Number(configObject.rangeEnd) - 1)
  }
}

function handleRangeStartChange() {
  if (isFalsy(configObject.rangeStart) || isFalsy(configObject.rangeEnd)) {
    return
  }

  if (Number(configObject.rangeStart) >= Number(configObject.rangeEnd)) {
    configObject.rangeEnd = String(Number(configObject.rangeStart) + 1)
  }
}
</script>

<template>
  <TRadioGroup v-model="configObject.type">
    <TRadio value="every">每{{ unit }}</TRadio>
    <TRadio value="range"
      >区间
      <span class="ml-10">
        从
        <TSelect
          v-model="configObject.rangeStart"
          :options="
            Array.from({ length: selectLength - 1 }, (_, index) => index + (startZero ? 0 : 1)).map(
              (val) => ({
                label: String(val),
                value: String(val),
              }),
            )
          "
          :clearable="false"
          :filterable="false"
          @change="handleRangeStartChange"
        ></TSelect>
        {{ unit }}，至
        <TSelect
          v-model="configObject.rangeEnd"
          :options="
            Array.from({ length: selectLength - 1 }, (_, index) => index + (startZero ? 1 : 2)).map(
              (val) => ({
                label: String(val),
                value: String(val),
              }),
            )
          "
          :clearable="false"
          :filterable="false"
          @change="handleRangeEndChange"
        ></TSelect>
        {{ unit }}
      </span>
    </TRadio>
    <TRadio value="loop"
      >循环
      <span class="ml-10">
        从
        <TSelect
          v-model="configObject.incrementStart"
          :options="
            Array.from({ length: selectLength }, (_, index) => index + (startZero ? 0 : 1)).map(
              (val) => ({
                label: String(val),
                value: String(val),
              }),
            )
          "
          :clearable="false"
          :filterable="false"
        ></TSelect>
        {{ unit }}开始，间隔
        <TSelect
          v-model="configObject.increment"
          :options="
            Array.from({ length: selectLength - 1 }, (_, index) => index + 1).map((val) => ({
              label: String(val),
              value: String(val),
            }))
          "
          :clearable="false"
          :filterable="false"
        ></TSelect>
        {{ unit }}
      </span>
    </TRadio>
    <TRadio value="specify">
      <div class="flex flex-col gap-1">
        <span>指定</span>
        <TCheckboxGroup
          v-model="configObject.specifyArr"
          :options="
            Array.from({ length: selectLength }, (_, index) => index + (startZero ? 0 : 1)).map(
              (val) => ({
                label: String(val),
                value: String(val),
              }),
            )
          "
        ></TCheckboxGroup>
      </div>
    </TRadio>
  </TRadioGroup>
</template>
