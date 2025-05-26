<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">最新资讯</h1>
        <p class="text-gray-600 mt-1">
          {{ filteredFeedItems.length }} 条资讯
          <span v-if="selectedCategory !== 'all'" class="text-blue-600">
            · {{ selectedCategory }}
          </span>
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- 视图切换 -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'list'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            :class="viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            列表
          </button>
          <button
            @click="viewMode = 'card'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            :class="viewMode === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            卡片
          </button>
        </div>
        
        <!-- 排序选择 -->
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="publishedAt">发布时间</option>
          <option value="title">标题</option>
          <option value="source">来源</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">正在加载...</span>
    </div>

    <!-- 信息流 -->
    <div v-else>
      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="space-y-4">
        <TransitionGroup name="slide-up" tag="div">
          <article
            v-for="item in sortedFeedItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            :class="{ 'border-l-4 border-l-blue-500': !item.isRead }"
            @click="openFeedItem(item)"
          >
            <div class="p-6">
              <div class="flex items-start space-x-4">
                <!-- 文章图片 -->
                <div v-if="item.imageUrl" class="flex-shrink-0">
                  <img
                    :src="item.imageUrl"
                    :alt="item.title"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                
                <!-- 文章内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ item.source }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDistanceToNow(item.publishedAt, { locale: zhCN, addSuffix: true }) }}
                    </span>
                    <div v-if="!item.isRead" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  
                  <h2 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {{ item.title }}
                  </h2>
                  
                  <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                    {{ item.content }}
                  </p>
                  
                  <!-- 标签 -->
                  <div class="flex items-center space-x-2">
                    <span
                      v-for="tag in item.tags.slice(0, 3)"
                      :key="tag"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="flex-shrink-0 flex flex-col space-y-2">
                  <button
                    @click.stop="toggleBookmark(item.id)"
                    class="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                  >
                    <BookmarkIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click.stop="shareItem(item)"
                    class="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <ShareIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransitionGroup name="slide-up" tag="div" class="contents">
          <article
            v-for="item in sortedFeedItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
            :class="{ 'ring-2 ring-blue-500': !item.isRead }"
            @click="openFeedItem(item)"
          >
            <!-- 图片 -->
            <div v-if="item.imageUrl" class="aspect-video">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="p-4">
              <!-- 来源和时间 -->
              <div class="flex items-center justify-between mb-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ item.source }}
                </span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs text-gray-500">
                    {{ formatDistanceToNow(item.publishedAt, { locale: zhCN, addSuffix: true }) }}
                  </span>
                  <div v-if="!item.isRead" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              <!-- 标题 -->
              <h2 class="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                {{ item.title }}
              </h2>
              
              <!-- 内容摘要 -->
              <p class="text-gray-600 text-sm line-clamp-3 mb-3">
                {{ item.content }}
              </p>
              
              <!-- 标签和操作 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                  <span
                    v-for="tag in item.tags.slice(0, 2)"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-1">
                  <button
                    @click.stop="toggleBookmark(item.id)"
                    class="p-1 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                  >
                    <BookmarkIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click.stop="shareItem(item)"
                    class="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <ShareIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredFeedItems.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无资讯</h3>
        <p class="text-gray-600 mb-4">
          {{ selectedCategory === 'all' ? '还没有任何资讯内容' : `${selectedCategory} 分类下暂无内容` }}
        </p>
        <button
          @click="refreshFeeds"
          class="btn-primary"
        >
          刷新内容
        </button>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="filteredFeedItems.length > 0" class="mt-8 text-center">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="btn-secondary"
      >
        <span v-if="loadingMore">加载中...</span>
        <span v-else>加载更多</span>
      </button>
    </div>
  </div>

  <!-- 文章详情模态框 -->
  <Teleport to="body">
    <div
      v-if="selectedItem"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
        
        <div
          class="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ selectedItem.source }}
              </span>
              <span class="text-sm text-gray-500">
                {{ formatDistanceToNow(selectedItem.publishedAt, { locale: zhCN, addSuffix: true }) }}
              </span>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <h1 class="text-xl font-bold text-gray-900 mb-4">{{ selectedItem.title }}</h1>
          
          <div v-if="selectedItem.imageUrl" class="mb-4">
            <img
              :src="selectedItem.imageUrl"
              :alt="selectedItem.title"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div class="prose max-w-none mb-6">
            <p class="text-gray-700 leading-relaxed">{{ selectedItem.content }}</p>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <span
                v-for="tag in selectedItem.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{{ tag }}
              </span>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                v-if="selectedItem.url"
                @click="openOriginalLink(selectedItem.url)"
                class="btn-secondary text-sm"
              >
                查看原文
              </button>
              <button
                @click="shareItem(selectedItem)"
                class="btn-primary text-sm"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedsStore, type FeedItem } from '~/stores/feeds'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  BookmarkIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const feedsStore = useFeedsStore()
const {
  filteredFeedItems,
  selectedCategory,
  loading
} = storeToRefs(feedsStore)

const {
  markAsRead,
  refreshFeeds
} = feedsStore

// 页面状态
const viewMode = ref<'list' | 'card'>('list')
const sortBy = ref('publishedAt')
const selectedItem = ref<FeedItem | null>(null)
const loadingMore = ref(false)

// 排序后的信息流
const sortedFeedItems = computed(() => {
  const items = [...filteredFeedItems.value]
  
  switch (sortBy.value) {
    case 'title':
      return items.sort((a, b) => a.title.localeCompare(b.title))
    case 'source':
      return items.sort((a, b) => a.source.localeCompare(b.source))
    case 'publishedAt':
    default:
      return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
})

// 打开文章详情
const openFeedItem = (item: FeedItem) => {
  selectedItem.value = item
  markAsRead(item.id)
}

// 关闭模态框
const closeModal = () => {
  selectedItem.value = null
}

// 切换书签
const toggleBookmark = (itemId: string) => {
  // TODO: 实现书签功能
  console.log('Toggle bookmark for item:', itemId)
}

// 分享文章
const shareItem = (item: FeedItem) => {
  if (navigator.share) {
    navigator.share({
      title: item.title,
      text: item.content,
      url: item.url || window.location.href
    })
  } else {
    // 复制到剪贴板
    const text = `${item.title}\n${item.content}\n${item.url || window.location.href}`
    navigator.clipboard.writeText(text)
    // TODO: 显示复制成功提示
  }
}

// 打开原文链接
const openOriginalLink = (url: string) => {
  window.open(url, '_blank')
}

// 加载更多
const loadMore = async () => {
  loadingMore.value = true
  // TODO: 实现分页加载
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadingMore.value = false
}

// 设置页面标题
useHead({
  title: '首页 - 即刻鲜踪'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  line-height: 1.7;
}
</style>