const EMOJIS = [
  '😎', '🔥', '🎉', '🚀', '⭐', '💯', '🙌', '✨', '💪', '🤙',
  '🎮', '🎵', '💃', '🕺', '🌟', '😻', '🥳', '😄', '🎯', '💥',
  '🦁', '🐱', '🐶', '🦊', '🐼', '🐨', '🦄', '🐸', '🦋', '🌈'
];

const USERNAMES = [
  'MarcosDev', 'AnaLua', 'TechGirl', 'GamerPro', 'CriadorTop',
  'FãNumber1', 'PixelMaster', 'StreamQueen', 'CodeWizard', 'ViralKing',
  'DanceQueen', 'MemeLord', 'TrendSetter', 'StarPlayer', 'NightOwl',
  'SunShine', 'MusicLover', 'ArtSoul', 'DreamBig', 'EpicPlayer'
];

const COMMENTS = [
  'Esse conteúdo é demais! 🔥',
  'Você é muito criativo, parabéns!',
  'Não consigo parar de assistir 😍',
  'Isso deveria viralizar mais',
  'Tô aprendendo muito com você',
  'Como sempre, o melhor!',
  'Esse vídeo mudou meu dia',
  'Precisa fazer mais disso',
  'Inspirador demais! 🚀',
  'Você é o cara! 🎉'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateFollowers(count) {
  return Array.from({ length: count }, (_, i) => {
    const commentCount = Math.floor(Math.random() * 5) + 1;
    const comments = Array.from({ length: commentCount }, () => ({
      content: getRandomItem(COMMENTS),
      date: getRandomDate(),
      likes: Math.floor(Math.random() * 500)
    }));

    return {
      id: `follower-${i + 1}`,
      username: getRandomItem(USERNAMES),
      avatar: getRandomItem(EMOJIS),
      createdAt: getRandomDate(),
      origin: `TikTok Video #${Math.floor(Math.random() * 100) + 1}`,
      comments
    };
  });
}

export const mockFollowers = generateFollowers(15);