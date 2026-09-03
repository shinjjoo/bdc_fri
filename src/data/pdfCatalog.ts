export interface ScorePageSong {
  id: string;
  title: string;
  key: 'G' | 'C' | 'E';
  type?: string;
  bookNo: number;
  hymnNo?: string;
}

export interface ScorePageInfo {
  pageNumber: number; // 1 to 101
  key: 'G' | 'C' | 'E' | 'INDEX';
  bookNumber?: number; // #0 to #46
  title: string;
  songs: ScorePageSong[];
}

export const SCORE_PAGES: ScorePageInfo[] = [
  // =================== G KEY (Pages 1 ~ 47) ===================
  {
    pageNumber: 1,
    key: 'G',
    bookNumber: 0,
    title: 'G코드 #0',
    songs: [
      { id: 'g-0-1', title: '주의 친절한 팔에 안기세', key: 'G', bookNo: 0, hymnNo: '찬송가 405장', type: '빠른 찬송가' },
      { id: 'g-0-2', title: '주의 피 (주의 보혈)', key: 'G', bookNo: 0, type: '느린 복음성가' },
      { id: 'g-0-3', title: '순례자의 노래', key: 'G', bookNo: 0, type: '느린 복음성가' },
      { id: 'g-0-4', title: '사망의 그늘에 앉아 (그 날)', key: 'G', bookNo: 0, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 2,
    key: 'G',
    bookNumber: 1,
    title: 'G코드 #1',
    songs: [
      { id: 'g-1-1', title: '변찮는 주님의 사랑과', key: 'G', bookNo: 1, hymnNo: '찬송가 270장', type: '빠른 찬송가' },
      { id: 'g-1-2', title: '죄에서 자유를 얻게 함은', key: 'G', bookNo: 1, hymnNo: '찬송가 268장', type: '빠른 찬송가' },
      { id: 'g-1-3', title: '이 눈에 아무증거 아니뵈어도', key: 'G', bookNo: 1, hymnNo: '찬송가 545장', type: '빠른 찬송가' },
      { id: 'g-1-4', title: '주하나님 지으신 모든 세계', key: 'G', bookNo: 1, hymnNo: '찬송가 79장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 3,
    key: 'G',
    bookNumber: 2,
    title: 'G코드 #2',
    songs: [
      { id: 'g-2-1', title: '내가 매일 기쁘게', key: 'G', bookNo: 2, hymnNo: '찬송가 191장', type: '빠른 찬송가' },
      { id: 'g-2-2', title: '만왕의 왕 내 주께서', key: 'G', bookNo: 2, hymnNo: '찬송가 151장', type: '느린 찬송가' },
      { id: 'g-2-3', title: '나의 죄를 씻기는', key: 'G', bookNo: 2, hymnNo: '찬송가 252장', type: '빠른 찬송가' },
      { id: 'g-2-4', title: '마음속에 근심있는 사람', key: 'G', bookNo: 2, hymnNo: '찬송가 365장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 4,
    key: 'G',
    bookNumber: 3,
    title: 'G코드 #3',
    songs: [
      { id: 'g-3-1', title: '주는 나를 기르시는 목자', key: 'G', bookNo: 3, hymnNo: '찬송가 570장', type: '느린 찬송가' },
      { id: 'g-3-2', title: '내 죄 사함 받고서', key: 'G', bookNo: 3, type: '빠른 찬송가' },
      { id: 'g-3-3', title: '하나님의 나팔소리', key: 'G', bookNo: 3, hymnNo: '찬송가 180장', type: '빠른 찬송가' },
      { id: 'g-3-4', title: '슬픈 마음 있는 사람', key: 'G', bookNo: 3, hymnNo: '찬송가 91장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 5,
    key: 'G',
    bookNumber: 4,
    title: 'G코드 #4',
    songs: [
      { id: 'g-4-1', title: '우리를 죄에서 구하시려', key: 'G', bookNo: 4, hymnNo: '찬송가 260장', type: '빠른 찬송가' },
      { id: 'g-4-2', title: '보아라 즐거운 우리 집', key: 'G', bookNo: 4, hymnNo: '찬송가 235장', type: '빠른 찬송가' },
      { id: 'g-4-3', title: '나 주를 멀리 떠났다', key: 'G', bookNo: 4, hymnNo: '찬송가 273장', type: '느린 찬송가' },
      { id: 'g-4-4', title: '성도여 다 함께', key: 'G', bookNo: 4, hymnNo: '찬송가 29장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 6,
    key: 'G',
    bookNumber: 5,
    title: 'G코드 #5',
    songs: [
      { id: 'g-5-1', title: '샘물과 같은 주의 보혈은', key: 'G', bookNo: 5, hymnNo: '찬송가 258장', type: '빠른 찬송가' },
      { id: 'g-5-2', title: '주의 진리 위해 십자가 군기', key: 'G', bookNo: 5, hymnNo: '찬송가 358장', type: '빠른 찬송가' },
      { id: 'g-5-3', title: '갈 길을 밝히 보이시니', key: 'G', bookNo: 5, hymnNo: '찬송가 524장', type: '빠른 찬송가' },
      { id: 'g-5-4', title: '천성을 향해 가는 성도들아', key: 'G', bookNo: 5, type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 7,
    key: 'G',
    bookNumber: 6,
    title: 'G코드 #6',
    songs: [
      { id: 'g-6-1', title: '구주의 십자가 보혈로', key: 'G', bookNo: 6, hymnNo: '찬송가 250장', type: '빠른 찬송가' },
      { id: 'g-6-2', title: '예수 십자가에 흘린 피로써', key: 'G', bookNo: 6, hymnNo: '찬송가 193장', type: '빠른 찬송가' },
      { id: 'g-6-3', title: '인애하신 구세주여', key: 'G', bookNo: 6, hymnNo: '찬송가 279장', type: '느린 찬송가' },
      { id: 'g-6-4', title: '주님 약속 하신 말씀 위에서', key: 'G', bookNo: 6, hymnNo: '찬송가 546장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 8,
    key: 'G',
    bookNumber: 7,
    title: 'G코드 #7',
    songs: [
      { id: 'g-7-1', title: '내 구주 예수를 더욱 사랑', key: 'G', bookNo: 7, hymnNo: '찬송가 314장', type: '느린 찬송가' },
      { id: 'g-7-2', title: '마귀들과 싸울지라', key: 'G', bookNo: 7, hymnNo: '찬송가 348장', type: '빠른 찬송가' },
      { id: 'g-7-3', title: '온 세상 위하여', key: 'G', bookNo: 7, hymnNo: '찬송가 505장', type: '빠른 찬송가' },
      { id: 'g-7-4', title: '십자가 군병들아', key: 'G', bookNo: 7, hymnNo: '찬송가 352장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 9,
    key: 'G',
    bookNumber: 8,
    title: 'G코드 #8',
    songs: [
      { id: 'g-8-1', title: '강물같이 흐르는 기쁨', key: 'G', bookNo: 8, hymnNo: '찬송가 182장', type: '빠른 찬송가' },
      { id: 'g-8-2', title: '만세 반석 열리니', key: 'G', bookNo: 8, hymnNo: '찬송가 494장', type: '느린 찬송가' },
      { id: 'g-8-3', title: '겟세마네 동산의', key: 'G', bookNo: 8, hymnNo: '찬송가 457장', type: '느린 찬송가' },
      { id: 'g-8-4', title: '나 행한 것 죄뿐이니', key: 'G', bookNo: 8, hymnNo: '찬송가 274장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 10,
    key: 'G',
    bookNumber: 9,
    title: 'G코드 #9',
    songs: [
      { id: 'g-9-1', title: '불길 같은 주 성령', key: 'G', bookNo: 9, hymnNo: '찬송가 184장', type: '빠른 찬송가' },
      { id: 'g-9-2', title: '나의 갈길 다 가도록', key: 'G', bookNo: 9, hymnNo: '찬송가 384장', type: '빠른 찬송가' },
      { id: 'g-9-3', title: '하나님의 진리 등대', key: 'G', bookNo: 9, hymnNo: '찬송가 510장', type: '빠른 찬송가' },
      { id: 'g-9-4', title: '먹보다도 더 검은', key: 'G', bookNo: 9, hymnNo: '찬송가 423장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 11,
    key: 'G',
    bookNumber: 10,
    title: 'G코드 #10',
    songs: [
      { id: 'g-10-1', title: '너 시험을 당해', key: 'G', bookNo: 10, hymnNo: '찬송가 342장', type: '빠른 찬송가' },
      { id: 'g-10-2', title: '내 맘에 한 노래 있어', key: 'G', bookNo: 10, hymnNo: '찬송가 410장', type: '빠른 찬송가' },
      { id: 'g-10-3', title: '주여 지난 밤 내 꿈에', key: 'G', bookNo: 10, hymnNo: '찬송가 490장', type: '느린 찬송가' },
      { id: 'g-10-4', title: '십자가를 질 수 있나', key: 'G', bookNo: 10, hymnNo: '찬송가 461장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 12,
    key: 'G',
    bookNumber: 11,
    title: 'G코드 #11',
    songs: [
      { id: 'g-11-1', title: '예수가 우리를 부르는 소리', key: 'G', bookNo: 11, hymnNo: '찬송가 528장', type: '느린 찬송가' },
      { id: 'g-11-2', title: '빈들에 마른 풀 같이', key: 'G', bookNo: 11, hymnNo: '찬송가 183장', type: '빠른 찬송가' },
      { id: 'g-11-3', title: '죄짐을 지고서 곤하거든', key: 'G', bookNo: 11, hymnNo: '찬송가 538장', type: '느린 찬송가' },
      { id: 'g-11-4', title: '예수는 나의 힘이요', key: 'G', bookNo: 11, hymnNo: '찬송가 93장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 13,
    key: 'G',
    bookNumber: 12,
    title: 'G코드 #12',
    songs: [
      { id: 'g-12-1', title: '내게 강 같은 평화', key: 'G', bookNo: 12, type: '빠른 찬송가' },
      { id: 'g-12-2', title: '많은 사람들', key: 'G', bookNo: 12, type: '느린 복음성가' },
      { id: 'g-12-3', title: '마지막 날에', key: 'G', bookNo: 12, type: '빠른 복음성가' },
      { id: 'g-12-4', title: '기뻐하며 왕께 노래부르리', key: 'G', bookNo: 12, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 14,
    key: 'G',
    bookNumber: 13,
    title: 'G코드 #13',
    songs: [
      { id: 'g-13-1', title: '예수님이 말씀하시니', key: 'G', bookNo: 13, type: '빠른 복음성가' },
      { id: 'g-13-2', title: '문들아 머리 들어라', key: 'G', bookNo: 13, type: '빠른 복음성가' },
      { id: 'g-13-3', title: '천국은 마치', key: 'G', bookNo: 13, type: '빠른 복음성가' },
      { id: 'g-13-4', title: '내 안에 부어주소서', key: 'G', bookNo: 13, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 15,
    key: 'G',
    bookNumber: 14,
    title: 'G코드 #14',
    songs: [
      { id: 'g-14-1', title: '찬양이 언제나 넘치면', key: 'G', bookNo: 14, type: '빠른 복음성가' },
      { id: 'g-14-2', title: '예수 안에서', key: 'G', bookNo: 14, type: '빠른 복음성가' },
      { id: 'g-14-3', title: '손을 높이 들고', key: 'G', bookNo: 14, type: '빠른 복음성가' },
      { id: 'g-14-4', title: '다와서 찬양해', key: 'G', bookNo: 14, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 16,
    key: 'G',
    bookNumber: 15,
    title: 'G코드 #15',
    songs: [
      { id: 'g-15-1', title: '오 주여 나의 마음이', key: 'G', bookNo: 15, type: '느린 복음성가' },
      { id: 'g-15-2', title: '일어나라 찬양을 드리라', key: 'G', bookNo: 15, type: '빠른 복음성가' },
      { id: 'g-15-3', title: '주 우리 아버지', key: 'G', bookNo: 15, type: '빠른 복음성가' },
      { id: 'g-15-4', title: '주의 사랑으로 사랑합니다', key: 'G', bookNo: 15, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 17,
    key: 'G',
    bookNumber: 16,
    title: 'G코드 #16',
    songs: [
      { id: 'g-16-1', title: '주의 인자하심이 생명보다 나으므로', key: 'G', bookNo: 16, type: '느린 복음성가' },
      { id: 'g-16-2', title: '호산나', key: 'G', bookNo: 16, type: '빠른 복음성가' },
      { id: 'g-16-3', title: '주 예수의 이름 높이세', key: 'G', bookNo: 16, type: '빠른 복음성가' },
      { id: 'g-16-4', title: '주님 한 분만으로', key: 'G', bookNo: 16, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 18,
    key: 'G',
    bookNumber: 17,
    title: 'G코드 #17',
    songs: [
      { id: 'g-18-1', title: '주님 큰 영광 받으소서', key: 'G', bookNo: 17, type: '느린 복음성가' },
      { id: 'g-18-2', title: '주님여 이 손을', key: 'G', bookNo: 17, type: '느린 복음성가' },
      { id: 'g-18-3', title: '지금 이 자리에서', key: 'G', bookNo: 17, type: '느린 복음성가' },
      { id: 'g-18-4', title: '세상 모든 민족이 (물이 바다 덮음 같이)', key: 'G', bookNo: 17, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 19,
    key: 'G',
    bookNumber: 18,
    title: 'G코드 #18',
    songs: [
      { id: 'g-19-1', title: '사랑하는 나의 아버지', key: 'G', bookNo: 18, type: '느린 복음성가' },
      { id: 'g-19-2', title: '하나님의 음성을 (시편 40편)', key: 'G', bookNo: 18, type: '느린 복음성가' },
      { id: 'g-19-3', title: '유월절 어린양의 피로', key: 'G', bookNo: 18, type: '느린 복음성가' },
      { id: 'g-19-4', title: '힘들고 지쳐 (너는 내 아들이라)', key: 'G', bookNo: 18, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 20,
    key: 'G',
    bookNumber: 19,
    title: 'G코드 #19',
    songs: [
      { id: 'g-20-1', title: '사랑해요 목소리 높여', key: 'G', bookNo: 19, type: '느린 복음성가' },
      { id: 'g-20-2', title: '에벤에셀 하나님', key: 'G', bookNo: 19, type: '느린 복음성가' },
      { id: 'g-20-3', title: '예배자 (아무도 예배하지 않는)', key: 'G', bookNo: 19, type: '느린 복음성가' },
      { id: 'g-20-4', title: '나는 찬양하리라', key: 'G', bookNo: 19, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 21,
    key: 'G',
    bookNumber: 20,
    title: 'G코드 #20',
    songs: [
      { id: 'g-21-1', title: '돌아온 탕자', key: 'G', bookNo: 20, type: '느린 복음성가' },
      { id: 'g-21-2', title: '기도할 수 있는데', key: 'G', bookNo: 20, type: '느린 복음성가' },
      { id: 'g-21-3', title: '모든 영광을 하나님께', key: 'G', bookNo: 20, type: '느린 복음성가' },
      { id: 'g-21-4', title: '하나님께로 더 가까이', key: 'G', bookNo: 20, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 22,
    key: 'G',
    bookNumber: 21,
    title: 'G코드 #21',
    songs: [
      { id: 'g-22-1', title: '왜 슬퍼하느냐', key: 'G', bookNo: 21, type: '느린 복음성가' },
      { id: 'g-22-2', title: '새롭게 하소서 (고후 5:17)', key: 'G', bookNo: 21, type: '느린 복음성가' },
      { id: 'g-22-3', title: '당신이 지쳐서 (누군가 널 위해 기도하네)', key: 'G', bookNo: 21, type: '느린 복음성가' },
      { id: 'g-22-4', title: '나 주님의 길을 가리라', key: 'G', bookNo: 21, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 23,
    key: 'G',
    bookNumber: 22,
    title: 'G코드 #22',
    songs: [
      { id: 'g-23-1', title: '좋으신 하나님', key: 'G', bookNo: 22, type: '느린 찬송가' },
      { id: 'g-23-2', title: '오늘 이 하루도', key: 'G', bookNo: 22, type: '느린 복음성가' },
      { id: 'g-23-3', title: '주님만이 왕이십니다', key: 'G', bookNo: 22, type: '빠른 복음성가' },
      { id: 'g-23-4', title: '내 구주 예수님', key: 'G', bookNo: 22, type: '느린 복음성가' },
      { id: 'g-23-5', title: '하나님 어린양 독생자 예수', key: 'G', bookNo: 22, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 24,
    key: 'G',
    bookNumber: 23,
    title: 'G코드 #23',
    songs: [
      { id: 'g-24-1', title: '괴로울 때 주님의 얼굴 보라', key: 'G', bookNo: 23, type: '느린 복음성가' },
      { id: 'g-24-2', title: '마라나타', key: 'G', bookNo: 23, type: '느린 복음성가' },
      { id: 'g-24-3', title: '우물가의 여인처럼', key: 'G', bookNo: 23, type: '느린 복음성가' },
      { id: 'g-24-4', title: '주가 보이신 생명의 길', key: 'G', bookNo: 23, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 25,
    key: 'G',
    bookNumber: 24,
    title: 'G코드 #24',
    songs: [
      { id: 'g-25-1', title: '당신의 그 섬김이 (해 같이 빛나리)', key: 'G', bookNo: 24, type: '느린 복음성가' },
      { id: 'g-25-2', title: '예수 나의 좋은 치료자', key: 'G', bookNo: 24, type: '느린 복음성가' },
      { id: 'g-25-3', title: '내 영혼이 은총 입어', key: 'G', bookNo: 24, hymnNo: '찬송가 438장', type: '느린 찬송가' },
      { id: 'g-25-4', title: '하늘의 문을 여소서 (임재)', key: 'G', bookNo: 24, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 26,
    key: 'G',
    bookNumber: 25,
    title: 'G코드 #25',
    songs: [
      { id: 'g-26-1', title: '주께 가까이 날 이끄소서', key: 'G', bookNo: 25, type: '느린 복음성가' },
      { id: 'g-26-2', title: '나의 안에 거하라', key: 'G', bookNo: 25, type: '느린 복음성가' },
      { id: 'g-26-3', title: '보혈을 지나', key: 'G', bookNo: 25, type: '느린 복음성가' },
      { id: 'g-26-4', title: '그럼에도 불구하고', key: 'G', bookNo: 25, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 27,
    key: 'G',
    bookNumber: 26,
    title: 'G코드 #26',
    songs: [
      { id: 'g-27-1', title: '전능하신 나의 주 하나님', key: 'G', bookNo: 26, type: '느린 복음성가' },
      { id: 'g-27-2', title: '하나님의 사랑을 (주만 바라볼찌라)', key: 'G', bookNo: 26, type: '느린 복음성가' },
      { id: 'g-27-3', title: '하나님이시여 (주는 나의)', key: 'G', bookNo: 26, type: '느린 복음성가' },
      { id: 'g-27-4', title: '모든 상황속에서', key: 'G', bookNo: 26, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 28,
    key: 'G',
    bookNumber: 27,
    title: 'G코드 #27',
    songs: [
      { id: 'g-28-1', title: '나 가진재물 없으나 (공평하신 하나님)', key: 'G', bookNo: 27, type: '느린 복음성가' },
      { id: 'g-28-2', title: '내가 주인 삼은', key: 'G', bookNo: 27, type: '느린 복음성가' },
      { id: 'g-28-3', title: '주님 큰 영광 받으소서', key: 'G', bookNo: 27, type: '느린 복음성가' },
      { id: 'g-28-4', title: '나의 힘이 되신 여호와', key: 'G', bookNo: 27, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 29,
    key: 'G',
    bookNumber: 28,
    title: 'G코드 #28',
    songs: [
      { id: 'g-29-1', title: '내 마음에 주를 향한 사랑이', key: 'G', bookNo: 28, type: '느린 복음성가' },
      { id: 'g-29-2', title: '나 주님의 기쁨 (내가 원하는 한가지)', key: 'G', bookNo: 28, type: '느린 복음성가' },
      { id: 'g-29-3', title: '우리 보좌 앞에 모였네 (비전)', key: 'G', bookNo: 28, type: '느린 복음성가' },
      { id: 'g-29-4', title: '슬픈 마음 있는 자 (예수 예수)', key: 'G', bookNo: 28, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 30,
    key: 'G',
    bookNumber: 29,
    title: 'G코드 #29',
    songs: [
      { id: 'g-30-1', title: '주님과 같이', key: 'G', bookNo: 29, type: '느린 복음성가' },
      { id: 'g-30-2', title: '우리 오늘 눈물로 (우리 함께 보리라)', key: 'G', bookNo: 29, type: '느린 복음성가' },
      { id: 'g-30-3', title: '내 눈 주의 영광을 보네', key: 'G', bookNo: 29, type: '빠른 복음성가' },
      { id: 'g-30-4', title: '내게 허락하신 시련을 통해 (나는 믿네)', key: 'G', bookNo: 29, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 31,
    key: 'G',
    bookNumber: 30,
    title: 'G코드 #30',
    songs: [
      { id: 'g-31-1', title: '여기에 모인 우리', key: 'G', bookNo: 30, hymnNo: '찬송가 620장', type: '느린 찬송가' },
      { id: 'g-31-2', title: '나는 믿노라', key: 'G', bookNo: 30, type: '느린 복음성가' },
      { id: 'g-31-3', title: '성령 하나님 나를 만지소서', key: 'G', bookNo: 30, type: '느린 복음성가' },
      { id: 'g-31-4', title: '십자가를 참으신', key: 'G', bookNo: 30, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 32,
    key: 'G',
    bookNumber: 31,
    title: 'G코드 #31',
    songs: [
      { id: 'g-32-1', title: '아버지 사랑합니다', key: 'G', bookNo: 31, type: '느린 복음성가' },
      { id: 'g-32-2', title: '사랑합니다 나의 예수님', key: 'G', bookNo: 31, type: '느린 복음성가' },
      { id: 'g-32-3', title: '은혜 (내가 누려왔던 모든 것들이)', key: 'G', bookNo: 31, type: '느린 복음성가' },
      { id: 'g-32-4', title: '물 위를 걷는 자', key: 'G', bookNo: 31, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 33,
    key: 'G',
    bookNumber: 32,
    title: 'G코드 #32',
    songs: [
      { id: 'g-33-1', title: '하나님의 부르심', key: 'G', bookNo: 32, type: '느린 복음성가' },
      { id: 'g-33-2', title: '비 준비하시니', key: 'G', bookNo: 32, type: '느린 복음성가' },
      { id: 'g-33-3', title: '나의 영혼이 (오직 주만이)', key: 'G', bookNo: 32, type: '느린 복음성가' },
      { id: 'g-33-4', title: '충만', key: 'G', bookNo: 32, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 34,
    key: 'G',
    bookNumber: 33,
    title: 'G코드 #33',
    songs: [
      { id: 'g-34-1', title: '정결한 맘 주시옵소서', key: 'G', bookNo: 33, type: '느린 복음성가' },
      { id: 'g-34-2', title: '주 은혜임을', key: 'G', bookNo: 33, type: '느린 복음성가' },
      { id: 'g-34-3', title: '보소서 주님', key: 'G', bookNo: 33, type: '느린 복음성가' },
      { id: 'g-34-4', title: '우릴 사용하소서', key: 'G', bookNo: 33, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 35,
    key: 'G',
    bookNumber: 34,
    title: 'G코드 #34',
    songs: [
      { id: 'g-35-1', title: '세상의 유혹 시험이 (주를 찬양)', key: 'G', bookNo: 34, type: '느린 복음성가' },
      { id: 'g-35-2', title: '소원 (주님 내가 주의 장막을)', key: 'G', bookNo: 34, type: '느린 복음성가' },
      { id: 'g-35-3', title: '그 사랑 얼마나 (다 표현 못해도)', key: 'G', bookNo: 34, type: '느린 복음성가' },
      { id: 'g-35-4', title: '그 사랑 (아버지 사랑 내가 노래해)', key: 'G', bookNo: 34, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 36,
    key: 'G',
    bookNumber: 35,
    title: 'G코드 #35',
    songs: [
      { id: 'g-36-1', title: '나는 예배자입니다', key: 'G', bookNo: 35, type: '느린 복음성가' },
      { id: 'g-36-2', title: '지존하신 주님 이름 앞에', key: 'G', bookNo: 35, type: '느린 복음성가' },
      { id: 'g-36-3', title: '아름다우신 (내 안에 주를 향한 노래)', key: 'G', bookNo: 35, type: '느린 복음성가' },
      { id: 'g-36-4', title: '이 땅의 황무함을 보소서 (부흥)', key: 'G', bookNo: 35, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 37,
    key: 'G',
    bookNumber: 36,
    title: 'G코드 #36',
    songs: [
      { id: 'g-37-1', title: '마음이 상한 자를', key: 'G', bookNo: 36, type: '느린 복음성가' },
      { id: 'g-37-2', title: '더 원합니다 (예수 사랑합니다)', key: 'G', bookNo: 36, type: '느린 복음성가' },
      { id: 'g-37-3', title: '나의 모습 나의 소유', key: 'G', bookNo: 36, type: '느린 복음성가' },
      { id: 'g-37-4', title: '나는 주를 섬기는 것에 후회가 없습니다', key: 'G', bookNo: 36, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 38,
    key: 'G',
    bookNumber: 37,
    title: 'G코드 #37',
    songs: [
      { id: 'g-38-1', title: '당신이 지쳐서 (누군가 널 위해)', key: 'G', bookNo: 37, type: '느린 복음성가' },
      { id: 'g-38-2', title: '나의 기도하는 것보다', key: 'G', bookNo: 37, type: '느린 복음성가' },
      { id: 'g-38-3', title: '완전하신 나의 주 (예배합니다)', key: 'G', bookNo: 37, type: '느린 복음성가' },
      { id: 'g-38-4', title: '피난처 되시는 예수', key: 'G', bookNo: 37, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 39,
    key: 'G',
    bookNumber: 38,
    title: 'G코드 #38',
    songs: [
      { id: 'g-39-1', title: '수많은 무리들 줄지어 (예수 이름 높이세)', key: 'G', bookNo: 38, type: '빠른 복음성가' },
      { id: 'g-39-2', title: '주 여호와는 광대하시도다', key: 'G', bookNo: 38, type: '빠른 복음성가' },
      { id: 'g-39-3', title: '보라 너희는 두려워 말고', key: 'G', bookNo: 38, type: '빠른 복음성가' },
      { id: 'g-39-4', title: '예수의 이름으로', key: 'G', bookNo: 38, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 40,
    key: 'G',
    bookNumber: 39,
    title: 'G코드 #39',
    songs: [
      { id: 'g-40-1', title: '나의 백성이 (이 땅 고치소서)', key: 'G', bookNo: 39, type: '느린 복음성가' },
      { id: 'g-40-2', title: '주께 가오니', key: 'G', bookNo: 39, type: '느린 복음성가' },
      { id: 'g-40-3', title: '약할 때 강함 되시네 (주 나의 모든 것)', key: 'G', bookNo: 39, type: '느린 복음성가' },
      { id: 'g-40-4', title: '하나님은 우리의 피난처가 되시며', key: 'G', bookNo: 39, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 41,
    key: 'G',
    bookNumber: 40,
    title: 'G코드 #40',
    songs: [
      { id: 'g-41-1', title: '예수 우리 왕이여', key: 'G', bookNo: 40, type: '느린 복음성가' },
      { id: 'g-41-2', title: '꽃들도 (이곳에 생명샘 솟아나)', key: 'G', bookNo: 40, type: '느린 복음성가' },
      { id: 'g-41-3', title: '나의 가는 길', key: 'G', bookNo: 40, type: '느린 복음성가' },
      { id: 'g-41-4', title: '그가 오신 이유', key: 'G', bookNo: 40, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 42,
    key: 'G',
    bookNumber: 41,
    title: 'G코드 #41',
    songs: [
      { id: 'g-42-1', title: '여호와께 돌아가자 (Love Never Fails)', key: 'G', bookNo: 41, type: '느린 복음성가' },
      { id: 'g-42-2', title: '내 손을 주께 높이 듭니다', key: 'G', bookNo: 41, type: '느린 복음성가' },
      { id: 'g-42-3', title: '주님이 주신 땅으로 (이 산지를 내게 주소서)', key: 'G', bookNo: 41, type: '느린 복음성가' },
      { id: 'g-42-4', title: '사명', key: 'G', bookNo: 41, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 43,
    key: 'G',
    bookNumber: 42,
    title: 'G코드 #42',
    songs: [
      { id: 'g-43-1', title: '모든 영광을 하나님께', key: 'G', bookNo: 42, type: '느린 복음성가' },
      { id: 'g-43-2', title: '푯대를 향하여', key: 'G', bookNo: 42, type: '느린 복음성가' },
      { id: 'g-43-3', title: '이제 역전되리라 (기도를 멈추지 마라)', key: 'G', bookNo: 42, type: '느린 복음성가' },
      { id: 'g-43-4', title: '우리들을 위하여 (내 마음의 한 자리)', key: 'G', bookNo: 42, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 44,
    key: 'G',
    bookNumber: 43,
    title: 'G코드 #43',
    songs: [
      { id: 'g-44-1', title: '주 하나님 독생자 예수 (살아계신 주)', key: 'G', bookNo: 43, type: '느린 복음성가' },
      { id: 'g-44-2', title: '주님 다시 오실 때까지', key: 'G', bookNo: 43, type: '느린 복음성가' },
      { id: 'g-44-3', title: '주의 손에 나의 손을 포개고', key: 'G', bookNo: 43, type: '느린 복음성가' },
      { id: 'g-44-4', title: '하늘 보좌', key: 'G', bookNo: 43, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 45,
    key: 'G',
    bookNumber: 44,
    title: 'G코드 #44',
    songs: [
      { id: 'g-45-1', title: '주가 일하시네 (날이 저물어 갈 때)', key: 'G', bookNo: 44, type: '느린 복음성가' },
      { id: 'g-45-2', title: '아버지 당신의 마음이', key: 'G', bookNo: 44, type: '느린 복음성가' },
      { id: 'g-45-3', title: '오소서 진리의 성령님', key: 'G', bookNo: 44, type: '느린 복음성가' },
      { id: 'g-45-4', title: '왜 나만 겪는 고난이냐고', key: 'G', bookNo: 44, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 46,
    key: 'G',
    bookNumber: 45,
    title: 'G코드 #45',
    songs: [
      { id: 'g-46-1', title: '오 신실하신 주 (하나님 한번도 나를)', key: 'G', bookNo: 45, type: '느린 복음성가' },
      { id: 'g-46-2', title: '아무것도 두려워 말라', key: 'G', bookNo: 45, type: '느린 복음성가' },
      { id: 'g-46-3', title: '주의 도를 버리고', key: 'G', bookNo: 45, type: '느린 복음성가' },
      { id: 'g-46-4', title: '모든 이름 위에 뛰어난 이름', key: 'G', bookNo: 45, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 47,
    key: 'G',
    bookNumber: 46,
    title: 'G코드 #46',
    songs: [
      { id: 'g-47-1', title: '나의 믿음 주께 있네', key: 'G', bookNo: 46, type: '빠른 복음성가' },
      { id: 'g-47-2', title: '찬양하라 내 영혼아', key: 'G', bookNo: 46, hymnNo: '찬송가 621장', type: '느린 찬송가' },
      { id: 'g-47-3', title: '여호와 이스라엘의 구원자', key: 'G', bookNo: 46, type: '느린 복음성가' },
      { id: 'g-47-4', title: '사망의 그늘에 앉아 (원제: 그 날)', key: 'G', bookNo: 46, type: '느린 복음성가' },
    ],
  },

  // =================== C KEY (Pages 48 ~ 73) ===================
  {
    pageNumber: 48,
    key: 'C',
    bookNumber: 1,
    title: 'C코드 #1',
    songs: [
      { id: 'c-1-1', title: '세상 모든 풍파 너를 흔들어', key: 'C', bookNo: 1, hymnNo: '찬송가 429장', type: '빠른 찬송가' },
      { id: 'c-1-2', title: '내 주 하나님 넓고 큰 은혜는', key: 'C', bookNo: 1, hymnNo: '찬송가 302장', type: '느린 찬송가' },
      { id: 'c-1-3', title: '행군 나팔 소리에', key: 'C', bookNo: 1, hymnNo: '찬송가 360장', type: '빠른 찬송가' },
      { id: 'c-1-4', title: '구원으로 인도하는', key: 'C', bookNo: 1, hymnNo: '찬송가 521장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 49,
    key: 'C',
    bookNumber: 2,
    title: 'C코드 #2',
    songs: [
      { id: 'c-2-1', title: '이 기쁜 소식을', key: 'C', bookNo: 2, hymnNo: '찬송가 185장', type: '빠른 찬송가' },
      { id: 'c-2-2', title: '주 예수 크신 사랑', key: 'C', bookNo: 2, hymnNo: '찬송가 205장', type: '느린 찬송가' },
      { id: 'c-2-3', title: '십자가 군병 되어서', key: 'C', bookNo: 2, hymnNo: '찬송가 353장', type: '빠른 찬송가' },
      { id: 'c-2-4', title: '마귀들과 싸울지라', key: 'C', bookNo: 2, hymnNo: '찬송가 348장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 50,
    key: 'C',
    bookNumber: 3,
    title: 'C코드 #3',
    songs: [
      { id: 'c-3-1', title: '듣는 사람마다 복음 전하여', key: 'C', bookNo: 3, hymnNo: '찬송가 520장', type: '빠른 찬송가' },
      { id: 'c-3-2', title: '새벽부터 우리', key: 'C', bookNo: 3, hymnNo: '찬송가 496장', type: '빠른 찬송가' },
      { id: 'c-3-3', title: '이 세상의 모든 죄를', key: 'C', bookNo: 3, hymnNo: '찬송가 261장', type: '빠른 찬송가' },
      { id: 'c-3-4', title: '주 십자가를 지심으로', key: 'C', bookNo: 3, hymnNo: '찬송가 265장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 51,
    key: 'C',
    bookNumber: 4,
    title: 'C코드 #4',
    songs: [
      { id: 'c-4-1', title: '선한 목자 되신 우리 주', key: 'C', bookNo: 4, hymnNo: '찬송가 569장', type: '느린 찬송가' },
      { id: 'c-4-2', title: '예수 사랑하심은', key: 'C', bookNo: 4, hymnNo: '찬송가 563장', type: '느린 찬송가' },
      { id: 'c-4-3', title: '옳은 길 따르라 의의 길', key: 'C', bookNo: 4, hymnNo: '찬송가 516장', type: '빠른 찬송가' },
      { id: 'c-4-4', title: '울어도 못하네', key: 'C', bookNo: 4, hymnNo: '찬송가 544장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 52,
    key: 'C',
    bookNumber: 5,
    title: 'C코드 #5',
    songs: [
      { id: 'c-5-1', title: '주의 피로 이룬 샘물', key: 'C', bookNo: 5, hymnNo: '찬송가 266장', type: '빠른 찬송가' },
      { id: 'c-5-2', title: '정결하게 하는 샘이', key: 'C', bookNo: 5, hymnNo: '찬송가 264장', type: '빠른 찬송가' },
      { id: 'c-5-3', title: '황무지가 장미꽃 같이', key: 'C', bookNo: 5, hymnNo: '찬송가 242장', type: '빠른 찬송가' },
      { id: 'c-5-4', title: '은혜가 풍성한 하나님은', key: 'C', bookNo: 5, hymnNo: '찬송가 197장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 53,
    key: 'C',
    bookNumber: 6,
    title: 'C코드 #6',
    songs: [
      { id: 'c-6-1', title: '생명의 주여 면류관', key: 'C', bookNo: 6, hymnNo: '찬송가 154장', type: '느린 찬송가' },
      { id: 'c-6-2', title: '예수가 거느리시니', key: 'C', bookNo: 6, hymnNo: '찬송가 390장', type: '느린 찬송가' },
      { id: 'c-6-3', title: '주를 앙모하는 자', key: 'C', bookNo: 6, hymnNo: '찬송가 354장', type: '빠른 찬송가' },
      { id: 'c-6-4', title: '참 즐거운 이 노래를', key: 'C', bookNo: 6, hymnNo: '찬송가 482장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 54,
    key: 'C',
    bookNumber: 7,
    title: 'C코드 #7',
    songs: [
      { id: 'c-7-1', title: '내 주 하나님 넓고 큰 은혜는', key: 'C', bookNo: 7, hymnNo: '찬송가 302장', type: '느린 찬송가' },
      { id: 'c-7-2', title: '이 세상의 모든 죄를', key: 'C', bookNo: 7, hymnNo: '찬송가 261장', type: '빠른 찬송가' },
      { id: 'c-7-3', title: '나의 기쁨 나의 소망 되시며', key: 'C', bookNo: 7, hymnNo: '찬송가 95장', type: '느린 찬송가' },
      { id: 'c-7-4', title: '오랫동안 모든 죄 가운데 빠져', key: 'C', bookNo: 7, type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 55,
    key: 'C',
    bookNumber: 8,
    title: 'C코드 #8',
    songs: [
      { id: 'c-8-1', title: '주의 곁에 있을 때', key: 'C', bookNo: 8, hymnNo: '찬송가 401장', type: '느린 찬송가' },
      { id: 'c-8-2', title: '저 요단강 건너편에', key: 'C', bookNo: 8, hymnNo: '찬송가 243장', type: '빠른 찬송가' },
      { id: 'c-8-3', title: '나의 맘에 근심 구름', key: 'C', bookNo: 8, hymnNo: '찬송가 83장', type: '느린 찬송가' },
      { id: 'c-8-4', title: '찬송으로 보답할 수 없는', key: 'C', bookNo: 8, hymnNo: '찬송가 40장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 56,
    key: 'C',
    bookNumber: 9,
    title: 'C코드 #9',
    songs: [
      { id: 'c-9-1', title: '내 주는 강한 성이요', key: 'C', bookNo: 9, hymnNo: '찬송가 585장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 57,
    key: 'C',
    bookNumber: 10,
    title: 'C코드 #10',
    songs: [
      { id: 'c-10-1', title: '내 주의 보혈은', key: 'C', bookNo: 10, hymnNo: '찬송가 254장', type: '빠른 찬송가' },
      { id: 'c-10-2', title: '내 맘의 주여 소망되소서', key: 'C', bookNo: 10, hymnNo: '찬송가 484장', type: '느린 찬송가' },
      { id: 'c-10-3', title: '그 크신 하나님의 사랑', key: 'C', bookNo: 10, hymnNo: '찬송가 304장', type: '느린 찬송가' },
      { id: 'c-10-4', title: '주 예수보다 더 귀한 것은 없네', key: 'C', bookNo: 10, hymnNo: '찬송가 94장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 58,
    key: 'C',
    bookNumber: 11,
    title: 'C코드 #11',
    songs: [
      { id: 'c-11-1', title: '눈을 들어 산을 보니', key: 'C', bookNo: 11, hymnNo: '찬송가 383장', type: '느린 찬송가' },
      { id: 'c-11-2', title: '지금까지 지내온 것', key: 'C', bookNo: 11, hymnNo: '찬송가 301장', type: '느린 찬송가' },
      { id: 'c-11-3', title: '복의 근원 강림하사', key: 'C', bookNo: 11, hymnNo: '찬송가 28장', type: '느린 찬송가' },
      { id: 'c-11-4', title: '오 하나님 우리의 창조주시니', key: 'C', bookNo: 11, hymnNo: '찬송가 68장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 59,
    key: 'C',
    bookNumber: 12,
    title: 'C코드 #12',
    songs: [
      { id: 'c-12-1', title: '주 날개 밑 내가 편안히 쉬네', key: 'C', bookNo: 12, hymnNo: '찬송가 419장', type: '느린 찬송가' },
      { id: 'c-12-2', title: '예수 사랑하심은', key: 'C', bookNo: 12, hymnNo: '찬송가 563장', type: '느린 찬송가' },
      { id: 'c-12-3', title: '예수로 나의 구주삼고 (4/4)', key: 'C', bookNo: 12, hymnNo: '찬송가 288장', type: '느린 찬송가' },
      { id: 'c-12-4', title: '십자가 그늘 아래', key: 'C', bookNo: 12, hymnNo: '찬송가 415장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 60,
    key: 'C',
    bookNumber: 13,
    title: 'C코드 #13',
    songs: [
      { id: 'c-13-1', title: '귀하신 주여 날 붙드사', key: 'C', bookNo: 13, hymnNo: '찬송가 433장', type: '느린 찬송가' },
      { id: 'c-13-2', title: '돌아와 돌아와', key: 'C', bookNo: 13, hymnNo: '찬송가 525장', type: '느린 찬송가' },
      { id: 'c-13-3', title: '내 평생에 가는 길', key: 'C', bookNo: 13, hymnNo: '찬송가 413장', type: '느린 찬송가' },
      { id: 'c-13-4', title: '내게 있는 모든 것을', key: 'C', bookNo: 13, hymnNo: '찬송가 50장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 61,
    key: 'C',
    bookNumber: 14,
    title: 'C코드 #14',
    songs: [
      { id: 'c-14-1', title: '아 하나님의 은혜로', key: 'C', bookNo: 14, hymnNo: '찬송가 310장', type: '느린 찬송가' },
      { id: 'c-14-2', title: '구주께서 부르되', key: 'C', bookNo: 14, hymnNo: '찬송가 519장', type: '느린 찬송가' },
      { id: 'c-14-3', title: '내 주여 뜻대로', key: 'C', bookNo: 14, hymnNo: '찬송가 549장', type: '느린 찬송가' },
      { id: 'c-14-4', title: '나 주의 도움 받고자', key: 'C', bookNo: 14, hymnNo: '찬송가 214장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 62,
    key: 'C',
    bookNumber: 15,
    title: 'C코드 #15',
    songs: [
      { id: 'c-15-1', title: '하늘에 가득 찬 영광의 하나님', key: 'C', bookNo: 15, hymnNo: '찬송가 9장', type: '느린 찬송가' },
      { id: 'c-15-2', title: '오 놀라운 구세주', key: 'C', bookNo: 15, hymnNo: '찬송가 391장', type: '느린 찬송가' },
      { id: 'c-15-3', title: '예수를 나의 구주삼고 (9/8)', key: 'C', bookNo: 15, hymnNo: '찬송가 288장', type: '느린 찬송가' },
      { id: 'c-15-4', title: '내 모든 시험 무거운 짐을', key: 'C', bookNo: 15, hymnNo: '찬송가 337장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 63,
    key: 'C',
    bookNumber: 16,
    title: 'C코드 #16',
    songs: [
      { id: 'c-16-1', title: '내 너를 위하여', key: 'C', bookNo: 16, hymnNo: '찬송가 311장', type: '느린 찬송가' },
      { id: 'c-16-2', title: '내 기도하는 그 시간', key: 'C', bookNo: 16, hymnNo: '찬송가 364장', type: '느린 찬송가' },
      { id: 'c-16-3', title: '불을 내려 주소서', key: 'C', bookNo: 16, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 64,
    key: 'C',
    bookNumber: 17,
    title: 'C코드 #17',
    songs: [
      { id: 'c-17-1', title: '세상에서 방황할 때', key: 'C', bookNo: 17, type: '느린 복음성가' },
      { id: 'c-17-2', title: '목마른 사슴', key: 'C', bookNo: 17, type: '느린 복음성가' },
      { id: 'c-17-3', title: '모든 이름 위에 뛰어난 이름', key: 'C', bookNo: 17, type: '느린 복음성가' },
      { id: 'c-17-4', title: '아버지 당신의 마음이', key: 'C', bookNo: 17, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 65,
    key: 'C',
    bookNumber: 18,
    title: 'C코드 #18',
    songs: [
      { id: 'c-18-1', title: '말씀 앞에서', key: 'C', bookNo: 18, type: '느린 복음성가' },
      { id: 'c-18-2', title: '내게 있는 향유옥합', key: 'C', bookNo: 18, type: '느린 복음성가' },
      { id: 'c-18-3', title: '내일 일은 난 몰라요', key: 'C', bookNo: 18, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 66,
    key: 'C',
    bookNumber: 19,
    title: 'C코드 #19',
    songs: [
      { id: 'c-19-1', title: '나를 지으신 이가 하나님 (하나님의 은혜)', key: 'C', bookNo: 19, type: '느린 복음성가' },
      { id: 'c-19-2', title: '하나님의 음성을 (시편 40편)', key: 'C', bookNo: 19, type: '느린 복음성가' },
      { id: 'c-19-3', title: '힘들고 지쳐 (너는 내 아들이라)', key: 'C', bookNo: 19, type: '느린 복음성가' },
      { id: 'c-19-4', title: '주품에 (Still)', key: 'C', bookNo: 19, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 67,
    key: 'C',
    bookNumber: 20,
    title: 'C코드 #20',
    songs: [
      { id: 'c-20-1', title: '사명', key: 'C', bookNo: 20, type: '느린 복음성가' },
      { id: 'c-20-2', title: '사랑하셔서 오시었네', key: 'C', bookNo: 20, type: '느린 복음성가' },
      { id: 'c-20-3', title: '나는 주를 섬기는 것에 후회가 없습니다', key: 'C', bookNo: 20, type: '느린 복음성가' },
      { id: 'c-20-4', title: '나의 모든 행실을', key: 'C', bookNo: 20, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 68,
    key: 'C',
    bookNumber: 21,
    title: 'C코드 #21',
    songs: [
      { id: 'c-21-1', title: '주님 말씀하시면', key: 'C', bookNo: 21, type: '느린 복음성가' },
      { id: 'c-21-2', title: '주님 내가 여기 있사오니 (나를 받으옵소서)', key: 'C', bookNo: 21, type: '느린 복음성가' },
      { id: 'c-21-3', title: '주 앞에 나와 (온전케 되리)', key: 'C', bookNo: 21, type: '느린 복음성가' },
      { id: 'c-21-4', title: '주님 나를 부르시니', key: 'C', bookNo: 21, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 69,
    key: 'C',
    bookNumber: 22,
    title: 'C코드 #22',
    songs: [
      { id: 'c-22-1', title: '이 땅의 동과 서 남과 북', key: 'C', bookNo: 22, type: '느린 복음성가' },
      { id: 'c-22-2', title: '이제 내가 살아도', key: 'C', bookNo: 22, type: '느린 복음성가' },
      { id: 'c-22-3', title: '우리 모일 때 주 성령 임하리', key: 'C', bookNo: 22, type: '느린 복음성가' },
      { id: 'c-22-4', title: '하늘소망 (주님 그 나라에 이를 때까지)', key: 'C', bookNo: 22, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 70,
    key: 'C',
    bookNumber: 23,
    title: 'C코드 #23',
    songs: [
      { id: 'c-23-1', title: '예수 사랑해요', key: 'C', bookNo: 23, type: '느린 복음성가' },
      { id: 'c-23-2', title: '예수 나의 좋은 치료자', key: 'C', bookNo: 23, type: '느린 복음성가' },
      { id: 'c-23-3', title: '주님의 성령 지금 이곳에', key: 'C', bookNo: 23, type: '느린 복음성가' },
      { id: 'c-23-4', title: '오직 주의 은혜로', key: 'C', bookNo: 23, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 71,
    key: 'C',
    bookNumber: 24,
    title: 'C코드 #24',
    songs: [
      { id: 'c-24-1', title: '십자가의 전달자 (난 지극히 작은 자)', key: 'C', bookNo: 24, type: '느린 복음성가' },
      { id: 'c-24-2', title: '신실하게 진실하게', key: 'C', bookNo: 24, type: '느린 복음성가' },
      { id: 'c-24-3', title: '약한 나로 강하게', key: 'C', bookNo: 24, type: '느린 복음성가' },
      { id: 'c-24-4', title: '시편 8편 (여호와 우리 주여)', key: 'C', bookNo: 24, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 72,
    key: 'C',
    bookNumber: 25,
    title: 'C코드 #25',
    songs: [
      { id: 'c-25-1', title: '오 신실하신 주', key: 'C', bookNo: 25, type: '느린 찬송가' },
      { id: 'c-25-2', title: '다시 복음 앞에 (많은 이들 말하고)', key: 'C', bookNo: 25, type: '느린 복음성가' },
      { id: 'c-25-3', title: '내 영혼 지치고 (날 세우시네)', key: 'C', bookNo: 25, type: '느린 복음성가' },
      { id: 'c-25-4', title: '내 구주 예수님', key: 'C', bookNo: 25, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 73,
    key: 'C',
    bookNumber: 26,
    title: 'C코드 #26',
    songs: [
      { id: 'c-26-1', title: '날마다 숨쉬는 순간마다', key: 'C', bookNo: 26, type: '느린 찬송가' },
      { id: 'c-26-2', title: '내 안에 사는 이', key: 'C', bookNo: 26, type: '느린 복음성가' },
      { id: 'c-26-3', title: '주는 평화', key: 'C', bookNo: 26, type: '느린 복음성가' },
      { id: 'c-26-4', title: '실로암', key: 'C', bookNo: 26, type: '빠른 복음성가' },
    ],
  },

  // =================== E KEY (Pages 74 ~ 97) ===================
  {
    pageNumber: 74,
    key: 'E',
    bookNumber: 1,
    title: 'E코드 #1',
    songs: [
      { id: 'e-1-1', title: '구원으로 인도하는', key: 'E', bookNo: 1, hymnNo: '찬송가 521장', type: '빠른 찬송가' },
      { id: 'e-1-2', title: '마음에 가득한 의심을 깨치고', key: 'E', bookNo: 1, hymnNo: '찬송가 257장', type: '빠른 찬송가' },
      { id: 'e-1-3', title: '선한 목자 되신 우리 주', key: 'E', bookNo: 1, hymnNo: '찬송가 569장', type: '느린 찬송가' },
      { id: 'e-1-4', title: '내 진정 사모하는', key: 'E', bookNo: 1, hymnNo: '찬송가 88장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 75,
    key: 'E',
    bookNumber: 2,
    title: 'E코드 #2',
    songs: [
      { id: 'e-2-1', title: '어둔 밤 쉬 되리니', key: 'E', bookNo: 2, hymnNo: '찬송가 330장', type: '빠른 찬송가' },
      { id: 'e-2-2', title: '행군 나팔 소리에', key: 'E', bookNo: 2, hymnNo: '찬송가 360장', type: '빠른 찬송가' },
      { id: 'e-2-3', title: '죄짐 맡은 우리 구주', key: 'E', bookNo: 2, hymnNo: '찬송가 369장', type: '느린 찬송가' },
      { id: 'e-2-4', title: '구주 예수 의지함이', key: 'E', bookNo: 2, hymnNo: '찬송가 542장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 76,
    key: 'E',
    bookNumber: 3,
    title: 'E코드 #3',
    songs: [
      { id: 'e-3-1', title: '빛의 사자들이여', key: 'E', bookNo: 3, hymnNo: '찬송가 502장', type: '빠른 찬송가' },
      { id: 'e-3-2', title: '주가 맡긴 모든 역사', key: 'E', bookNo: 3, hymnNo: '찬송가 240장', type: '느린 찬송가' },
      { id: 'e-3-3', title: '이 눈에 아무증거 아니 뵈어도', key: 'E', bookNo: 3, hymnNo: '찬송가 545장', type: '빠른 찬송가' },
      { id: 'e-3-4', title: '성도여 다 함께', key: 'E', bookNo: 3, hymnNo: '찬송가 29장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 77,
    key: 'E',
    bookNumber: 4,
    title: 'E코드 #4',
    songs: [
      { id: 'e-4-1', title: '보아라 즐거운 우리 집', key: 'E', bookNo: 4, hymnNo: '찬송가 235장', type: '빠른 찬송가' },
      { id: 'e-4-2', title: '주 없이 살 수 없네', key: 'E', bookNo: 4, hymnNo: '찬송가 292장', type: '느린 찬송가' },
      { id: 'e-4-3', title: '주는 나를 기르시는 목자', key: 'E', bookNo: 4, hymnNo: '찬송가 570장', type: '느린 찬송가' },
      { id: 'e-4-4', title: '내 죄 사함 받고서', key: 'E', bookNo: 4, type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 78,
    key: 'E',
    bookNumber: 5,
    title: 'E코드 #5',
    songs: [
      { id: 'e-5-1', title: '인애하신 구세주여', key: 'E', bookNo: 5, hymnNo: '찬송가 279장', type: '느린 찬송가' },
      { id: 'e-5-2', title: '은혜가 풍성한 하나님은', key: 'E', bookNo: 5, hymnNo: '찬송가 197장', type: '빠른 찬송가' },
      { id: 'e-5-3', title: '주와 같이 길 가는 것', key: 'E', bookNo: 5, hymnNo: '찬송가 456장', type: '빠른 찬송가' },
      { id: 'e-5-4', title: '목마른 내 영혼', key: 'E', bookNo: 5, hymnNo: '찬송가 309장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 79,
    key: 'E',
    bookNumber: 6,
    title: 'E코드 #6',
    songs: [
      { id: 'e-6-1', title: '나 속죄함을 받은 후', key: 'E', bookNo: 6, hymnNo: '찬송가 283장', type: '빠른 찬송가' },
      { id: 'e-6-2', title: '불길 같은 주 성령', key: 'E', bookNo: 6, hymnNo: '찬송가 184장', type: '빠른 찬송가' },
      { id: 'e-6-3', title: '나 이제 주님의 새 생명 얻은 몸', key: 'E', bookNo: 6, hymnNo: '찬송가 436장', type: '빠른 찬송가' },
      { id: 'e-6-4', title: '예수님은 누구신가', key: 'E', bookNo: 6, hymnNo: '찬송가 96장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 80,
    key: 'E',
    bookNumber: 7,
    title: 'E코드 #7',
    songs: [
      { id: 'e-7-1', title: '나의 영원하신 기업', key: 'E', bookNo: 7, hymnNo: '찬송가 435장', type: '느린 찬송가' },
      { id: 'e-7-2', title: '나 같은 죄인 살리신', key: 'E', bookNo: 7, hymnNo: '찬송가 305장', type: '느린 찬송가' },
      { id: 'e-7-3', title: '비바람이 칠 때와', key: 'E', bookNo: 7, hymnNo: '찬송가 388장', type: '느린 찬송가' },
      { id: 'e-7-4', title: '구주와 함께 나 죽었으니', key: 'E', bookNo: 7, hymnNo: '찬송가 407장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 81,
    key: 'E',
    bookNumber: 8,
    title: 'E코드 #8',
    songs: [
      { id: 'e-8-1', title: '주님 찾아 오셨네', key: 'E', bookNo: 8, hymnNo: '찬송가 534장', type: '느린 찬송가' },
      { id: 'e-8-2', title: '나의 갈길 다 가도록', key: 'E', bookNo: 8, hymnNo: '찬송가 384장', type: '빠른 찬송가' },
      { id: 'e-8-3', title: '먹보다도 더 검은', key: 'E', bookNo: 8, hymnNo: '찬송가 423장', type: '빠른 찬송가' },
      { id: 'e-8-4', title: '성자의 귀한 몸', key: 'E', bookNo: 8, hymnNo: '찬송가 216장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 82,
    key: 'E',
    bookNumber: 9,
    title: 'E코드 #9',
    songs: [
      { id: 'e-9-1', title: '우리는 주님을 늘 배반하나', key: 'E', bookNo: 9, hymnNo: '찬송가 290장', type: '느린 찬송가' },
      { id: 'e-9-2', title: '예수 나를 오라 하네', key: 'E', bookNo: 9, hymnNo: '찬송가 324장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 83,
    key: 'E',
    bookNumber: 10,
    title: 'E코드 #10',
    songs: [
      { id: 'e-10-1', title: '예수가 우리를 부르는 소리', key: 'E', bookNo: 10, hymnNo: '찬송가 528장', type: '느린 찬송가' },
      { id: 'e-10-2', title: '어려운 일 당할 때', key: 'E', bookNo: 10, hymnNo: '찬송가 543장', type: '느린 찬송가' },
      { id: 'e-10-3', title: '여러 해 동안 주를 떠나', key: 'E', bookNo: 10, hymnNo: '찬송가 278장', type: '느린 찬송가' },
      { id: 'e-10-4', title: '예수를 위하여', key: 'E', bookNo: 10, hymnNo: '찬송가 144장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 84,
    key: 'E',
    bookNumber: 11,
    title: 'E코드 #11',
    songs: [
      { id: 'e-11-1', title: '빛나고 높은 보좌와', key: 'E', bookNo: 11, hymnNo: '찬송가 27장', type: '빠른 찬송가' },
      { id: 'e-11-2', title: '너희 마음에 슬픔이 가득할 때', key: 'E', bookNo: 11, hymnNo: '찬송가 458장', type: '느린 찬송가' },
      { id: 'e-11-3', title: '주여 지난 밤 내 꿈에', key: 'E', bookNo: 11, hymnNo: '찬송가 490장', type: '느린 찬송가' },
      { id: 'e-11-4', title: '너 시험을 당해', key: 'E', bookNo: 11, hymnNo: '찬송가 342장', type: '빠른 찬송가' },
    ],
  },
  {
    pageNumber: 85,
    key: 'E',
    bookNumber: 12,
    title: 'E코드 #12',
    songs: [
      { id: 'e-12-1', title: '내 주여 뜻대로', key: 'E', bookNo: 12, hymnNo: '찬송가 549장', type: '느린 찬송가' },
      { id: 'e-12-2', title: '천부여 의지 없어서', key: 'E', bookNo: 12, hymnNo: '찬송가 280장', type: '느린 찬송가' },
    ],
  },
  {
    pageNumber: 86,
    key: 'E',
    bookNumber: 13,
    title: 'E코드 #13',
    songs: [
      { id: 'e-13-1', title: '내게 강 같은 평화', key: 'E', bookNo: 13, type: '빠른 찬송가' },
      { id: 'e-13-2', title: '성령 받으라', key: 'E', bookNo: 13, type: '빠른 복음성가' },
      { id: 'e-13-3', title: '내가 어둠속에서', key: 'E', bookNo: 13, type: '빠른 복음성가' },
      { id: 'e-13-4', title: '나의 등 뒤에서', key: 'E', bookNo: 13, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 87,
    key: 'E',
    bookNumber: 14,
    title: 'E코드 #14',
    songs: [
      { id: 'e-14-1', title: '크신 주께 영광 돌리세', key: 'E', bookNo: 14, type: '빠른 복음성가' },
      { id: 'e-14-2', title: '기도하자 우리 마음 합하여', key: 'E', bookNo: 14, type: '빠른 복음성가' },
      { id: 'e-14-3', title: '예수 이름으로', key: 'E', bookNo: 14, type: '빠른 복음성가' },
      { id: 'e-14-4', title: '나 주의 믿음 갖고', key: 'E', bookNo: 14, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 88,
    key: 'E',
    bookNumber: 15,
    title: 'E코드 #15',
    songs: [
      { id: 'e-15-1', title: '내 갈급함 (어느 것으로 채울 수 없는)', key: 'E', bookNo: 15, type: '느린 복음성가' },
      { id: 'e-15-2', title: '모든 상황속에서', key: 'E', bookNo: 15, type: '느린 복음성가' },
      { id: 'e-15-3', title: '우리 함께 기도해', key: 'E', bookNo: 15, type: '느린 복음성가' },
      { id: 'e-15-4', title: '아바 아버지', key: 'E', bookNo: 15, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 89,
    key: 'E',
    bookNumber: 16,
    title: 'E코드 #16',
    songs: [
      { id: 'e-16-1', title: '좋으신 하나님', key: 'E', bookNo: 16, type: '느린 찬송가' },
      { id: 'e-16-2', title: '나는 아무것도 아닙니다', key: 'E', bookNo: 16, type: '느린 복음성가' },
      { id: 'e-16-3', title: '하늘소망 (주님 그 나라에 이를 때까지)', key: 'E', bookNo: 16, type: '느린 복음성가' },
      { id: 'e-16-4', title: '넘지 못할 산이 있거든', key: 'E', bookNo: 16, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 90,
    key: 'E',
    bookNumber: 17,
    title: 'E코드 #17',
    songs: [
      { id: 'e-17-1', title: '두 손 들고 찬양합니다', key: 'E', bookNo: 17, type: '느린 복음성가' },
      { id: 'e-17-2', title: '감사 (오늘 숨을 쉬는 것 감사)', key: 'E', bookNo: 17, type: '느린 복음성가' },
      { id: 'e-17-3', title: '이 땅의 황무함을 보소서 (부흥)', key: 'E', bookNo: 17, type: '느린 복음성가' },
      { id: 'e-17-4', title: '보소서 주님', key: 'E', bookNo: 17, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 91,
    key: 'E',
    bookNumber: 18,
    title: 'E코드 #18',
    songs: [
      { id: 'e-18-1', title: '꽃들도 (이곳에 생명샘 솟아나)', key: 'E', bookNo: 18, type: '느린 복음성가' },
      { id: 'e-18-2', title: '더 원합니다 (예수 사랑합니다)', key: 'E', bookNo: 18, type: '느린 복음성가' },
      { id: 'e-18-3', title: '하늘 보좌 (내 하나님 서신 발 앞에)', key: 'E', bookNo: 18, type: '느린 복음성가' },
      { id: 'e-18-4', title: '주를 위한 이곳에', key: 'E', bookNo: 18, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 92,
    key: 'E',
    bookNumber: 19,
    title: 'E코드 #19',
    songs: [
      { id: 'e-19-1', title: '원하고 바라고 기도합니다', key: 'E', bookNo: 19, type: '느린 복음성가' },
      { id: 'e-19-2', title: '우리 모일 때 주 성령 임하리', key: 'E', bookNo: 19, type: '느린 복음성가' },
      { id: 'e-19-3', title: '완전하신 나의 주 (예배합니다)', key: 'E', bookNo: 19, type: '느린 복음성가' },
      { id: 'e-19-4', title: '온 맘 다해 (주님과 함께하는 이 고요한 시간)', key: 'E', bookNo: 19, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 93,
    key: 'E',
    bookNumber: 20,
    title: 'E코드 #20',
    songs: [
      { id: 'e-20-1', title: '세상 흔들리고 (오직 믿음으로)', key: 'E', bookNo: 20, type: '느린 복음성가' },
      { id: 'e-20-2', title: '나를 지으신 주님 (내 이름 아시죠)', key: 'E', bookNo: 20, type: '느린 복음성가' },
      { id: 'e-20-3', title: '세상 모든 민족이 (물이 바다 덮음 같이)', key: 'E', bookNo: 20, type: '빠른 복음성가' },
      { id: 'e-20-4', title: '오직 주의 사랑에 매여', key: 'E', bookNo: 20, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 94,
    key: 'E',
    bookNumber: 21,
    title: 'E코드 #21',
    songs: [
      { id: 'e-21-1', title: '내 삶의 이유라 (예수는 내 힘이요)', key: 'E', bookNo: 21, type: '느린 복음성가' },
      { id: 'e-21-2', title: '예수의 길 (안개속에서 주님을 보네)', key: 'E', bookNo: 21, type: '느린 복음성가' },
      { id: 'e-21-3', title: '신실하게 진실하게', key: 'E', bookNo: 21, type: '느린 복음성가' },
      { id: 'e-21-4', title: '교회여 일어나라', key: 'E', bookNo: 21, type: '빠른 복음성가' },
    ],
  },
  {
    pageNumber: 95,
    key: 'E',
    bookNumber: 22,
    title: 'E코드 #22',
    songs: [
      { id: 'e-22-1', title: '예수 피를 힘입어 (주의 보좌로 나아갈 때에)', key: 'E', bookNo: 22, type: '느린 복음성가' },
      { id: 'e-22-2', title: '주를 향한 나의 사랑을', key: 'E', bookNo: 22, type: '느린 복음성가' },
      { id: 'e-22-3', title: '나 무엇과도 주님을', key: 'E', bookNo: 22, type: '느린 복음성가' },
      { id: 'e-22-4', title: '부르신 곳에서 (따스한 성령님)', key: 'E', bookNo: 22, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 96,
    key: 'E',
    bookNumber: 23,
    title: 'E코드 #23',
    songs: [
      { id: 'e-23-1', title: '거룩하신 하나님 주께 감사드리세', key: 'E', bookNo: 23, type: '느린 복음성가' },
      { id: 'e-23-2', title: '날마다 숨쉬는 순간마다', key: 'E', bookNo: 23, type: '느린 찬송가' },
      { id: 'e-23-3', title: '하나님은 너를 지키시는 자', key: 'E', bookNo: 23, type: '느린 복음성가' },
      { id: 'e-23-4', title: '행복 (화려하지 않아도)', key: 'E', bookNo: 23, type: '느린 복음성가' },
    ],
  },
  {
    pageNumber: 97,
    key: 'E',
    bookNumber: 24,
    title: 'E코드 #24',
    songs: [
      { id: 'e-24-1', title: '시선 (내게로부터 눈을 들어)', key: 'E', bookNo: 24, type: '느린 복음성가' },
      { id: 'e-24-2', title: '수많은 무리들 줄지어 (원제: 예수 이름 높이세)', key: 'E', bookNo: 24, type: '빠른 복음성가' },
    ],
  },

  // =================== 목차 INDEX PAGES (Pages 98 ~ 101) ===================
  {
    pageNumber: 98,
    key: 'INDEX',
    title: 'G Key 목차 (ㄱ~ㅅ)',
    songs: [
      { id: 'idx-98-1', title: 'G Key 빠른 찬송가 / 느린 찬송가 / 빠른 복음성가 / 느린 복음성가 (ㄱ~ㅅ)', key: 'G', bookNo: 98, type: '목차' },
    ],
  },
  {
    pageNumber: 99,
    key: 'INDEX',
    title: 'G Key 목차 (ㅇ~ㅎ)',
    songs: [
      { id: 'idx-99-1', title: 'G Key 빠른 찬송가 / 느린 찬송가 / 빠른 복음성가 / 느린 복음성가 (ㅇ~ㅎ)', key: 'G', bookNo: 99, type: '목차' },
    ],
  },
  {
    pageNumber: 100,
    key: 'INDEX',
    title: 'C Key 목차 (찬송가 / 복음성가)',
    songs: [
      { id: 'idx-100-1', title: 'C Key 빠른 찬송가 / 느린 찬송가 / 느린 복음성가 색인', key: 'C', bookNo: 100, type: '목차' },
    ],
  },
  {
    pageNumber: 101,
    key: 'INDEX',
    title: 'E Key 목차 (찬송가 / 복음성가)',
    songs: [
      { id: 'idx-101-1', title: 'E Key 빠른 찬송가 / 느린 찬송가 / 빠른 복음성가 / 느린 복음성가 색인', key: 'E', bookNo: 101, type: '목차' },
    ],
  },
];

// Helper to find page number for a song
export function findPageForSong(title: string, key?: string): number | null {
  const cleanTitle = title.trim().toLowerCase();
  for (const page of SCORE_PAGES) {
    if (key && key !== '전체' && page.key !== key && page.key !== 'INDEX') continue;
    for (const s of page.songs) {
      if (
        s.title.toLowerCase().includes(cleanTitle) ||
        cleanTitle.includes(s.title.toLowerCase())
      ) {
        return page.pageNumber;
      }
    }
  }
  return null;
}

// Find starting page number for a given Key
export function getStartingPageForKey(key: 'G' | 'C' | 'E' | 'INDEX' | string): number {
  switch (key) {
    case 'G':
      return 1;
    case 'C':
      return 48;
    case 'E':
      return 74;
    case 'INDEX':
      return 98;
    default:
      return 1;
  }
}

// Find page by Key & Book Number (#0~#46 for G, #1~#26 for C, #1~#24 for E)
export function findPageByKeyAndBookNo(key: 'G' | 'C' | 'E', bookNo: number): number | null {
  const match = SCORE_PAGES.find(
    (p) => p.key === key && (p.bookNumber === bookNo || (p.songs && p.songs.some((s) => s.bookNo === bookNo)))
  );
  return match ? match.pageNumber : null;
}

export interface SongNumberSearchResult {
  pageNumber: number;
  song?: ScorePageSong;
  title: string;
  key?: 'G' | 'C' | 'E' | 'INDEX';
  bookNo?: number;
  matchType?: 'KEY_BOOK' | 'PAGE' | 'BOOK_NO' | 'HYMN' | 'TITLE';
}

// Find page by general song/book number across all keys or specified key
// Supports: "E코드 #2", "E#2", "e2", "2", "#2", "75", "75쪽", "찬송가 330장", etc.
export function findPageBySongNumber(
  query: string | number,
  currentKey?: 'G' | 'C' | 'E' | 'INDEX' | string
): SongNumberSearchResult | null {
  if (query === undefined || query === null) return null;
  const rawStr = String(query).trim();
  if (!rawStr) return null;

  // 1. Check Key + BookNo pattern: "E코드 #2", "E코드 2", "E#2", "e2", "e 2", "E-2", "E 2번", "c#5", etc.
  const keyBookMatch = rawStr.match(/^([gceGCE])\s*(?:코드)?\s*#?\s*(\d+)/i);
  if (keyBookMatch) {
    const matchedKey = keyBookMatch[1].toUpperCase() as 'G' | 'C' | 'E';
    const bookNum = parseInt(keyBookMatch[2], 10);
    const page = SCORE_PAGES.find(
      (p) => p.key === matchedKey && (p.bookNumber === bookNum || (p.songs && p.songs.some((s) => s.bookNo === bookNum)))
    );
    if (page) {
      const song = page.songs.find((s) => s.bookNo === bookNum) || page.songs[0];
      return {
        pageNumber: page.pageNumber,
        song,
        title: page.title,
        key: page.key,
        bookNo: bookNum,
        matchType: 'KEY_BOOK',
      };
    }
  }

  // 2. Check pure digits or "#" + digits
  const pureNumMatch = rawStr.match(/^#?\s*(\d+)$/);
  if (pureNumMatch) {
    const num = parseInt(pureNumMatch[1], 10);

    // If current key specified (e.g. currently viewing E-key, user inputs 2 -> finds E#2 = page 75)
    if (currentKey && currentKey !== ('INDEX' as any)) {
      const keyPage = SCORE_PAGES.find(
        (p) => p.key === currentKey && (p.bookNumber === num || (p.songs && p.songs.some((s) => s.bookNo === num)))
      );
      if (keyPage) {
        const song = keyPage.songs.find((s) => s.bookNo === num) || keyPage.songs[0];
        return {
          pageNumber: keyPage.pageNumber,
          song,
          title: keyPage.title,
          key: keyPage.key,
          bookNo: num,
          matchType: 'BOOK_NO',
        };
      }
    }

    // Direct page number match (1 ~ 101) if no book number in current key
    if (num >= 1 && num <= 101 && !currentKey) {
      const directPage = SCORE_PAGES.find((p) => p.pageNumber === num);
      if (directPage) {
        return {
          pageNumber: directPage.pageNumber,
          song: directPage.songs[0],
          title: directPage.title,
          key: directPage.key,
          bookNo: directPage.bookNumber,
          matchType: 'PAGE',
        };
      }
    }

    // Search book number across all pages
    for (const page of SCORE_PAGES) {
      if (page.bookNumber === num) {
        return {
          pageNumber: page.pageNumber,
          song: page.songs[0],
          title: page.title,
          key: page.key,
          bookNo: num,
          matchType: 'BOOK_NO',
        };
      }
      const songMatch = page.songs.find((s) => s.bookNo === num);
      if (songMatch) {
        return {
          pageNumber: page.pageNumber,
          song: songMatch,
          title: page.title,
          key: page.key,
          bookNo: num,
          matchType: 'BOOK_NO',
        };
      }
    }
  }

  // 3. Check Page number keywords: "75p", "75쪽", "p75", "p.75", "page 75"
  const pageMatch = rawStr.match(/(?:p(?:age)?\.?\s*(\d+)|(\d+)\s*(?:p|쪽|페이지))/i);
  if (pageMatch) {
    const pageNum = parseInt(pageMatch[1] || pageMatch[2], 10);
    const targetPage = SCORE_PAGES.find((p) => p.pageNumber === pageNum);
    if (targetPage) {
      return {
        pageNumber: targetPage.pageNumber,
        song: targetPage.songs[0],
        title: targetPage.title,
        key: targetPage.key,
        bookNo: targetPage.bookNumber,
        matchType: 'PAGE',
      };
    }
  }

  // 4. Check Hymn number: "330장", "찬송가 330", "330"
  const hymnMatch = rawStr.match(/(?:찬송가\s*)?(\d+)\s*장/i);
  const hymnTargetNum = hymnMatch ? hymnMatch[1] : null;
  if (hymnTargetNum) {
    for (const p of SCORE_PAGES) {
      const hymnSong = p.songs.find((s) => s.hymnNo && s.hymnNo.includes(hymnTargetNum));
      if (hymnSong) {
        return {
          pageNumber: p.pageNumber,
          song: hymnSong,
          title: p.title,
          key: p.key,
          bookNo: hymnSong.bookNo,
          matchType: 'HYMN',
        };
      }
    }
  }

  // 5. Fallback: Search song title
  const cleanQ = rawStr.toLowerCase();
  for (const page of SCORE_PAGES) {
    const song = page.songs.find((s) => s.title.toLowerCase().includes(cleanQ));
    if (song) {
      return {
        pageNumber: page.pageNumber,
        song,
        title: page.title,
        key: page.key,
        bookNo: song.bookNo,
        matchType: 'TITLE',
      };
    }
  }

  return null;
}

// Multi-result search for Leader controls and search dropdowns
export function searchScoreCatalog(query: string, currentKey?: 'G' | 'C' | 'E' | 'INDEX' | string): Array<{
  pageNumber: number;
  song: ScorePageSong;
  pageTitle: string;
  key: string;
  badge: string;
}> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{
    pageNumber: number;
    song: ScorePageSong;
    pageTitle: string;
    key: string;
    badge: string;
  }> = [];

  const seen = new Set<string>();

  // Helper to add unique result
  const addResult = (page: (typeof SCORE_PAGES)[0], song: ScorePageSong, badge: string) => {
    const keyId = `${page.pageNumber}-${song.id}`;
    if (!seen.has(keyId)) {
      seen.add(keyId);
      results.push({
        pageNumber: page.pageNumber,
        song,
        pageTitle: page.title,
        key: page.key,
        badge,
      });
    }
  };

  // 1. Direct parsed single result priority (e.g. "E코드 #2" -> 75p)
  const singleMatch = findPageBySongNumber(q, currentKey);
  if (singleMatch) {
    const page = SCORE_PAGES.find((p) => p.pageNumber === singleMatch.pageNumber);
    if (page) {
      const song = singleMatch.song || page.songs[0];
      if (song) {
        addResult(page, song, `[정확 일치] ${page.title} (${page.pageNumber}쪽)`);
      }
    }
  }

  // 2. Iterate pages and match by title, bookNo, hymnNo, page title
  const keyBookMatch = q.match(/^([gce])\s*(?:코드)?\s*#?\s*(\d+)/i);
  const searchKey = keyBookMatch ? (keyBookMatch[1].toUpperCase() as 'G' | 'C' | 'E') : null;
  const searchBookNo = keyBookMatch ? parseInt(keyBookMatch[2], 10) : null;
  const numOnly = q.replace(/[^0-9]/g, '');

  SCORE_PAGES.forEach((page) => {
    // Check page title match (e.g. "E코드 #2")
    if (page.title.toLowerCase().includes(q)) {
      page.songs.forEach((s) => addResult(page, s, `${page.title} (${page.pageNumber}쪽)`));
    }

    page.songs.forEach((song) => {
      // Key + bookNo match
      if (searchKey && searchBookNo !== null && song.key === searchKey && song.bookNo === searchBookNo) {
        addResult(page, song, `${song.key}코드 #${song.bookNo} (${page.pageNumber}쪽)`);
      }

      // Title match
      if (song.title.toLowerCase().includes(q)) {
        addResult(page, song, `${page.pageNumber}쪽 • ${song.key} #${song.bookNo}`);
      }

      // Hymn match
      if (song.hymnNo && song.hymnNo.toLowerCase().includes(q)) {
        addResult(page, song, `${song.hymnNo} (${page.pageNumber}쪽)`);
      }

      // Pure number match against bookNo
      if (numOnly && (song.bookNo.toString() === numOnly || (song.hymnNo && song.hymnNo.includes(numOnly)))) {
        addResult(page, song, `${song.key}코드 #${song.bookNo} (${page.pageNumber}쪽)`);
      }
    });
  });

  return results.slice(0, 20);
}


