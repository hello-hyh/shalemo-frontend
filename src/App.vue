<template>
  <a-spin :spinning="isUploading || isBuilding">
    <template #tip>
      <div>正在处理中, 已消耗{{ uploadUseTime || buildUseTime }}秒</div>
    </template>
    <a-layout class="min-h-screen bg-gray-50">
      <!-- Header -->
      <a-layout-header class="bg-white shadow-sm">
        <div
          class="flex items-center h-full justify-between max-w-8xl mx-auto px-6"
        >
          <h1 class="text-3xl font-bold text-amber-300">AI自动化投标</h1>
          <h1 class="text-3xl text-white items-center">{{ exportFileName }}</h1>
          <div class="flex items-center gap-3">
            <a-upload
              :file-list="fileList"
              :before-upload="handleBeforeUpload"
              :on-remove="handleRemove"
              @change="handleChange"
              accept=".doc,.docx,.pdf"
            >
              <a-button
                type="default"
                ref="ref1"
                class="!flex items-center gap-2"
              >
                <upload-outlined />
                上传招标文件
              </a-button>
            </a-upload>
          </div>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="py-12 h-[calc(100vh-64px)] bid-content">
        <template v-if="isShowContent">
          <div
            class="max-w-12xl mx-auto px-6 grid gap-6 md:grid-cols-[320px_1fr]"
          >
            <aside
              class="bg-white rounded-2xl shadow-sm border border-slate-100 h-[calc(100vh-220px)] overflow-hidden flex flex-col"
            >
              <header class="px-6 py-4 border-b border-slate-100">
                <h2
                  class="text-lg font-semibold text-slate-700 flex items-center gap-2"
                >
                  <profile-outlined class="text-primary-500" />
                  预览标书大纲
                </h2>
                <p class="text-xs text-slate-500 mt-1">自动生成的大纲结构</p>
              </header>
              <a-collapse
                v-model:activeKey="activeSectionKeys"
                bordered="{false}"
                expand-icon-position="end"
                class="bg-white"
              >
                <a-collapse-panel
                  v-for="section in outlineList"
                  :key="section.id"
                  :header="section.section_title"
                >
                  <ul>
                    <li
                      v-for="sub in section.sub_sections"
                      :key="sub.id"
                      class="px-4 py-2 text-sm rounded-md cursor-pointer transition"
                      :class="
                        sub.id === activeOutlineId
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-slate-50'
                      "
                      @click="handleSelectSubSection(sub.id)"
                    >
                      <file-text-outlined class="mr-1" />
                      {{ sub.sub_section_title }}
                    </li>
                  </ul>
                </a-collapse-panel>
              </a-collapse>
            </aside>

            <section
              class="bg-white rounded-2xl shadow-sm border border-slate-100 h-[calc(100vh-220px)] overflow-hidden flex flex-col"
            >
              <header
                class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
              >
                <div>
                  <!-- <h2 class="text-lg font-semibold text-slate-700">
                    {{ currentOutlineTitle || '大纲详情' }}
                  </h2>
                  <p class="text-xs text-slate-500 mt-1">
                    章节内容通过 Markdown 渲染，可复制或下载
                  </p> -->

                  <div class="flex gap-4">
                    <a-button
                      ref="ref2"
                      class="!flex items-center gap-2"
                      :loading="loading"
                      @click="handleGenerate"
                    >
                      <PlayCircleOutlined />
                      开始生成
                    </a-button>
                    <a-button
                      ref="ref3"
                      type="primary"
                      class="!flex items-center gap-2"
                      :loading="loading"
                      @click="handleExportToWord"
                      :disabled="!exportFileName"
                    >
                      <DownloadOutlined />
                      下载文件
                    </a-button>
                  </div>
                </div>
              </header>
              <main
                class="flex-1 overflow-y-auto py-10 px-20 flex flex-col items-center"
              >
                <!-- <a-skeleton active :loading="contentLoading" class="px-6 py-6">
                  <article
                    class="prose prose-slate prose-sm max-w-none px-6 py-6"
                  >
                    <div v-html="renderedContent"></div>
                  </article>
                </a-skeleton> -->
                <h2 class="text-3xl text-center font-bold text-slate-700">
                  使用说明
                </h2>
                <div class="text-left text-xl leading-[40px] text-slate-700">
                  一、投标人须知模板体系
                  当前各行业及招标代理机构制定的投标人须知在格式架构与内容要素上存在显著行业差异。申朴基于长期行业研究，已系统收集整理中诚、中钢、中信等专业机构在银行、保险、证券等重点领域的投标人须知文件，构建了跨行业的知识库体系。通过对各行业典型招标项目的深度分析，我们提炼出具有普适性的行业标杆模板作为默认配置，该模板支持用户根据具体项目需求进行个性化修改，确保投标文件编制的规范性与针对性。
                  <br />
                  二、法律合规性校验功能
                  依据最新修订的《中华人民共和国招标投标法》及配套法规要求，申朴正在开发
                  AI
                  生成招标书的法律合规性智能校验系统。该系统将通过内置的法规数据库与智能比对引擎，对
                  AI
                  生成的招标文件进行全方位合规性审查，涵盖主体资格、程序要件、权利义务条款等核心要素，确保生成的投标文件完全符合现行法律法规要求。目前该功能处于研发测试阶段，我们将尽快完成优化并正式投入使用。
                  <br />
                  三、标书生成效率优化 现阶段 AI 标书生成模块的平均处理时长约为
                  5
                  分钟，为进一步提升用户体验，我们已启动性能优化计划。即将推出的功能升级版本将支持用户自定义生成文本的字数范围，通过智能算法动态调整生成策略，在保证文件完整性的前提下显著缩短生成时间。建议用户根据项目实际需求合理选择内容详略程度，以实现效率与质量的最佳平衡。
                  我们始终致力于为客户提供专业、高效的招投标解决方案，上述功能的持续迭代将有效提升投标文件编制的标准化水平与操作便捷性。如需了解更多细节或获取定制化服务，请随时与我们联系。
                  <br />
                  四、系统默认采用2017年版《中华人民共和国招投标法》。
                </div>
              </main>
            </section>
          </div>
        </template>
        <a-empty :description="'暂无数据'" v-else />
      </a-layout-content>
    </a-layout>
    <a-tour
      :open="isTourOpen"
      :current="currentStep"
      :steps="steps"
      @finish="handleFinishTour"
    >
      <template #indicatorsRender="{ current, total }">
        <span>{{ current + 1 }} / {{ total }}</span>
      </template>
    </a-tour>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  message,
  type TourProps,
  type UploadChangeParam,
  type UploadProps,
} from 'ant-design-vue'
import {
  UploadOutlined,
  FileTextOutlined,
  ProfileOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue'
import { marked } from 'marked'
import OutlineJson from './assets/outline.json'
import axios from 'axios'

// 模拟 JSON 数据
interface SubSection {
  id: string
  sub_section_title: string
}
interface Section {
  id: string
  section_title: string
  sub_sections: SubSection[]
}
const outlineList = ref<Section[]>(OutlineJson)

const activeSectionKeys = ref<string[]>([]) // 控制展开的一级目录
// 状态
const activeOutlineId = ref<string | null>(null)
const outlineContents = ref<Record<string, string>>({})
const fileList = ref<UploadProps['fileList']>([])
const loading = ref(false)
const contentLoading = ref(false)
const isUploading = ref(false)
const uploadUseTime = ref(0)

const isBuilding = ref(false)
const buildUseTime = ref(0)

const isShowContent = ref(false)

const exportFileName = ref('')

const fileId = ref('')

const ref1 = ref(null)
const ref2 = ref(null)
const ref3 = ref(null)

const isTourOpen = ref<boolean>(false)
const currentStep = ref<number>(0)

const steps: TourProps['steps'] = [
  {
    title: '上传文件',
    description: '目前支持.pdf文件',
    target: () => ref1.value && ref1.value.$el,
    nextButtonProps: {
      children: () => h('span', '下一步'),
      onClick: () => {
        isTourOpen.value = false
        currentStep.value = 1
      },
    },
  },
  {
    title: '开始生成',
    description: '点击开始生成按钮，生成完成后可下载文档',
    target: () => ref2.value && ref2.value.$el,
    prevButtonProps: {
      children: () => h('span', '上一步'),
      onClick: () => {
        currentStep.value = 0
      },
    },
    nextButtonProps: {
      children: () => h('span', '下一步'),
      onClick: () => {
        currentStep.value = 2
      },
    },
  },
  {
    title: '下载文件',
    description: '点击下载文件按钮，下载生成的文档',
    target: () => ref3.value && ref3.value.$el,
    prevButtonProps: {
      children: () => h('span', '上一步'),
    },
    nextButtonProps: {
      children: () => h('span', '结束'),
    },
  },
]

onMounted(() => {
  console.log(localStorage.getItem('isFirstUse'))
  if (!localStorage.getItem('isFirstUse')) {
    isTourOpen.value = true
  } else {
    isTourOpen.value = false
  }
})

const handleFinishTour = () => {
  isTourOpen.value = false
  // localStorage.setItem('isFirstUse', 'true')
}

// 当前展示内容
const renderedContent = computed(() => {
  const content = activeOutlineId.value
    ? outlineContents.value[activeOutlineId.value]
    : '### 请选择章节'
  return marked.parse(content || '')
})

const currentOutlineTitle = computed(() => {
  for (const sec of outlineList.value) {
    const sub = sec.sub_sections.find((s) => s.id === activeOutlineId.value)
    if (sub) return sub.sub_section_title
  }
  return ''
})

// 模拟请求加载内容
const fetchSectionContent = async (subSectionId: string) => {
  contentLoading.value = true
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`### ${subSectionId} 内容\n\n这是模拟返回的 Markdown 示例内容。`)
    }, 800)
  })
}

// 事件
const handleSelectSubSection = async (subId: string) => {
  if (activeOutlineId.value === subId) return
  activeOutlineId.value = subId
  if (!outlineContents.value[subId]) {
    const content = await fetchSectionContent(subId)
    outlineContents.value[subId] = content
  }
  contentLoading.value = false
}

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  fileList.value = [file]
  return false
}
const handleRemove: UploadProps['onRemove'] = (file) => {
  fileList.value = fileList.value?.filter((item) => item.uid !== file.uid)
}

const handleChange = async (info: UploadChangeParam) => {
  let resFileList = [...info.fileList]
  resFileList = resFileList.slice(-2)
  fileList.value = resFileList
  isUploading.value = true

  await handleUpload()
}

const handleUpload = () => {
  try {
    const formData = new FormData()
    formData.append('file', fileList.value[0].originFileObj as any)
    formData.append('filecontract', 'null')
    formData.append('filelaw', 'null')
    formData.append('typeDocument', '1')
    formData.append('typeAgentDocument', '1')
    let calcUseTimer = setInterval(() => {
      uploadUseTime.value++
    }, 1000)
    axios
      .post('https://bid.cisetech.com/bidupload', formData)
      .then((res) => {
        console.log(res, '111')
        fileId.value = res.data.data.file_id
        fileList.value = []
        message.success('上传成功.')
        isShowContent.value = true
        isTourOpen.value = true
      })
      .catch((error) => {
        message.error('upload failed.')
        console.log(error)
        isShowContent.value = false
      })
      .finally(() => {
        isUploading.value = false
        clearInterval(calcUseTimer)
        calcUseTimer = null
        uploadUseTime.value = 0
      })
  } catch (error) {
  } finally {
  }
}
const handleReset = () => {
  fileList.value = []
  outlineContents.value = {}
  activeOutlineId.value = null
  message.success('已清空内容')
}
const handleGenerate = async () => {
  isBuilding.value = true
  let buildUseTimer = setInterval(() => {
    buildUseTime.value++
  }, 1000)
  try {
    const { data } = await axios.post(
      'https://bid.cisetech.com/bidgenerate_document',
      {
        file_id: fileId.value,
      }
    )
    exportFileName.value = data.file_name
    console.log(data, 'generate')
  } catch (error) {
  } finally {
    isBuilding.value = false
    clearInterval(buildUseTimer)
    buildUseTimer = null
    buildUseTime.value = 0
  }
}
const downloadOutline = () => {
  if (!outlineList.value.length) {
    message.warning('暂无可下载的大纲内容')
    return
  }
  const combinedMarkdown = outlineList.value
    .map((section) => {
      const subContents = section.sub_sections
        .map((sub) => {
          const content =
            outlineContents.value[sub.id] ||
            `### ${sub.sub_section_title}\n内容暂未生成`
          return `## ${sub.sub_section_title}\n${content}`
        })
        .join('\n\n')
      return `# ${section.section_title}\n${subContents}`
    })
    .join('\n\n')

  const blob = new Blob([combinedMarkdown], {
    type: 'text/markdown;charset=utf-8',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '投标大纲.md'
  link.click()
  window.URL.revokeObjectURL(url)
}

async function handleExportToWord() {
  try {
    // 获取文档内容

    const downloadUrl = `https://bid.cisetech.com/api/download_document?filename=${encodeURIComponent(
      exportFileName.value
    )}`
    window.open(downloadUrl, '_blank')

    message.success('下载成功')
  } catch (error) {
    console.error('下载Word文档失败:', error)
    message.error(`下载失败: ${error.message}`)
  }
}
</script>

<style scoped lang="less">
:deep(.ant-upload-list) {
  display: none;
}
.bid-content :deep(.ant-collapse) {
  border-radius: 0;
  background-color: transparent;
  border: none;
  & .ant-collapse-item {
    border-bottom: 1px solid oklch(96.8% 0.007 247.896);
  }
  & .ant-collapse-content-box {
    padding: 6px;
    ul {
      margin-bottom: 0;
      li {
        display: flex;
        align-items: center;
        font-size: 12px;
      }
      li + li {
        margin-top: 4px;
      }
    }
  }
}
</style>
