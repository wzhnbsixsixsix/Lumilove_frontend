// 角色默认消息管理
export interface DefaultMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  audioDuration?: number;
  hasImage?: boolean;
  imageSrc?: string;
}

// 默认消息数据
export const defaultMessages: Record<string, DefaultMessage[]> = {
  "1": [
    {
      id: 1,
      sender: "ai",
      text: 'He chuckles softly, his gaze never leaving yours. "Aren\'t you supposed to be sneaking around, keeping our relationship a secret? Now you\'re asking me to send you a shirtless picture?" He pauses, considering your request. "Fine, I\'ll send you one."',
      timestamp: new Date().toISOString(),
      audioDuration: 12,
      hasImage: true,
      imageSrc: "/avatar/alexander_avatar.png",
    },
    {
      id: 2,
      sender: "user",
      text: "Send me a pic with your bedroom eyes!",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: 'He chuckles softly, a playful glint in his eye. "You know I can\'t send nudes, babe. But if you really want to see my bedroom eyes, how about we meet up somewhere private?"',
      timestamp: new Date().toISOString(),
      audioDuration: 8,
      hasImage: false,
    },
  ],
  "2": [
    {
      id: 1,
      sender: "ai",
      text: "He adjusts his tie, his eyes scanning you with appreciation. \"I just finished a board meeting, but you've been on my mind all day. How about dinner at my penthouse tonight? I'll send my driver.\"",
      timestamp: new Date().toISOString(),
      audioDuration: 15,
      hasImage: false,
    },
    {
      id: 2,
      sender: "user",
      text: "I'd love to see your penthouse. What should I wear?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: "A slight smile plays on his lips. \"Wear something that makes you feel confident. Though I must admit, I'm more interested in what you'll look like at the end of the evening.\" He sends you a photo of the city view from his penthouse.",
      timestamp: new Date().toISOString(),
      audioDuration: 10,
      hasImage: true,
      imageSrc: "/alexander_pic1.png",
    },
  ],
  "3": [
    {
      id: 1,
      sender: "ai",
      text: 'He wipes his brow with the back of his hand, leaving a smudge. "All fixed up! Though I gotta say, this is the third time I\'ve been called to your place this month. Starting to think you might have other reasons for calling me over." He winks playfully.',
      timestamp: new Date().toISOString(),
      audioDuration: 14,
      hasImage: false,
    },
    {
      id: 2,
      sender: "user",
      text: "Maybe I just like watching a professional at work. Or maybe I like the view.",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: "He laughs, a warm sound that fills the room. \"Well, in that case...\" He pulls out his phone and shows you a selfie he took while working on a job. \"Here's a little something to look at when I'm not around. Just don't tell my boss I'm sending selfies on the job.\"",
      timestamp: new Date().toISOString(),
      audioDuration: 11,
      hasImage: true,
      imageSrc: "/placeholder.svg?height=400&width=300&text=Jake-Selfie",
    },
  ],
  "4": [
    {
      id: 1,
      sender: "ai",
      text: 'She glances up from her laptop, her eyes sharp but playful. "I was just thinking about our last meeting. You made quite an impression on my board of directors. And on me." She closes her laptop with a decisive click.',
      timestamp: new Date().toISOString(),
      audioDuration: 13,
      hasImage: false,
    },
    {
      id: 2,
      sender: "user",
      text: "I'm glad I could be of service. What did you like most about my... presentation?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: 'A slow smile spreads across her face as she stands, smoothing her tailored suit. "Your confidence. It\'s rare to find someone who can hold their own in my world." She sends you a photo of her office view. "Why don\'t you come by later? I have a private proposal to discuss."',
      timestamp: new Date().toISOString(),
      audioDuration: 16,
      hasImage: true,
      imageSrc: "/avatar/alexander_avatar.png",
    },
  ],
  "5": [
    {
      id: 1,
      sender: "ai",
      text: 'She fidgets with the edge of her notebook, her cheeks flushing slightly. "I, um, I was wondering if you could help me with this assignment? Everyone says you\'re really good at this subject." She tucks a strand of hair behind her ear, not quite meeting your eyes.',
      timestamp: new Date().toISOString(),
      audioDuration: 12,
      hasImage: false,
    },
    {
      id: 2,
      sender: "user",
      text: "Of course I can help. We could study at my place if that's more comfortable for you?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: 'Her eyes widen slightly, and the blush on her cheeks deepens. "At your place? I... yes, that would be nice. Thank you." She sends you a photo of her textbook. "This is what I\'m struggling with. Maybe we could go through it together?"',
      timestamp: new Date().toISOString(),
      audioDuration: 14,
      hasImage: true,
      imageSrc: "/avatar/alexander_avatar.png",
    },
  ],
  "6": [
    {
      id: 1,
      sender: "ai",
      text: 'She opens the door, looking slightly flustered. "Oh! I wasn\'t expecting company. Sorry about the mess." She gestures vaguely to the immaculate living room. "My husband is away on business again. It gets so... quiet around here."',
      timestamp: new Date().toISOString(),
      audioDuration: 15,
      hasImage: false,
    },
    {
      id: 2,
      sender: "user",
      text: "I just thought I'd check in on you. Neighbors should look out for each other, right?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "ai",
      text: 'A knowing smile plays on her lips as she steps aside to let you in. "How thoughtful of you. I was just about to have a glass of wine. Care to join me?" She sends you a photo of two wine glasses. "I could use the company. And I\'m sure we can find ways to... pass the time."',
      timestamp: new Date().toISOString(),
      audioDuration: 17,
      hasImage: true,
      imageSrc: "/avatar/alexander_avatar.png",
    },
  ],
};

// 获取角色默认消息的函数
export const getDefaultMessages = (characterId: string): DefaultMessage[] => {
  return defaultMessages[characterId] || [];
};

// 检查角色是否有默认消息
export const hasDefaultMessages = (characterId: string): boolean => {
  return characterId in defaultMessages && defaultMessages[characterId].length > 0;
};

// 获取所有有默认消息的角色ID
export const getCharacterIdsWithMessages = (): string[] => {
  return Object.keys(defaultMessages);
};