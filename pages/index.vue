<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">最新资讯</h1>
        <p class="text-gray-600 mt-2 text-lg">
          {{ filteredFeedItems.length }} 条资讯
          <span v-if="selectedCategory !== 'all'" class="text-blue-600 font-medium">
            · {{ selectedCategory }}
          </span>
        </p>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 视图切换 -->
        <div class="flex bg-gray-200 rounded-xl p-1 shadow-inner">
          <button
            @click="viewMode = 'list'"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="viewMode === 'list' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-700 hover:text-gray-900'"
          >
            列表
          </button>
          <button
            @click="viewMode = 'card'"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="viewMode === 'card' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-700 hover:text-gray-900'"
          >
            卡片
          </button>
        </div>
        
        <!-- 排序选择 -->
        <select
          v-model="sortBy"
          class="input-field px-4 py-2.5 text-sm"
        >
          <option value="publishedAt">发布时间</option>
          <option value="title">标题</option>
          <option value="source">来源</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
      <span class="text-lg text-gray-600 font-medium">正在加载资讯...</span>
    </div>

    <!-- 信息流 -->
    <div v-else>
      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="space-y-6">
        <TransitionGroup name="slide-up" tag="div">
          <article
            v-for="item in sortedFeedItems"
            :key="item.id"
            class="card hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            :class="{ 'border-l-4 border-blue-500': !item.isRead, 'border-gray-200': item.isRead }"
            @click="openFeedItem(item)"
          >
            <div class="flex items-start space-x-6">
              <!-- 文章图片 -->
              <div v-if="item.imageUrl" class="flex-shrink-0">
                <img
                  :src="item.imageUrl"
                  :alt="item.title"
                  class="w-28 h-28 object-cover rounded-lg shadow-sm"
                />
              </div>
              
              <!-- 文章内容 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {{ item.source }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ formatDistanceToNow(item.publishedAt, { locale: zhCN, addSuffix: true }) }}
                  </span>
                  <div v-if="!item.isRead" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                </div>
                
                <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {{ item.title }}
                </h2>
                
                <p class="text-gray-700 text-base line-clamp-3 mb-4">
                  {{ item.content }}
                </p>
                
                <!-- 标签 -->
                <div class="flex items-center space-x-2">
                  <span
                    v-for="tag in item.tags.slice(0, 3)"
                    :key="tag"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
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
                  <BookmarkIcon class="h-6 w-6" />
                </button>
                <button
                  @click.stop="shareItem(item)"
                  class="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <ShareIcon class="h-6 w-6" />
                </button>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TransitionGroup name="slide-up" tag="div" class="contents">
          <article
            v-for="item in sortedFeedItems"
            :key="item.id"
            class="card hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
            :class="{ 'ring-2 ring-blue-500 ring-offset-2': !item.isRead, 'border-gray-200': item.isRead }"
            @click="openFeedItem(item)"
          >
            <!-- 图片 -->
            <div v-if="item.imageUrl" class="aspect-video">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            
            <div class="p-4">
              <!-- 来源和时间 -->
              <div class="flex items-center justify-between mb-2">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {{ item.source }}
                </span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs text-gray-500">
                    {{ formatDistanceToNow(item.publishedAt, { locale: zhCN, addSuffix: true }) }}
                  </span>
                  <div v-if="!item.isRead" class="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              <!-- 标题 -->
              <h2 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {{ item.title }}
              </h2>
              
              <!-- 内容摘要 -->
              <p class="text-gray-700 text-sm line-clamp-3 mb-3">
                {{ item.content }}
              </p>
              
              <!-- 标签和操作 -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-1">
                  <span
                    v-for="tag in item.tags.slice(0, 2)"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click.stop="toggleBookmark(item.id)"
                    class="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                  >
                    <BookmarkIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click.stop="shareItem(item)"
                    class="p-1.5 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <ShareIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredFeedItems.length === 0" class="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
        <div class="w-32 h-32 mx-auto mb-6 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">暂无资讯</h3>
        <p class="text-gray-600 mb-6 text-base">
          {{ selectedCategory === 'all' ? '还没有任何资讯内容，尝试刷新或添加新的信息源' : `${selectedCategory} 分类下暂无内容` }}
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
    <div v-if="filteredFeedItems.length > 0" class="mt-12 text-center">
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
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative transform transition-all duration-300 scale-95 opacity-0"
        :class="{ 'scale-100 opacity-100': selectedItem }"
        @click.stop
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <div class="flex items-center space-x-3 mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            {{ selectedItem.source }}
          </span>
          <span class="text-sm text-gray-500">
            {{ formatDistanceToNow(selectedItem.publishedAt, { locale: zhCN, addSuffix: true }) }}
          </span>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ selectedItem.title }}</h1>
        
        <div v-if="selectedItem.imageUrl" class="mb-6">
          <img
            :src="selectedItem.imageUrl"
            :alt="selectedItem.title"
            class="w-full h-72 object-cover rounded-lg shadow-md"
          />
        </div>
        
        <div class="prose max-w-none mb-6 text-gray-700 text-base leading-relaxed">
          <p>{{ selectedItem.content }}</p>
        </div>
        
        <div class="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center space-x-2 mb-2 sm:mb-0">
            <span
              v-for="tag in selectedItem.tags"
              :key="tag"
              class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
            >
              #{{ tag }}
            </span>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              v-if="selectedItem.url"
              @click="openOriginalLink(selectedItem.url)"
              class="btn-secondary text-base"
            >
              查看原文
            </button>
            <button
              @click="shareItem(selectedItem)"
              class="btn-primary text-base"
            >
              分享
            </button>
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
