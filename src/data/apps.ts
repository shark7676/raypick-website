import { Language } from "./translations";

export type AppStatus = "live" | "coming";
type Text = Record<Language, string>;

export interface AppItem {
  /** URL id — /apps/<slug>, images in /public/apps/<slug>/ */
  slug: string;
  status: AppStatus;
  name: Text;
  genre: Text;
  tagline: Text;
  description: Text;
  /** Brand color (from the app icon) */
  color: string;
  icon: string;
  /** Phone-screen images, 1:2 ratio — shown inside the 3D phone */
  screens: string[];
  /** Store screenshots — shown in the gallery on the app page */
  shots: string[];
  /** Key art for apps that are not out yet */
  art?: string[];
  /** 3D phone frame color */
  frame: string;
  stores: { android?: string; ios?: string };
  site?: string;
}

const img = (slug: string, files: string[]) => files.map((f) => `/apps/${slug}/${f}`);

/**
 * 앱을 추가·수정하려면 이 배열만 고치면 됩니다.
 * 이미지는 /public/apps/<slug>/ 에 넣습니다. 출시되면 status 를 "live" 로 바꾸고 stores 에 링크를 넣습니다.
 */
export const apps: AppItem[] = [
  {
    slug: "beatray",
    status: "live",
    name: { ko: "BEATRAY", en: "BEATRAY" },
    genre: { ko: "리듬게임", en: "Rhythm game" },
    tagline: { ko: "놓치면 목소리가 사라지는 리듬게임", en: "Miss a note, the vocals vanish" },
    description: {
      ko: "정확히 칠수록 보컬이 돌아오고 놓치면 사라지는 '보컬 복원' 4레인 리듬게임. K-POP부터 애니송까지 12장르, 전곡 오리지널입니다.",
      en: "A 4-lane rhythm game built on Vocal Restore: hit clean and the vocals come back, miss and they fade. 12 genres, every track original.",
    },
    color: "#2FCFE8",
    icon: "/apps/beatray/icon.webp",
    screens: img("beatray", ["screen1.webp", "screen2.webp", "screen3.webp", "screen4.webp"]),
    shots: img("beatray", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#3a3f4a",
    stores: { android: "https://play.google.com/store/apps/details?id=com.raypick.beatray" },
    site: "https://playbeatray.com",
  },
  {
    slug: "gallory",
    status: "live",
    name: { ko: "Gallory", en: "Gallory" },
    genre: { ko: "사진", en: "Photography" },
    tagline: { ko: "내 사진, 추억이 매거진으로", en: "Turn your photos into a magazine" },
    description: {
      ko: "갤러리에 잠든 사진으로 표지·속지·지도까지 나만의 매거진 한 권을 만드는 앱. 계정·로그인 없이, 모든 작업이 내 폰 안에서만 이뤄집니다.",
      en: "Make your own magazine — cover, pages, even maps — from the photos already on your phone. No account, no login: not a single photo leaves your phone.",
    },
    color: "#F66652",
    icon: "/apps/gallory/icon.webp",
    screens: img("gallory", ["screen1.webp", "screen2.webp", "screen3.webp"]),
    shots: img("gallory", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#e9d6c6",
    stores: {
      android: "https://play.google.com/store/apps/details?id=com.gallory.app",
      ios: "https://apps.apple.com/app/id6813446942",
    },
    site: "https://gallory.app",
  },
  {
    slug: "thisjom",
    status: "live",
    name: { ko: "이것좀", en: "Thisjom" },
    genre: { ko: "동네 커뮤니티", en: "Local community" },
    tagline: { ko: "동네 도움 · 안 쓰는 물건 정리", en: "Neighborhood help & item giveaways" },
    description: {
      ko: "벌레 잡기·전등 갈기·짐 옮기기처럼 사소하지만 막막한 일을 동네 이웃에게 부탁하고, 버리긴 아깝고 팔기 애매한 물건은 필요한 이웃에게 넘기는 앱입니다.",
      en: "Ask neighbors for a hand with small jobs like catching bugs, changing light bulbs or moving heavy things, and pass on items too good to throw away to a neighbor who needs them.",
    },
    color: "#7BC347",
    icon: "/apps/thisjom/icon.webp",
    screens: img("thisjom", ["screen1.webp", "screen2.webp", "screen3.webp"]),
    shots: img("thisjom", ["shot1.webp", "shot2.webp", "shot3.webp", "shot4.webp"]),
    frame: "#d5dbe3",
    stores: { android: "https://play.google.com/store/apps/details?id=kr.co.raypick.thisjom" },
    site: "https://thisjom.com",
  },
  {
    slug: "parrythm",
    status: "coming",
    name: { ko: "PARRYTHM", en: "PARRYTHM" },
    genre: { ko: "리듬 액션 게임", en: "Rhythm action game" },
    tagline: { ko: "막고 때리는 리듬 액션 게임", en: "Parry the beat — rhythm action" },
    description: {
      ko: "박자에 맞춰 막고 때리는 리듬 액션 게임. 도시를 돌며 곡마다 스타 보스와 맞붙는 월드 투어를 준비 중입니다.",
      en: "A rhythm action game where you parry and strike on the beat, touring city to city and facing a star boss in each song.",
    },
    color: "#EA28A6",
    icon: "/apps/parrythm/icon.webp",
    screens: img("parrythm", ["art-stage.webp"]),
    shots: [],
    art: img("parrythm", ["art-riff.webp", "art-queen.webp"]),
    frame: "#2a1830",
    stores: {},
    site: "https://parrythm.com",
  },
  {
    slug: "haruyo",
    status: "coming",
    name: { ko: "하루요", en: "Haruyo" },
    genre: { ko: "번역 채팅", en: "Translated chat" },
    tagline: { ko: "한일 친구 찾기 · 번역 채팅", en: "Korea–Japan friends, translated chat" },
    description: {
      ko: "일본 친구를 찾고, 모국어로 쓰면 번역되는 1:1 채팅으로 이야기해요. 여행 갈 동네의 현지 정보와 일본어 공부까지 한 앱에서.",
      en: "Find friends across Korea and Japan and chat 1:1 in your own language — messages arrive translated. Ask locals about the town you're visiting and pick up the language as you talk.",
    },
    color: "#D6336C",
    icon: "/apps/haruyo/icon.webp",
    screens: [],
    shots: [],
    art: img("haruyo", ["illust-trip.webp", "illust-ask.webp", "illust-study.webp", "illust-rank.webp"]),
    frame: "#3b2a4a",
    stores: {},
  },
];

export const liveApps = apps.filter((a) => a.status === "live");
export const comingApps = apps.filter((a) => a.status === "coming");
export const getApp = (slug: string) => apps.find((a) => a.slug === slug);
