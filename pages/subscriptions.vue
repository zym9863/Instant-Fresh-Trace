<template>
  <div class="max-w-6xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">订阅管理</h1>
        <p class="text-gray-600 mt-1">管理您的个性化订阅，设置关键词和分类过滤</p>
      </div>
      
      <button
        @click="showAddModal = true"
        class="btn-primary"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        新建订阅
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookmarkIcon class="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总订阅</p>
            <p class="text-2xl font-bold text-gray-900">{{ subscriptions.length }}</p>
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
            <p class="text-sm font-medium text-gray-600">活跃订阅</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeSubscriptions.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BellIcon class="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">今日通知</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayNotifications }}</p>
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
            <p class="text-sm font-medium text-gray-600">关键词</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalKeywords }}</p>
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
            placeholder="搜索订阅..."
            class="input-field pl-10"
          />
        </div>
      </div>
      
      <select
        v-model="statusFilter"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">所有状态</option>
        <option value="active">活跃</option>
        <option value="inactive">停用</option>
      </select>
    </div>

    <!-- 订阅列表 -->
    <div class="space-y-4">
      <TransitionGroup name="slide-up" tag="div">
        <div
          v-for="subscription in filteredSubscriptions"
          :key="subscription.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- 订阅信息 -->
                <div class="flex items-center space-x-3 mb-3">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="subscription.isActive ? 'bg-green-500' : 'bg-gray-300'"
                  ></div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ getSourceName(subscription.sourceId) }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ subscription.isActive ? '活跃' : '停用' }}
                  </span>
                </div>
                
                <!-- 关键词 -->
                <div v-if="subscription.keywords.length > 0" class="mb-3">
                  <p class="text-sm font-medium text-gray-700 mb-2">关键词：</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="keyword in subscription.keywords"
                      :key="keyword"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ keyword }}
                    </span>
                  </div>
                </div>
                
                <!-- 分类 -->
                <div v-if="subscription.categories.length > 0" class="mb-3">
                  <p class="text-sm font-medium text-gray-700 mb-2">关注分类：</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="category in subscription.categories"
                      :key="category"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {{ category }}
                    </span>
                  </div>
                </div>
                
                <!-- 创建时间 -->
                <p class="text-sm text-gray-500">
                  创建于 {{ formatDistanceToNow(subscription.createdAt, { locale: zhCN, addSuffix: true }) }}
                </p>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="editSubscription(subscription)"
                  class="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  title="编辑"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="toggleSubscriptionStatus(subscription.id)"
                  class="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                  :title="subscription.isActive ? '停用' : '启用'"
                >
                  <component :is="subscription.isActive ? PauseIcon : PlayIcon" class="h-5 w-5" />
                </button>
                <button
                  @click="deleteSubscription(subscription.id)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="删除"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- 匹配统计 -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">
                  本周匹配内容：<span class="font-medium text-gray-900">{{ getMatchCount(subscription.id) }}</span> 条
                </span>
                <button
                  @click="viewMatches(subscription.id)"
                  class="text-blue-600 hover:text-blue-700 font-medium"
                >
                  查看匹配内容
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
      
      <!-- 空状态 -->
      <div v-if="filteredSubscriptions.length === 0" class="text-center py-12">
        <BookmarkIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">没有找到订阅</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ subscriptions.length === 0 ? '创建您的第一个个性化订阅' : '尝试调整搜索条件' }}
        </p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="btn-primary"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            新建订阅
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加/编辑订阅模态框 -->
  <Teleport to="body">
    <div
      v-if="showAddModal || editingSubscription"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
        
        <div
          class="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingSubscription ? '编辑订阅' : '新建订阅' }}
            </h3>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="saveSubscription" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">选择信息源</label>
              <select
                v-model="subscriptionForm.sourceId"
                required
                class="input-field"
              >
                <option value="">请选择信息源</option>
                <option
                  v-for="source in feedSources.filter(s => s.isActive)"
                  :key="source.id"
                  :value="source.id"
                >
                  {{ source.name }} ({{ source.category }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">关键词</label>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    v-model="newKeyword"
                    type="text"
                    class="flex-1 input-field"
                    placeholder="输入关键词"
                    @keyup.enter="addKeyword"
                  />
                  <button
                    type="button"
                    @click="addKeyword"
                    class="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                <div v-if="subscriptionForm.keywords.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="(keyword, index) in subscriptionForm.keywords"
                    :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ keyword }}
                    <button
                      type="button"
                      @click="removeKeyword(index)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">关注分类</label>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <input
                    v-model="newCategory"
                    type="text"
                    class="flex-1 input-field"
                    placeholder="输入分类名称"
                    @keyup.enter="addCategory"
                  />
                  <button
                    type="button"
                    @click="addCategory"
                    class="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                <div v-if="subscriptionForm.categories.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="(category, index) in subscriptionForm.categories"
                    :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {{ category }}
                    <button
                      type="button"
                      @click="removeCategory(index)"
                      class="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      <XMarkIcon class="h-3 w-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <input
                v-model="subscriptionForm.isActive"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                启用此订阅
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
                {{ editingSubscription ? '更新' : '创建' }}
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
import { useFeedsStore, type Subscription } from '~/stores/feeds'
import { formatDistanceToNow, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  PlusIcon,
  BookmarkIcon,
  CheckCircleIcon,
  BellIcon,
  TagIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/vue/24/outline'

const feedsStore = useFeedsStore()
const { subscriptions, feedSources, notifications, currentUser } = storeToRefs(feedsStore)
const { addSubscription, updateSubscription, removeSubscription } = feedsStore

// 页面状态
const searchQuery = ref('')
const statusFilter = ref('all')
const showAddModal = ref(false)
const editingSubscription = ref<Subscription | null>(null)
const newKeyword = ref('')
const newCategory = ref('')

// 表单数据
const subscriptionForm = reactive({
  sourceId: '',
  keywords: [] as string[],
  categories: [] as string[],
  isActive: true
})

// 计算属性
const activeSubscriptions = computed(() => 
  subscriptions.value.filter(sub => sub.isActive)
)

const todayNotifications = computed(() => 
  notifications.value.filter(n => isToday(n.createdAt)).length
)

const totalKeywords = computed(() => 
  subscriptions.value.reduce((total, sub) => total + sub.keywords.length, 0)
)

const filteredSubscriptions = computed(() => {
  let subs = subscriptions.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    subs = subs.filter(sub => {
      const sourceName = getSourceName(sub.sourceId).toLowerCase()
      const keywords = sub.keywords.join(' ').toLowerCase()
      const categories = sub.categories.join(' ').toLowerCase()
      return sourceName.includes(query) || keywords.includes(query) || categories.includes(query)
    })
  }
  
  // 状态过滤
  if (statusFilter.value !== 'all') {
    subs = subs.filter(sub => 
      statusFilter.value === 'active' ? sub.isActive : !sub.isActive
    )
  }
  
  return subs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// 方法
const getSourceName = (sourceId: string) => {
  const source = feedSources.value.find(s => s.id === sourceId)
  return source ? source.name : '未知来源'
}

const getMatchCount = (subscriptionId: string) => {
  // 模拟匹配计数
  return Math.floor(Math.random() * 20) + 1
}

const viewMatches = (subscriptionId: string) => {
  // TODO: 导航到匹配内容页面
  console.log('View matches for subscription:', subscriptionId)
}

const editSubscription = (subscription: Subscription) => {
  editingSubscription.value = subscription
  Object.assign(subscriptionForm, {
    sourceId: subscription.sourceId,
    keywords: [...subscription.keywords],
    categories: [...subscription.categories],
    isActive: subscription.isActive
  })
}

const closeModal = () => {
  showAddModal.value = false
  editingSubscription.value = null
  Object.assign(subscriptionForm, {
    sourceId: '',
    keywords: [],
    categories: [],
    isActive: true
  })
  newKeyword.value = ''
  newCategory.value = ''
}

const addKeyword = () => {
  if (newKeyword.value.trim() && !subscriptionForm.keywords.includes(newKeyword.value.trim())) {
    subscriptionForm.keywords.push(newKeyword.value.trim())
    newKeyword.value = ''
  }
}

const removeKeyword = (index: number) => {
  subscriptionForm.keywords.splice(index, 1)
}

const addCategory = () => {
  if (newCategory.value.trim() && !subscriptionForm.categories.includes(newCategory.value.trim())) {
    subscriptionForm.categories.push(newCategory.value.trim())
    newCategory.value = ''
  }
}

const removeCategory = (index: number) => {
  subscriptionForm.categories.splice(index, 1)
}

const saveSubscription = () => {
  if (editingSubscription.value) {
    // 更新现有订阅
    updateSubscription(editingSubscription.value.id, {
      sourceId: subscriptionForm.sourceId,
      keywords: subscriptionForm.keywords,
      categories: subscriptionForm.categories,
      isActive: subscriptionForm.isActive
    })
  } else {
    // 添加新订阅
    addSubscription({
      userId: currentUser.value.id,
      sourceId: subscriptionForm.sourceId,
      keywords: subscriptionForm.keywords,
      categories: subscriptionForm.categories,
      isActive: subscriptionForm.isActive
    })
  }
  
  closeModal()
}

const toggleSubscriptionStatus = (subscriptionId: string) => {
  const subscription = subscriptions.value.find(s => s.id === subscriptionId)
  if (subscription) {
    updateSubscription(subscriptionId, { isActive: !subscription.isActive })
  }
}

const deleteSubscription = (subscriptionId: string) => {
  if (confirm('确定要删除这个订阅吗？')) {
    removeSubscription(subscriptionId)
  }
}

// 设置页面标题
useHead({
  title: '订阅管理 - 即刻鲜踪'
})
</script>