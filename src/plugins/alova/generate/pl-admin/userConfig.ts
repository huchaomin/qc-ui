import { withConfigType } from './createApis'

export default withConfigType({
  'asset_assetOtherFields.post': {
    meta: {
      useDownload: true,
    },
    transform: (data) => {
      return data
    },
  },
})
