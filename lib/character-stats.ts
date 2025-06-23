// 角色统计数据管理系统

interface CharacterStats {
  id: string
  likes: number
  chats: number
  views: number
  lastUpdated: number
  createdAt: string
  isPrivate: boolean
}

interface TimerInfo {
  characterId: string
  timerId: NodeJS.Timeout
  interval: number
}

class CharacterStatsManager {
  private activeTimers: Map<string, TimerInfo> = new Map()
  private isInitialized = false

  // 初始化统计管理器
  init() {
    if (this.isInitialized || typeof window === 'undefined') return
    
    this.isInitialized = true
    this.loadExistingTimers()
    
    // 监听角色创建事件
    window.addEventListener('characterCreated', this.handleCharacterCreated.bind(this))
    
    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', this.cleanup.bind(this))
  }

  // 处理新角色创建
  private handleCharacterCreated(event: any) {
    const character = event.detail
    if (!character.isPrivate) {
      this.startStatsGrowth(character.id)
    }
  }

  // 加载现有的公开角色并启动定时器
  private loadExistingTimers() {
    try {
      const publicCharacters = JSON.parse(localStorage.getItem('publicCharacters') || '[]')
      
      publicCharacters.forEach((character: any) => {
        if (!character.isPrivate && !this.activeTimers.has(character.id)) {
          this.startStatsGrowth(character.id)
        }
      })
    } catch (error) {
      console.error('Error loading existing timers:', error)
    }
  }

  // 启动角色统计增长
  startStatsGrowth(characterId: string) {
    if (this.activeTimers.has(characterId)) {
      return // 已经存在定时器
    }

    // 随机间隔：30秒到90秒
    const interval = 30000 + Math.random() * 60000
    
    const timerId = setInterval(() => {
      this.updateCharacterStats(characterId)
    }, interval)

    this.activeTimers.set(characterId, {
      characterId,
      timerId,
      interval
    })

    console.log(`Started stats growth for character ${characterId} with interval ${Math.round(interval/1000)}s`)
  }

  // 停止角色统计增长
  stopStatsGrowth(characterId: string) {
    const timerInfo = this.activeTimers.get(characterId)
    if (timerInfo) {
      clearInterval(timerInfo.timerId)
      this.activeTimers.delete(characterId)
      console.log(`Stopped stats growth for character ${characterId}`)
    }
  }

  // 更新角色统计数据
  private updateCharacterStats(characterId: string) {
    try {
      // 更新公开角色列表
      const publicCharacters = JSON.parse(localStorage.getItem('publicCharacters') || '[]')
      const characterIndex = publicCharacters.findIndex((char: any) => char.id === characterId)
      
      if (characterIndex === -1) {
        // 角色不存在或已被删除，停止定时器
        this.stopStatsGrowth(characterId)
        return
      }

      const character = publicCharacters[characterIndex]
      
      // 检查角色是否变为私密
      if (character.isPrivate) {
        this.stopStatsGrowth(characterId)
        return
      }

      const timeSinceCreation = Date.now() - new Date(character.createdAt).getTime()
      const hoursSinceCreation = timeSinceCreation / (1000 * 60 * 60)
      
      // 根据时间调整增长速度
      let growthMultiplier = 1
      if (hoursSinceCreation < 1) {
        growthMultiplier = 3 // 第一小时快速增长
      } else if (hoursSinceCreation < 24) {
        growthMultiplier = 2 // 第一天中等增长
      } else if (hoursSinceCreation < 168) { // 一周内
        growthMultiplier = 1.5
      } else {
        growthMultiplier = 1 // 之后慢速增长
      }
      
      // 随机增加点赞数
      const likeIncrease = Math.floor(Math.random() * 5 + 1) * growthMultiplier
      character.stats.likes += likeIncrease
      character.likeCount = this.formatCount(character.stats.likes)
      
      // 偶尔增加聊天数
      if (Math.random() < 0.3) {
        const chatIncrease = Math.floor(Math.random() * 3 + 1) * growthMultiplier
        character.stats.chats += chatIncrease
        character.chatCount = this.formatCount(character.stats.chats)
      }
      
      // 偶尔增加浏览数
      if (Math.random() < 0.5) {
        const viewIncrease = Math.floor(Math.random() * 10 + 1) * growthMultiplier
        character.stats.views += viewIncrease
      }
      
      character.stats.lastUpdated = Date.now()
      publicCharacters[characterIndex] = character
      
      localStorage.setItem('publicCharacters', JSON.stringify(publicCharacters))
      
      // 同步更新其他存储位置
      this.syncCharacterDataAcrossStorage(character)
      
      // 触发更新事件
      window.dispatchEvent(new CustomEvent('characterStatsUpdated', { 
        detail: { characterId, stats: character.stats } 
      }))

    } catch (error) {
      console.error(`Error updating stats for character ${characterId}:`, error)
    }
  }

  // 格式化数量显示
  private formatCount(count: number): string {
    if (count < 1000) {
      return count.toString()
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + 'K'
    } else {
      return (count / 1000000).toFixed(1) + 'M'
    }
  }

  // 同步角色数据到所有相关存储位置
  private syncCharacterDataAcrossStorage(updatedCharacter: any) {
    try {
      // 更新用户角色列表
      const userCharacters = JSON.parse(localStorage.getItem('userCharacters') || '[]')
      const userCharIndex = userCharacters.findIndex((char: any) => char.id === updatedCharacter.id)
      if (userCharIndex !== -1) {
        userCharacters[userCharIndex] = { ...userCharacters[userCharIndex], ...updatedCharacter }
        localStorage.setItem('userCharacters', JSON.stringify(userCharacters))
      }

      // 更新用户数据中的公开角色
      const userData = JSON.parse(localStorage.getItem(`userData_${updatedCharacter.creatorId}`) || '{}')
      if (userData.publicCharacters) {
        const publicCharIndex = userData.publicCharacters.findIndex((char: any) => char.id === updatedCharacter.id)
        if (publicCharIndex !== -1) {
          userData.publicCharacters[publicCharIndex] = { ...userData.publicCharacters[publicCharIndex], ...updatedCharacter }
          localStorage.setItem(`userData_${updatedCharacter.creatorId}`, JSON.stringify(userData))
        }
      }

      // 更新创作者数据
      const creatorData = JSON.parse(localStorage.getItem(`creatorData_${updatedCharacter.creatorId}`) || '{}')
      if (creatorData.characters) {
        const creatorCharIndex = creatorData.characters.findIndex((char: any) => char.id === updatedCharacter.id)
        if (creatorCharIndex !== -1) {
          creatorData.characters[creatorCharIndex] = { ...creatorData.characters[creatorCharIndex], ...updatedCharacter }
          localStorage.setItem(`creatorData_${updatedCharacter.creatorId}`, JSON.stringify(creatorData))
        }
      }

      // 更新聊天角色数据
      const chatCharacters = JSON.parse(localStorage.getItem('chatCharacters') || '{}')
      if (chatCharacters[updatedCharacter.id]) {
        chatCharacters[updatedCharacter.id] = { ...chatCharacters[updatedCharacter.id], ...updatedCharacter }
        localStorage.setItem('chatCharacters', JSON.stringify(chatCharacters))
      }
    } catch (error) {
      console.error('Error syncing character data:', error)
    }
  }

  // 清理所有定时器
  cleanup() {
    this.activeTimers.forEach((timerInfo) => {
      clearInterval(timerInfo.timerId)
    })
    this.activeTimers.clear()
    console.log('Cleaned up all character stats timers')
  }

  // 获取活跃定时器信息
  getActiveTimers(): TimerInfo[] {
    return Array.from(this.activeTimers.values())
  }

  // 手动触发统计更新（用于测试）
  triggerStatsUpdate(characterId: string) {
    this.updateCharacterStats(characterId)
  }
}

// 创建全局实例
const characterStatsManager = new CharacterStatsManager()

// 导出管理器实例
export default characterStatsManager

// 导出类型
export type { CharacterStats, TimerInfo } 