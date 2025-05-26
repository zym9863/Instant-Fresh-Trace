import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export interface FeedItem {
  id: string
  title: string
  content: string
  source: string
  category: string
  publishedAt: Date
  url?: string
  imageUrl?: string
  isRead: boolean
  tags: string[]
}

export interface FeedSource {
  id: string
  name: string
  url: string
  category: string
  isActive: boolean
  lastUpdated: Date
  description?: string
  icon?: string
}

export interface Subscription {
  id: string
  userId: string
  sourceId: string
  keywords: string[]
  categories: string[]
  isActive: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: Date
  feedItemId?: string
}

export const useFeedsStore = defineStore('feeds', {
  state: () => ({
    feedItems: [] as FeedItem[],
    feedSources: [] as FeedSource[],
    subscriptions: [] as Subscription[],
    notifications: [] as Notification[],
    loading: false,
    selectedCategory: 'all',
    searchQuery: '',
    currentUser: {
      id: 'user-1',
      name: '用户',
      email: 'user@example.com'
    }
  }),

  getters: {
    filteredFeedItems: (state) => {
      let items = state.feedItems
      
      if (state.selectedCategory !== 'all') {
        items = items.filter(item => item.category === state.selectedCategory)
      }
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        items = items.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    },
    
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.isRead)
    },
    
    categoriesWithCounts: (state) => {
      const counts = state.feedItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(counts).map(([category, count]) => ({
        name: category,
        count
      }))
    },
    
    activeSubscriptions: (state) => {
      return state.subscriptions.filter(sub => sub.isActive)
    }
  },

  actions: {
    // 初始化模拟数据
    async initializeMockData() {
      this.loading = true
      
      // 模拟信息源
      this.feedSources = [
        {
          id: uuidv4(),
          name: '科技资讯',
          url: 'https://tech-news.example.com',
          category: '科技',
          isActive: true,
          lastUpdated: new Date(),
          description: '最新科技动态和产品发布',
          icon: '🔬'
        },
        {
          id: uuidv4(),
          name: '财经新闻',
          url: 'https://finance-news.example.com',
          category: '财经',
          isActive: true,
          lastUpdated: new Date(),
          description: '金融市场和经济动态',
          icon: '💰'
        },
        {
          id: uuidv4(),
          name: '体育快讯',
          url: 'https://sports-news.example.com',
          category: '体育',
          isActive: true,
          lastUpdated: new Date(),
          description: '体育赛事和运动资讯',
          icon: '⚽'
        }
      ]
      
      // 模拟信息条目
      this.feedItems = [
        {
          id: uuidv4(),
          title: 'AI技术突破：新一代语言模型发布',
          content: '最新发布的AI语言模型在多项基准测试中取得突破性进展，展现出更强的理解和生成能力...',
          source: '科技资讯',
          category: '科技',
          publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
          url: 'https://example.com/ai-breakthrough',
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
          isRead: false,
          tags: ['AI', '人工智能', '技术']
        },
        {
          id: uuidv4(),
          title: '全球股市今日收盘情况',
          content: '今日全球主要股指表现良好，科技股领涨，投资者对经济前景保持乐观态度...',
          source: '财经新闻',
          category: '财经',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60), // 1小时前
          url: 'https://example.com/stock-market',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
          isRead: false,
          tags: ['股市', '投资', '经济']
        },
        {
          id: uuidv4(),
          title: '世界杯预选赛精彩回顾',
          content: '昨晚进行的世界杯预选赛中，多支强队展现出色表现，为球迷奉献了精彩的比赛...',
          source: '体育快讯',
          category: '体育',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
          url: 'https://example.com/world-cup',
          imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
          isRead: true,
          tags: ['足球', '世界杯', '体育']
        }
      ]
      
      // 模拟订阅
      this.subscriptions = [
        {
          id: uuidv4(),
          userId: this.currentUser.id,
          sourceId: this.feedSources[0].id,
          keywords: ['AI', '人工智能'],
          categories: ['科技'],
          isActive: true,
          createdAt: new Date()
        }
      ]
      
      // 模拟通知
      this.notifications = [
        {
          id: uuidv4(),
          title: '新内容提醒',
          message: '您关注的科技资讯有新更新',
          type: 'info',
          isRead: false,
          createdAt: new Date(),
          feedItemId: this.feedItems[0].id
        }
      ]
      
      this.loading = false
    },
    
    // 添加信息源
    addFeedSource(source: Omit<FeedSource, 'id' | 'lastUpdated'>) {
      const newSource: FeedSource = {
        ...source,
        id: uuidv4(),
        lastUpdated: new Date()
      }
      this.feedSources.push(newSource)
    },
    
    // 更新信息源
    updateFeedSource(id: string, updates: Partial<FeedSource>) {
      const index = this.feedSources.findIndex(source => source.id === id)
      if (index !== -1) {
        this.feedSources[index] = { ...this.feedSources[index], ...updates }
      }
    },
    
    // 删除信息源
    removeFeedSource(id: string) {
      this.feedSources = this.feedSources.filter(source => source.id !== id)
    },
    
    // 添加订阅
    addSubscription(subscription: Omit<Subscription, 'id' | 'createdAt'>) {
      const newSubscription: Subscription = {
        ...subscription,
        id: uuidv4(),
        createdAt: new Date()
      }
      this.subscriptions.push(newSubscription)
    },
    
    // 更新订阅
    updateSubscription(id: string, updates: Partial<Subscription>) {
      const index = this.subscriptions.findIndex(sub => sub.id === id)
      if (index !== -1) {
        this.subscriptions[index] = { ...this.subscriptions[index], ...updates }
      }
    },
    
    // 删除订阅
    removeSubscription(id: string) {
      this.subscriptions = this.subscriptions.filter(sub => sub.id !== id)
    },
    
    // 标记信息为已读
    markAsRead(itemId: string) {
      const item = this.feedItems.find(item => item.id === itemId)
      if (item) {
        item.isRead = true
      }
    },
    
    // 标记通知为已读
    markNotificationAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.isRead = true
      }
    },
    
    // 标记所有通知为已读
    markAllNotificationsAsRead() {
      this.notifications.forEach(notification => {
        notification.isRead = true
      })
    },
    
    // 添加通知
    addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
      const newNotification: Notification = {
        ...notification,
        id: uuidv4(),
        createdAt: new Date()
      }
      this.notifications.unshift(newNotification)
    },
    
    // 设置分类过滤
    setSelectedCategory(category: string) {
      this.selectedCategory = category
    },
    
    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    
    // 刷新信息源（模拟）
    async refreshFeeds() {
      this.loading = true
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟添加新的信息条目
      const newItem: FeedItem = {
        id: uuidv4(),
        title: `最新资讯 - ${format(new Date(), 'HH:mm', { locale: zhCN })}`,
        content: '这是一条刚刚更新的最新资讯内容...',
        source: '科技资讯',
        category: '科技',
        publishedAt: new Date(),
        isRead: false,
        tags: ['最新', '实时']
      }
      
      this.feedItems.unshift(newItem)
      
      // 添加通知
      this.addNotification({
        title: '内容更新',
        message: '发现新的资讯内容',
        type: 'success',
        isRead: false,
        feedItemId: newItem.id
      })
      
      this.loading = false
    }
  }
})