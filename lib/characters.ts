// 角色数据统一管理
export interface Character {
  id: string;
  name: string;
  age?: number;
  occupation: string;
  tags: string[];
  description: string;
  chatCount: string;
  likeCount: string;
  followers?: string;
  imageSrc: string; // 主要图片
  avatarSrc: string; // 头像图片
  gender: 'male' | 'female';
  creator: {
    id: string;
    name: string;
    likeCount: string;
  };
}

// 统一的角色数据
export const charactersData: Record<string, Character> = {
  "1": {
    id: "1",
    name: "Alexander",
    age: 28,
    occupation: "Businessman",
    tags: ["Alpha", "Mature"],
    description: "The successful CEO who knows what he wants. Will you be his next conquest?",
    chatCount: "1.4M",
    likeCount: "13.0K",
    followers: "1.1M",
    imageSrc: "/alexander_pic1.png",
    avatarSrc: "/avatar/alexander_avatar.png",
    gender: "male",
    creator: { id: "alexmaster", name: "AlexMaster", likeCount: "13.0K" },
  },
  "2": {
    id: "2",
    name: "Jake",
    age: 25,
    occupation: "Plumber",
    tags: ["Playful", "Adventurous"],
    description: "The handsome plumber with a playful side. He's ready to fix more than just your pipes.",
    chatCount: "3.9K",
    likeCount: "9.5K",
    imageSrc: "/male/male_02.png",
    avatarSrc: "/avatar/male_02_avatar.png",
    gender: "male",
    creator: { id: "nightstalker", name: "NightStalker", likeCount: "9.5K" },
  },
  "3": {
    id: "3",
    name: "Ethan",
    age: 22,
    occupation: "Swimmer",
    tags: ["Athletic", "Mysterious"],
    description: "The talented swimmer who dominates the competition. But you're the only one who knows about your secret romance.",
    chatCount: "1.7K",
    likeCount: "7.6K",
    followers: "1.1M",
    imageSrc: "/male/male_03.png",
    avatarSrc: "/avatar/male_03_avatar.png",
    gender: "male",
    creator: { id: "roadrebel", name: "RoadRebel", likeCount: "7.6K" },
  },
  "4": {
    id: "4",
    name: "Rhonda",
    age: 26,
    occupation: "Entrepreneur",
    tags: ["Elegant", "Mature"],
    description: "A fierce and flirty entrepreneur, Rhonda sees you as her perfect partner in both business and pleasure.",
    chatCount: "22.2K",
    likeCount: "5.2K",
    imageSrc: "/female/female01.png",
    avatarSrc: "/avatar/female_01_avatar.png",
    gender: "female",
    creator: { id: "mei-chan", name: "Mei chan", likeCount: "204" },
  },
  "5": {
    id: "5",
    name: "Makenzie",
    age: 19,
    occupation: "Student",
    tags: ["Girl-Next-Door", "Innocent"],
    description: "A shy and repressed girl, hiding her deep attraction to you while trying to fit in.",
    chatCount: "24.1K",
    likeCount: "193",
    imageSrc: "/female/female_02.png",
    avatarSrc: "/avatar/female_02_avatar.png",
    gender: "female",
    creator: { id: "mei-chan", name: "Mei chan", likeCount: "193" },
  },
  "6": {
    id: "6",
    name: "Anshu",
    age: 32,
    occupation: "Housewife",
    tags: ["Girl-Next-Door", "Playful", "Seductive"],
    description: "A reserved mother with a hidden perverted side, she will do anything to satisfy your desires.",
    chatCount: "7.0K",
    likeCount: "204",
    imageSrc: "/female/female_03.jpg",
    avatarSrc: "/avatar/female_03_avatar.png",
    gender: "female",
    creator: { id: "mei-chan", name: "Mei chan", likeCount: "204" },
  },
  "7": {
    id: "7",
    name: "Isabella",
    age: 24,
    occupation: "Fashion Designer",
    tags: ["Elegant", "Independent", "Smart"],
    description: "A brilliant fashion designer with an eye for perfection. She knows what she wants and isn't afraid to take it.",
    chatCount: "18.3K",
    likeCount: "193",
    imageSrc: "/female/female_04.png",
    avatarSrc: "/avatar/female_04_avatar.png",
    gender: "female",
    creator: { id: "mei-chan", name: "Mei chan", likeCount: "193" },
  }
};

// 获取角色信息的辅助函数
export const getCharacterById = (id: string): Character | undefined => {
  return charactersData[id];
};

// 获取角色头像的辅助函数
export const getCharacterAvatar = (id: string): string => {
  const character = charactersData[id];
  return character?.avatarSrc || "/placeholder.svg?height=128&width=128&text=U";
};

// 获取角色名称的辅助函数
export const getCharacterName = (id: string): string => {
  const character = charactersData[id];
  return character?.name || "Unknown";
}; 