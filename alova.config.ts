export default {
  generator: [
    {
      autoUpdate: false,
      global: 'PlAdmin',
      // https://spec.openapis.org/oas/v3.1.0.html#operation-object
      handleApi: (apiDescriptor: {
        method: string
        operationId: string
        tags: string[]
        url: string
      }) => {
        // 返回falsy值表示过滤此api
        const url = apiDescriptor.url.replace('/pl-admin/', '')

        if (url.includes('$')) {
          console.error(`url中不能包含$符号: ${url}`)
          return false
        }

        apiDescriptor.url = url
        apiDescriptor.operationId = apiDescriptor.method
        apiDescriptor.tags = [url.split('/').map(tag => tag.startsWith('{') ? `$${tag.slice(1, -1)}$` : tag).map(tag => tag.replace(/_/g, '$')).join('_')]
        return apiDescriptor
      },
      // input: 'src/plugins/alova/generate/pl-admin.swagger.json',
      input: 'http://127.0.0.1:4523/export/openapi/4?version=2.0', // 以当前项目为相对目录的本地地址
      output: 'src/plugins/alova/generate/pl-admin', // 输出目录
    },
  ],
}

// const apiDescriptor = {
//   summary: '分页查询工单统计',
//   deprecated: false,
//   description: 'com.qcai.pladmin.controller.WorkOrderStatisticsController.getPage(WorkOrderStatisticsReq workOrderStatisticsReq)',
//   method: 'get',
//   operationId: 'getPageUsingGET_49',
//   parameters: [
//     {
//       description: '',
//       in: 'query',
//       name: 'isAsc',
//       required: false,
//       schema: { type: 'string' },
//     },
//     {
//       description: '',
//       in: 'query',
//       name: 'lastId',
//       required: false,
//       schema: { format: 'int64', type: 'integer' },
//     },
//     {
//       description: '',
//       in: 'query',
//       name: 'orderByColumn',
//       required: false,
//       schema: { type: 'string' },
//     },
//     {
//       description: '',
//       in: 'query',
//       name: 'pageNum',
//       required: false,
//       schema: { format: 'int32', type: 'integer' },
//     },
//     {
//       description: '',
//       in: 'query',
//       name: 'pageSize',
//       required: false,
//       schema: { format: 'int32', type: 'integer' },
//     },
//     {
//       description: '机构名称',
//       in: 'query',
//       name: 'partnerId',
//       required: false,
//       schema: { format: 'int64', type: 'integer' },
//     },
//     {
//       description: '机构名称',
//       in: 'query',
//       name: 'partnerName',
//       required: false,
//       schema: { type: 'string' },
//     },
//     {
//       description: '',
//       in: 'query',
//       name: 'useLastId',
//       required: false,
//       schema: { type: 'boolean' },
//     },
//   ],
//   requestBody: {},
//   responses: {
//     _$ref: '#/components/schemas/BasePage_8',
//     properties: {
//       code: { description: '消息状态码', format: 'int32', type: 'integer' },
//       msg: { description: '消息内容', type: 'string' },
//       rows: {
//         description: '列表数据',
//         items: {
//           _$ref: '#/components/schemas/_14',
//           description: '工单统计实体',
//           properties: {
//             createBy: { description: '创建人', type: 'string' },
//             createTime: {
//               description: '创建时间',
//               format: 'date-time',
//               type: 'string',
//             },
//             id: { description: '主键', format: 'int64', type: 'integer' },
//             partnerId: { description: '机构id', format: 'int64', type: 'integer' },
//             partnerName: { description: '机构名称', type: 'string' },
//             processCount: { description: '已处理工单数', format: 'int32', type: 'integer' },
//             totalCount: { description: '工单总数', format: 'int32', type: 'integer' },
//             unProcessCount: { description: '未处理工单数', format: 'int32', type: 'integer' },
//             updateBy: { description: '更新人', type: 'string' },
//             updateTime: {
//               description: '更新时间',
//               format: 'date-time',
//               type: 'string',
//             },
//             yesterdayAddCount: {
//               description: '昨日新增工单数',
//               format: 'int32',
//               type: 'integer',
//             },
//           },
//           title: '工单统计对象',
//           type: 'object',
//         },
//         type: 'array',
//       },
//       total: { description: '总记录数', format: 'int64', type: 'integer' },
//     },
//     title: 'BasePage«工单统计对象»',
//     type: 'object',
//   },
//   security: [],
//   summary: '分页查询工单统计',
//   tags: ['general'],
//   url: '/pl-admin/process/workOrderStatistics/list',
// }
