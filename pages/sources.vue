<template>
  <div class="max-w-6xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">信息源管理</h1>
        <p class="text-gray-600 mt-1">管理您的信息来源，添加或编辑订阅源</p>
      </div>
      
      <button
        @click="showAddModal = true"
        class="btn-primary"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        添加信息源
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <GlobeAltIcon class="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总信息源</p>
            <p class="text-2xl font-bold text-gray-900">{{ feedSources.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">活跃源</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeSources.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">今日更新</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayUpdatedSources.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TagIcon class="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">分类数</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueCategories.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 过滤和搜索 -->
    <div class="flex items-center space-x-4 mb-6">
      <div class="flex-1">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索信息源..."
            class="input-field pl-10"
          />
        </div>
      </div>
      
      <select
        v-model="selectedCategory"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">所有分类</option>
        <option v-for="category in uniqueCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      
      <select
        v-model="statusFilter"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">所有状态</option>
        <option value="active">活跃</option>
        <option value="inactive">停用</option>
      </select>
    </div>

    <!-- 信息源列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">信息源列表</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                信息源
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后更新
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="source in filteredSources" :key="source.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span class="text-lg">{{ source.icon || '📰' }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ source.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ source.url }}</div>
                    <div v-if="source.description" class="text-xs text-gray-400 mt-1">
                      {{ source.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ source.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-2 h-2 rounded-full mr-2"
                    :class="source.isActive ? 'bg-green-500' : 'bg-gray-300'"
                  ></div>
                  <span class="text-sm text-gray-900">
                    {{ source.isActive ? '活跃' : '停用' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDistanceToNow(source.lastUpdated, { locale: zhCN, addSuffix: true }) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="editSource(source)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    编辑
                  </button>
                  <button
                    @click="toggleSourceStatus(source.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                  >
                    {{ source.isActive ? '停用' : '启用' }}
                  </button>
                  <button
                    @click="deleteSource(source.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredSources.length === 0" class="text-center py-12">
        <GlobeAltIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">没有找到信息源</h3>
        <p class="mt-1 text-sm text-gray-500">开始添加您的第一个信息源吧</p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="btn-primary"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            添加信息源
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加/编辑信息源模态框 -->
  <Teleport to="body">
    <div
      v-if="showAddModal || editingSource"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
        
        <div
          class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingSource ? '编辑信息源' : '添加信息源' }}
            </h3>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveSource" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <input
                v-model="sourceForm.name"
                type="text"
                required
                class="input-field"
                placeholder="输入信息源名称"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                v-model="sourceForm.url"
                type="url"
                required
                class="input-field"
                placeholder="https://example.com/feed"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <input
                v-model="sourceForm.category"
                type="text"
                required
                class="input-field"
                placeholder="如：科技、财经、体育"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                v-model="sourceForm.description"
                rows="3"
                class="input-field"
                placeholder="简要描述这个信息源"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">图标</label>
              <input
                v-model="sourceForm.icon"
                type="text"
                class="input-field"
                placeholder="输入一个emoji作为图标"
              />
            </div>
            
            <div class="flex items-center">
              <input
                v-model="sourceForm.isActive"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                启用此信息源
              </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                {{ editingSource ? '更新' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedsStore, type FeedSource } from '~/stores/feeds'
import { formatDistanceToNow, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  PlusIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const feedsStore = useFeedsStore()
const { feedSources } = storeToRefs(feedsStore)
const { addFeedSource, updateFeedSource, removeFeedSource } = feedsStore

// 页面状态
const searchQuery = ref('')
const selectedCategory = ref('all')
const statusFilter = ref('all')
const showAddModal = ref(false)
const editingSource = ref<FeedSource | null>(null)

// 表单数据
const sourceForm = reactive({
  name: '',
  url: '',
  category: '',
  description: '',
  icon: '',
  isActive: true
})

// 计算属性
const activeSources = computed(() => 
  feedSources.value.filter(source => source.isActive)
)

const todayUpdatedSources = computed(() => 
  feedSources.value.filter(source => isToday(source.lastUpdated))
)

const uniqueCategories = computed(() => 
  [...new Set(feedSources.value.map(source => source.category))]
)

const filteredSources = computed(() => {
  let sources = feedSources.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    sources = sources.filter(source => 
      source.name.toLowerCase().includes(query) ||
      source.url.toLowerCase().includes(query) ||
      source.category.toLowerCase().includes(query)
    )
  }
  
  // 分类过滤
  if (selectedCategory.value !== 'all') {
    sources = sources.filter(source => source.category === selectedCategory.value)
  }
  
  // 状态过滤
  if (statusFilter.value !== 'all') {
    sources = sources.filter(source => 
      statusFilter.value === 'active' ? source.isActive : !source.isActive
    )
  }
  
  return sources
})

// 方法
const editSource = (source: FeedSource) => {
  editingSource.value = source
  Object.assign(sourceForm, {
    name: source.name,
    url: source.url,
    category: source.category,
    description: source.description || '',
    icon: source.icon || '',
    isActive: source.isActive
  })
}

const closeModal = () => {
  showAddModal.value = false
  editingSource.value = null
  Object.assign(sourceForm, {
    name: '',
    url: '',
    category: '',
    description: '',
    icon: '',
    isActive: true
  })
}

const saveSource = () => {
  if (editingSource.value) {
    // 更新现有信息源
    updateFeedSource(editingSource.value.id, {
      name: sourceForm.name,
      url: sourceForm.url,
      category: sourceForm.category,
      description: sourceForm.description,
      icon: sourceForm.icon,
      isActive: sourceForm.isActive
    })
  } else {
    // 添加新信息源
    addFeedSource({
      name: sourceForm.name,
      url: sourceForm.url,
      category: sourceForm.category,
      description: sourceForm.description,
      icon: sourceForm.icon,
      isActive: sourceForm.isActive
    })
  }
  
  closeModal()
}

const toggleSourceStatus = (sourceId: string) => {
  const source = feedSources.value.find(s => s.id === sourceId)
  if (source) {
    updateFeedSource(sourceId, { isActive: !source.isActive })
  }
}

const deleteSource = (sourceId: string) => {
  if (confirm('确定要删除这个信息源吗？')) {
    removeFeedSource(sourceId)
  }
}

// 设置页面标题
useHead({
  title: '信息源管理 - 即刻鲜踪'
})
</script>