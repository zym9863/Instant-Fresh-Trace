<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo和标题 -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-9 h-9 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span class="text-white font-bold text-base">鲜</span>
              </div>
              <span class="text-2xl font-extrabold text-gradient">即刻鲜踪</span>
            </NuxtLink>
          </div>

          <!-- 搜索框 -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索资讯内容..."
                class="input-field pl-10"
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- 右侧操作区 -->
          <div class="flex items-center space-x-4">
            <!-- 刷新按钮 -->
            <button
              @click="refreshFeeds"
              :disabled="loading"
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              :class="{ 'animate-spin': loading }"
            >
              <ArrowPathIcon class="h-6 w-6" />
            </button>

            <!-- 通知按钮 -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 relative"
              >
                <BellIcon class="h-6 w-6" />
                <span
                  v-if="unreadNotifications.length > 0"
                  class="notification-badge"
                >
                  {{ unreadNotifications.length > 9 ? '9+' : unreadNotifications.length }}
                </span>
              </button>

              <!-- 通知下拉菜单 -->
              <Transition name="fade">
                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                >
                  <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900">通知</h3>
                      <button
                        v-if="unreadNotifications.length > 0"
                        @click="markAllNotificationsAsRead"
                        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        全部标记为已读
                      </button>
                    </div>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                      暂无通知
                    </div>
                    <div
                      v-for="notification in notifications.slice(0, 10)"
                      :key="notification.id"
                      class="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                      :class="{ 'bg-blue-50': !notification.isRead }"
                      @click="markNotificationAsRead(notification.id)"
                    >
                      <div class="flex items-start space-x-3">
                        <div
                          class="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-2"
                          :class="{
                            'bg-blue-500': notification.type === 'info',
                            'bg-green-500': notification.type === 'success',
                            'bg-yellow-500': notification.type === 'warning',
                            'bg-red-500': notification.type === 'error'
                          }"
                        ></div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                          <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                          <p class="text-xs text-gray-400 mt-1">
                            {{ formatDistanceToNow(notification.createdAt, { locale: zhCN, addSuffix: true }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- 用户菜单 -->
            <div class="flex items-center space-x-2 bg-gray-100 rounded-full py-1.5 pl-2 pr-3 cursor-pointer hover:bg-gray-200 transition-colors duration-200">
              <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <UserIcon class="h-5 w-5 text-blue-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ currentUser.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-lg min-h-screen">
        <div class="p-6">
          <!-- 分类过滤 -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">分类</h3>
            <ul class="space-y-2">
              <li>
                <button
                  @click="setSelectedCategory('all')"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  :class="selectedCategory === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <div class="flex items-center justify-between">
                    <span>全部</span>
                    <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {{ feedItems.length }}
                    </span>
                  </div>
                </button>
              </li>
              <li v-for="category in categoriesWithCounts" :key="category.name">
                <button
                  @click="setSelectedCategory(category.name)"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  :class="selectedCategory === category.name ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {{ category.count }}
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <!-- 信息源管理 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900">信息源</h3>
              <NuxtLink
                to="/sources"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                管理
              </NuxtLink>
            </div>
            <ul class="space-y-2">
              <li v-for="source in feedSources.slice(0, 5)" :key="source.id">
                <div class="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <span class="text-lg">{{ source.icon || '📰' }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ source.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ formatDistanceToNow(source.lastUpdated, { locale: zhCN, addSuffix: true }) }}
                    </p>
                  </div>
                  <div
                    class="w-2.5 h-2.5 rounded-full"
                    :class="source.isActive ? 'bg-green-500' : 'bg-gray-300'"
                  ></div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 订阅管理 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900">我的订阅</h3>
              <NuxtLink
                to="/subscriptions"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                管理
              </NuxtLink>
            </div>
            <div class="text-sm text-gray-600">
              {{ activeSubscriptions.length }} 个活跃订阅
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <!-- 点击外部关闭通知菜单 -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 z-40"
      @click="showNotifications = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFeedsStore } from '~/stores/feeds'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  MagnifyingGlassIcon,
  BellIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const feedsStore = useFeedsStore()
const {
  feedItems,
  feedSources,
  notifications,
  unreadNotifications,
  categoriesWithCounts,
  activeSubscriptions,
  selectedCategory,
  searchQuery,
  loading,
  currentUser
} = storeToRefs(feedsStore)

const {
  setSelectedCategory,
  setSearchQuery,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  refreshFeeds
} = feedsStore

const showNotifications = ref(false)

const handleSearch = useDebounceFn(() => {
  setSearchQuery(searchQuery.value)
}, 300)

// 初始化数据
onMounted(() => {
  feedsStore.initializeMockData()
})
</script>
