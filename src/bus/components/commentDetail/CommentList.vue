<script setup lang="ts">
withDefaults(
  defineProps<{
    list: Array<Record<string, any>>
  }>(),
  {},
)
</script>

<template>
  <TListItem v-for="i in list" :key="i.commentId">
    <TListItemMeta :image="i.headUrl" :title="i.content">
      <template #description>
        <div class="mt-2 flex items-center gap-1">
          <Icon icon="mdi-thumb-up-outline" size="16"></Icon>
          {{ i.likeCount }}
          <TDivider layout="vertical" class="mx-5"></TDivider>
          <Icon icon="mdi-message-reply-text-outline" size="16"></Icon>
          {{ i.expandCommentCount }}
        </div>
      </template>
    </TListItemMeta>
    <template #action>
      <div class="flex flex-col items-end gap-3">
        <div>
          <span style="color: #79befd" class="mr-1">
            {{ i.author }}
          </span>
          发布于
        </div>
        <span>
          {{ i.publishTime }}
        </span>
      </div>
    </template>
  </TListItem>
</template>
