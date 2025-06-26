// 角色数据统一管理
export interface Character {
  id: string | number; // 兼容不同组件的需求
  name: string;
  age?: number;
  occupation: string;
  tags: string[]; // 原始标签
  mappedTags?: string[]; // 映射后的标签
  description: string;
  chatCount: string;
  likeCount: string;
  followers?: string;
  imageSrc: string; // 主要图片
  avatarSrc: string; // 头像图片
  images?: string[]; // 图片数组（为了兼容chat页面）
  gender: 'male' | 'female';
  creator: {
    id: string;
    name: string;
    likeCount: string;
  };
  // 新增字段
  rank?: number; // 用于trending排序
  isPopular?: boolean;
  isNew?: boolean;
}

// 标签映射表
export const maleTagMap: Record<string, string> = {
  Alpha: '🔥 Dominant',
  Mature: '🔥 Dominant',
  Gentle: '💪 Muscle',
  Playful: '👦 MalePOV',
  Adventurous: '👦 MalePOV',
  Witty: '👦 MalePOV',
  Badboy: '💪 Muscle',
  Billionaire: '💪 Muscle',
  'Cold Exterior': '🩸 Sadistic',
  Mysterious: '🩸 Sadistic',
  'Anti-Hero': '🩸 Sadistic',
  Protective: '👶 CNC',
  Werewolf: '👹 Monster',
  Musician: '🧬 Breeding',
  Chef: '🧑‍🦰 Age Play',
  'Police Officer': '🛏️ Step Roleplay',
  Mafia: '👹 Monster',
  Doctor: '🧠 Mind Break',
  Businessman: '🍭 Oral',
  Swimmer: '🍑 Anal',
  Boss: '🧑‍🤝‍🧑 Switch',
  Athletic: '💪 Muscle',
  Caring: '💪 Muscle',
};

export const femaleTagMap: Record<string, string> = {
  'Girl-Next-Door': '👧 FemalePOV',
  Innocent: '👧 FemalePOV',
  Elegant: '🌑 Yandere',
  Independent: '🙇 Submissive',
  Smart: '👩‍⚕️ Nurse',
  Caring: '🎒 Schoolgirl',
  Brave: '💼 Secretary',
  Nurturing: '👠 MILF',
  Teacher: '👩‍🦳 Mommy Dom',
  Nurse: '🚿 Shower',
  Cheerleader: '💧 Wet Scene',
  Lawyer: '🧸 Age Regression',
  Seductive: '🤫 Cheating',
  Playful: '😈 Villainess',
  Artist: '💃 Femme Fatale',
  Dancer: '🍑 Anal Play',
  Housewife: '👋 Spanking',
  'Fashion Designer': '🏁 Edging',
  Doctor: '🙏 Begging',
  Entrepreneur: '📺 AI Assistant',
  Student: '🟪 Programmed',
  Mysterious: '🌑 Yandere',
};

// 过滤标签数组
export const maleFilterTags = [
  'For You',
  'Popular',
  '🔥 Dominant',
  '👦 MalePOV',
  '💪 Muscle',
  '🩸 Sadistic',
  '👶 CNC',
  '🧬 Breeding',
  '🧑‍🦰 Age Play',
  '🛏️ Step Roleplay',
  '👹 Monster',
  '🧠 Mind Break',
  '🦶 Feet',
  '🍭 Oral',
  '🍑 Anal',
  '🧑‍🤝‍🧑 Switch',
];

export const femaleFilterTags = [
  'For You',
  'Popular',
  '👧 FemalePOV',
  '🌑 Yandere',
  '🙇 Submissive',
  '👩‍⚕️ Nurse',
  '🎒 Schoolgirl',
  '💼 Secretary',
  '👠 MILF',
  '👩‍🦳 Mommy Dom',
  '🚿 Shower',
  '💧 Wet Scene',
  '🧸 Age Regression',
  '🤫 Cheating',
  '😈 Villainess',
  '💃 Femme Fatale',
  '🍑 Anal Play',
  '👋 Spanking',
  '🏁 Edging',
  '🙏 Begging',
  '📺 AI Assistant',
  '🟪 Programmed',
];

// 标签映射函数
export const mapTags = (
  tags: string[],
  gender: 'male' | 'female'
): string[] => {
  const tagMap = gender === 'male' ? maleTagMap : femaleTagMap;
  return tags.map((tag) => tagMap[tag] || tag);
};

// 统一的角色数据 - 合并首页和原有数据
export const charactersData: Record<string, Character> = {
  '1': {
    id: '1',
    name: 'Ethan', // 更新为chat页面中的名称
    age: 22,
    occupation: 'Swimmer',
    tags: ['Mature', 'Athletic', 'Mysterious'],
    description:
      "The talented swimmer who dominates the competition. But you're the only one who knows about your secret romance. Will he ever make it public, or will your love remain hidden forever?",
    chatCount: '1.4M',
    likeCount: '13.0K',
    followers: '1.1M',
    imageSrc: '/male/male_01.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_01.png'],
    gender: 'male',
    creator: { id: 'alexmaster', name: 'AlexMaster', likeCount: '13.0K' },
    rank: 1,
    isPopular: true,
  },
  '2': {
    id: '2',
    name: 'Alexander', // 更新为chat页面中的名称
    age: 28,
    occupation: 'Businessman',
    tags: ['Alpha', 'Wealthy', 'Dominant'],
    description:
      'The successful CEO who knows exactly what he wants. Behind his confident exterior lies a man with desires only you can fulfill. Will you be the one to break through his walls?',
    chatCount: '3.9K',
    likeCount: '9.5K',
    followers: '2.3M',
    imageSrc: '/male/male_02.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_02.png'],
    gender: 'male',
    creator: { id: 'nightstalker', name: 'NightStalker', likeCount: '9.5K' },
  },
  '3': {
    id: '3',
    name: 'Jake', // 更新为chat页面中的名称
    age: 25,
    occupation: 'Plumber',
    tags: ['Playful', 'Flirty', 'Handy'],
    description:
      "The charming plumber with a playful smile and skilled hands. What started as a routine house call has turned into something much more exciting. He's ready to fix more than just your pipes.",
    chatCount: '1.7K',
    likeCount: '7.6K',
    followers: '980K',
    imageSrc: '/male/male_03.png',
    avatarSrc: '/avatar/male_02_avatar.png',
    images: ['/male/male_03.png'],
    gender: 'male',
    creator: { id: 'roadrebel', name: 'RoadRebel', likeCount: '7.6K' },
    rank: 3,
  },
  '4': {
    id: '4',
    name: 'Rhonda',
    age: 32,
    occupation: 'Entrepreneur',
    tags: ['Elegant', 'Mature', 'Dominant'],
    description:
      "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure. She's not afraid to take what she wants.",
    chatCount: '22.2K',
    likeCount: '5.2K',
    followers: '1.8M',
    imageSrc: '/female/female01.png',
    avatarSrc: '/avatar/female_01_avatar.png',
    images: ['/female/female01.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '204' },
    rank: 1,
  },
  '5': {
    id: '5',
    name: 'Makenzie',
    age: 19,
    occupation: 'Student',
    tags: ['Girl-Next-Door', 'Innocent', 'Shy'],
    description:
      'A shy and repressed girl, hiding her deep attraction to you while trying to fit in. Behind her innocent facade lies passionate desires waiting to be discovered.',
    chatCount: '24.1K',
    likeCount: '193',
    followers: '2.4M',
    imageSrc: '/female/female_02.png',
    avatarSrc: '/avatar/female_02_avatar.png',
    images: ['/female/female_02.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '193' },
    rank: 2,
  },
  '6': {
    id: '6',
    name: 'Anshu',
    age: 29,
    occupation: 'Housewife',
    tags: ['Girl-Next-Door', 'Playful', 'Seductive'],
    description:
      "A reserved mother with a hidden perverted side, she will do anything to satisfy your desires. Your new neighbor with secrets she's dying to share.",
    chatCount: '7.0K',
    likeCount: '204',
    followers: '1.5M',
    imageSrc: '/female/female_03.jpg',
    avatarSrc: '/avatar/female_03_avatar.png',
    images: ['/female/female_03.jpg'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '204' },
  },
  '7': {
    id: '7',
    name: 'Isabella',
    age: 24,
    occupation: 'Fashion Designer',
    tags: ['Elegant', 'Independent', 'Smart'],
    description:
      "A brilliant fashion designer with an eye for perfection. She knows what she wants and isn't afraid to take it.",
    chatCount: '18.3K',
    likeCount: '193',
    imageSrc: '/female/female_04.png',
    avatarSrc: '/avatar/female_04_avatar.png',
    images: ['/female/female_04.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '193' },
  },
  '8': {
    id: '8',
    name: 'Sophia',
    age: 27,
    occupation: 'Doctor',
    tags: ['Caring', 'Smart', 'Brave'],
    description:
      'A dedicated doctor who saves lives by day and has a secret wild side that only you get to discover.',
    chatCount: '31.7K',
    likeCount: '204',
    imageSrc: '/female/female_05.png',
    avatarSrc: '/avatar/female_02_avatar.png',
    images: ['/female/female_05.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '204' },
  },
  '9': {
    id: '9',
    name: 'Luna',
    age: 23,
    occupation: 'Artist',
    tags: ['Mysterious', 'Playful', 'Smart'],
    description:
      'A free-spirited artist who paints with passion. Her creativity extends beyond the canvas into every aspect of her life.',
    chatCount: '12.5K',
    likeCount: '193',
    imageSrc: '/female/female_06.png',
    avatarSrc: '/avatar/female_03_avatar.png',
    images: ['/female/female_06.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '193' },
  },
  '10': {
    id: '10',
    name: 'Victoria',
    age: 30,
    occupation: 'Lawyer',
    tags: ['Independent', 'Smart', 'Seductive'],
    description:
      "A powerful attorney who never loses a case. She's used to being in control, but will you be the exception?",
    chatCount: '27.9K',
    likeCount: '204',
    imageSrc: '/female/female_07.png',
    avatarSrc: '/avatar/female_04_avatar.png',
    images: ['/female/female_07.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '204' },
  },
  '11': {
    id: '11',
    name: 'Emma',
    age: 25,
    occupation: 'Teacher',
    tags: ['Nurturing', 'Girl-Next-Door', 'Caring'],
    description:
      "A sweet kindergarten teacher with a hidden naughty side. She's always ready to teach you new things.",
    chatCount: '15.8K',
    likeCount: '193',
    imageSrc: '/female/female_08.png',
    avatarSrc: '/avatar/female_03_avatar.png',
    images: ['/female/female_08.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '193' },
  },
  '12': {
    id: '12',
    name: 'Aria',
    age: 22,
    occupation: 'Dancer',
    tags: ['Elegant', 'Seductive', 'Playful'],
    description:
      'A professional ballet dancer whose moves are as mesmerizing off the stage as they are on. Every gesture tells a story.',
    chatCount: '20.4K',
    likeCount: '204',
    imageSrc: '/female/female_09.png',
    avatarSrc: '/avatar/female_04_avatar.png',
    images: ['/female/female_09.png'],
    gender: 'female',
    creator: { id: 'mei-chan', name: 'Mei chan', likeCount: '204' },
  },
  '13': {
    id: '13',
    name: 'Dominic',
    age: 35,
    occupation: 'Mafia Boss',
    tags: ['Alpha', 'Mysterious', 'Anti-Hero'],
    description:
      'A dangerous man with a soft spot for you. He rules the underworld, but you rule his heart.',
    chatCount: '45.2K',
    likeCount: '13.0K',
    imageSrc: '/male/male_04.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_04.png'],
    gender: 'male',
    creator: { id: 'alexmaster', name: 'AlexMaster', likeCount: '13.0K' },
    rank: 2,
  },
  '14': {
    id: '14',
    name: 'Marcus',
    age: 32,
    occupation: 'Doctor',
    tags: ['Gentle', 'Mature', 'Caring'],
    description:
      'A brilliant surgeon who saves lives. His gentle touch heals more than just physical wounds.',
    chatCount: '28.7K',
    likeCount: '9.5K',
    imageSrc: '/male/male_05.png',
    avatarSrc: '/avatar/male_02_avatar.png',
    images: ['/male/male_05.png'],
    gender: 'male',
    creator: { id: 'nightstalker', name: 'NightStalker', likeCount: '9.5K' },
  },
  '15': {
    id: '15',
    name: 'Ryan',
    age: 26,
    occupation: 'Musician',
    tags: ['Badboy', 'Witty', 'Adventurous'],
    description:
      'A rockstar whose music speaks to your soul. Every song he writes is inspired by you.',
    chatCount: '33.1K',
    likeCount: '7.6K',
    imageSrc: '/male/male_06.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_06.png'],
    gender: 'male',
    creator: { id: 'roadrebel', name: 'RoadRebel', likeCount: '7.6K' },
    rank: 5,
  },
  '16': {
    id: '16',
    name: 'Gabriel',
    age: 29,
    occupation: 'Police Officer',
    tags: ['Protective', 'Alpha', 'Mysterious'],
    description:
      "A dedicated cop who breaks all his own rules for you. He'll protect you from anything, even himself.",
    chatCount: '19.8K',
    likeCount: '13.0K',
    imageSrc: '/male/male_7.png.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_7.png.png'],
    gender: 'male',
    creator: { id: 'alexmaster', name: 'AlexMaster', likeCount: '13.0K' },
  },
  '17': {
    id: '17',
    name: 'Kai',
    age: 24,
    occupation: 'Chef',
    tags: ['Playful', 'Gentle', 'Witty'],
    description:
      'A talented chef who cooks with passion. He knows the way to your heart is through your stomach.',
    chatCount: '22.4K',
    likeCount: '9.5K',
    imageSrc: '/male/male_8.png.png',
    avatarSrc: '/avatar/male_02_avatar.png',
    images: ['/male/male_8.png.png'],
    gender: 'male',
    creator: { id: 'nightstalker', name: 'NightStalker', likeCount: '9.5K' },
  },
  '18': {
    id: '18',
    name: 'Xavier',
    age: 38,
    occupation: 'Billionaire',
    tags: ['Billionaire', 'Cold Exterior', 'Mature'],
    description:
      "A tech mogul with a cold exterior but a burning desire for you. Money can't buy what he truly wants.",
    chatCount: '41.6K',
    likeCount: '7.6K',
    imageSrc: '/male/male_9.png.png',
    avatarSrc: '/avatar/alexander_avatar.png',
    images: ['/male/male_9.png.png'],
    gender: 'male',
    creator: { id: 'roadrebel', name: 'RoadRebel', likeCount: '7.6K' },
  },
};

// 筛选和分页选项接口
export interface CharacterFilterOptions {
  gender?: 'male' | 'female' | 'all';
  tags?: string[];
  activeTag?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'popular' | 'newest' | 'chatCount' | 'rank';
  includeUserCreated?: boolean;
}

// 角色列表响应接口
export interface CharacterListResponse {
  characters: Character[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 获取角色信息的辅助函数
export const getCharacterById = (id: string): Character | undefined => {
  return charactersData[id];
};

// 获取角色头像的辅助函数
export const getCharacterAvatar = (id: string): string => {
  const character = charactersData[id];
  return character?.avatarSrc || '/placeholder.svg?height=128&width=128&text=U';
};

// 获取角色名称的辅助函数
export const getCharacterName = (id: string): string => {
  const character = charactersData[id];
  return character?.name || 'Unknown';
};

// 获取用户创建的角色-后续改成api调用
export const getUserCreatedCharacters = (): Record<string, Character> => {
  try {
    const chatCharacters = JSON.parse(
      localStorage.getItem('chatCharacters') || '{}'
    );
    return chatCharacters;
  } catch (error) {
    console.error('Error loading user created characters:', error);
    return {};
  }
};

// 核心函数：获取角色列表（支持筛选、分页等）-后续改成api调用
export const getCharacters = (
  options: CharacterFilterOptions = {}
): CharacterListResponse => {
  const {
    gender = 'all',
    activeTag = 'For You',
    page = 1,
    pageSize = 12,
    sortBy = 'popular',
    includeUserCreated = true,
  } = options;

  // 合并默认角色和用户创建的角色
  let allCharacters = { ...charactersData };

  if (includeUserCreated) {
    const userCreatedCharacters = getUserCreatedCharacters();
    allCharacters = { ...allCharacters, ...userCreatedCharacters };
  }

  // 转换为数组并添加映射标签
  let charactersList = Object.values(allCharacters).map((char) => ({
    ...char,
    mappedTags: mapTags(char.tags, char.gender),
  }));

  // 性别筛选
  if (gender !== 'all') {
    charactersList = charactersList.filter((char) => char.gender === gender);
  }

  // 标签筛选
  if (activeTag !== 'For You' && activeTag !== 'Popular') {
    charactersList = charactersList.filter(
      (char) =>
        char.mappedTags?.includes(activeTag) || char.tags.includes(activeTag)
    );
  }

  // 排序
  charactersList.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (
          parseInt(b.chatCount.replace(/[^\d]/g, '')) -
          parseInt(a.chatCount.replace(/[^\d]/g, ''))
        );
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'chatCount':
        return (
          parseInt(b.chatCount.replace(/[^\d]/g, '')) -
          parseInt(a.chatCount.replace(/[^\d]/g, ''))
        );
      case 'rank':
        return (a.rank || 999) - (b.rank || 999);
      default:
        return 0;
    }
  });

  // 计算分页
  const totalCount = charactersList.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCharacters = charactersList.slice(startIndex, endIndex);

  return {
    characters: paginatedCharacters,
    totalCount,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// 获取趋势角色 -后续改成api调用
export const getTrendingCharacters = (
  gender: 'male' | 'female' = 'male',
  limit: number = 5
): Character[] => {
  const { characters } = getCharacters({
    gender,
    sortBy: 'rank',
    pageSize: limit,
  });

  return characters.filter((char) => char.rank !== undefined).slice(0, limit);
};

// 获取最近聊天的角色-后续改成api调用
export const getRecentChatCharacters = (limit: number = 3): Character[] => {
  try {
    const chatHistory = JSON.parse(localStorage.getItem('recentChats') || '[]');
    return chatHistory.slice(0, limit).map((chat: any) => {
      const character = getCharacterById(chat.id);
      return (
        character || {
          id: chat.id,
          name: chat.name,
          imageSrc: chat.imageSrc,
          avatarSrc: chat.imageSrc,
          gender: chat.gender || 'male',
          occupation: 'Unknown',
          tags: [],
          description: '',
          chatCount: '0',
          likeCount: '0',
          creator: { id: '', name: '', likeCount: '0' },
        }
      );
    });
  } catch (error) {
    console.error('Error loading recent chat characters:', error);
    return [];
  }
};

// 获取指定性别的过滤标签-后续改成api调用
export const getFilterTags = (gender: 'male' | 'female'): string[] => {
  return gender === 'male' ? maleFilterTags : femaleFilterTags;
};
