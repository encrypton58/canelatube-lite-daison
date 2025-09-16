import { test } from '@japa/runner'

const lyrics = {
  "isSync": true,
  "lyrics": "[00:01.64] Babe I love U\n[00:04.79] Babe I miss U\n[00:07.75] Babe I want U\n[00:11.56] Dear 未来のダーリン\n[00:13.71] 24h 頭ん中キミのことばっか\n[00:16.68] メイク中も眠る3秒前も考えちゃう\n[00:19.68] あぁ何も手につかない\n[00:21.80] 明日も朝早いのに\n[00:24.61] ふと見たストーリーに写る可愛いすぎな Girl\n[00:28.00] ねぇ誰なの？Oh my god\n[00:29.43] 聞けるわけないじゃん\n[00:31.20] モヤモヤ ありえない\n[00:32.67] いっそ諦めたなら楽になれんのかな\n[00:37.43] むり むり むり\n[00:39.23] 諦めんのやめた\n[00:40.65] Love U Love U Love U\n[00:42.31] 止まんないの\n[00:43.62] そもそもだけど\n[00:45.24] この気持ち気付いてないのまだ!?\n[00:48.80] 今すぐ会いたいや キミに会いたいや\n[00:52.05] すぐ伝えたいや 気持ち伝えたいんだ\n[00:55.53] 誰かにとられたくない\n[00:57.77] 私の未来のダーリン\n[01:00.92] とにかく会いたいや キミに会えたならきっと\n[01:04.64] 今なら好きって言えそうな気がする\n[01:07.62] ねぇ好きだよ 大好きだよ\n[01:09.74] 誰にもあげない\n[01:11.12] 私の未来のダーリン\n[01:13.65] Babe I love U\n[01:15.79] 気付いてよ\n[01:16.71] Babe I miss U\n[01:18.69] 振り向いて\n[01:19.79] Babe I want U\n[01:21.66] 誰にもあげない\n[01:23.25] 私の未来のダーリン\n[01:25.79] 24h スマホの通知が気になって\n[01:28.64] 頑張って駆け引きなんかしてみても\n[01:31.41] 無意味みたい何で気付かないの\n[01:34.20] 凹んで寝ちゃうよbye bye bye\n[01:36.76] あの子のストーリーは\n[01:38.53] 彼氏と Love Love Love\n[01:40.03] え、待ってやば、マジ、むり!!\n[01:41.54] 超焦るって\n[01:43.18] モヤモヤ 増えてく\n[01:44.65] いつか振り向いてくれる日はくるのかな\n[01:49.59] むり むり むり\n[01:51.34] どうしたらいいの？\n[01:52.74] Love U Love U Love U\n[01:54.39] 届いてんの？\n[01:55.79] そもそもだけど\n[01:57.35] You＆Me お似合いと思うんだけど!?\n[02:00.85] 今すぐ会いたいや キミに会いたいや\n[02:04.12] すぐ伝えたいや 気持ち伝えたいんだ\n[02:07.64] 誰かにとられたくない\n[02:09.77] 私の未来のダーリン\n[02:12.85] とにかく会いたいや キミに会えたならきっと\n[02:16.55] 今なら好きって言えそうな気がする\n[02:19.60] ねぇ好きだよ 大好きだよ\n[02:21.76] 誰にもあげない\n[02:23.10] 私の未来のダーリン\n[02:37.39] キミの気持ちどうなの教えてよ\n[02:40.46] 電話して会いに行ってみようかな\n[02:43.68] もし同じ気持ちなら\n[02:45.87] なんて期待しすぎかな\n[02:48.82] 今すぐ会いたいや キミに会えたならきっと\n[02:52.32] 今なら好きって言えそうな気がする\n[02:55.57] ねぇ好きだよ 大好きだよ\n[02:57.67] 誰にもあげない\n[02:59.15] 私の未来のダーリン\n[03:01.66] Babe I love U\n[03:03.51] 気付いてよ\n[03:04.67] Babe I miss U\n[03:06.59] 振り向いて\n[03:07.67] Babe I want U\n[03:09.66] 誰にもあげない\n[03:11.13] 私の未来のダーリン\n[03:13.64] Babe I love U\n[03:16.61] Babe I miss U\n[03:19.79] Babe I want U\n[03:21.75] 誰にもあげない\n[03:23.20] 私の未来のダーリン\n[03:26.13] "
}

const lyricsSuperJunior = {
  "isSync": true,
  "lyrics": "[00:12.85] 너 같은 사람 또 없어\n[00:15.22] 주위를 둘러봐도 그저 그렇던 걸\n[00:18.32] 어디서 찾니\n[00:19.54] 너같이 좋은 사람\n[00:20.98] 너같이 좋은 사람\n[00:22.44] 너같이 좋은 마음\n[00:24.18] 너같이 좋은 선물\n[00:25.74] 너무 다행이야 애써\n[00:27.84] 너를 지켜줄 그 사람이 바로 나라서\n[00:30.99] 어디서 찾니\n[00:32.19] 나같이 행복한 놈\n[00:33.55] 나같이 행복한 놈\n[00:35.14] 나같이 웃는\n[00:36.22] 그런 최고로 행복한 놈\n[00:38.44] 너의 따뜻한 그 두 손이 차갑게, 차갑게\n[00:42.76] 식어 있을 때\n[00:45.05] 너의 강했던 그 마음이 날카롭게\n[00:48.85] 상처 받았을 때\n[00:51.10] 내가 잡아줄게 안아줄게 살며시,\n[00:54.36] 그것으로 작은 위로만\n[00:56.00] 된다면 좋겠어\n[00:57.59] 언제나 더 많은 걸\n[00:59.56] 해주고 싶은\n[01:00.88] 내 맘 넌 다 몰라도 돼\n[01:03.57] 가슴이 소리쳐 말해\n[01:06.62] 자유로운 내 영혼\n[01:09.42] 언제나 처음의 이\n[01:11.17] 마음으로 너를 사랑해\n[01:13.06] 걸어왔던 시간보다\n[01:14.84] 남은 날이 더 많아\n[01:16.26] 너 같은 사람 또 없어\n[01:18.41] 주위를 둘러봐도 그저 그렇던 걸\n[01:21.56] 어디서 찾니\n[01:22.68] 너같이 좋은 사람 너같이 좋은 사람 너같이 좋은 마음 너같이 좋은 선물\n[01:28.66] 너무 다행이야 애써\n[01:31.05] 너를 지켜줄\n[01:32.13] 그 사람이 바로 나라서\n[01:34.24] 어디서 찾니\n[01:35.30] 나같이 행복한 놈\n[01:36.78] 나같이 행복한 놈\n[01:38.24] 나같이 웃는\n[01:39.39] 그런 최고로 행복한 놈\n[01:42.74] \n[01:53.93] 나의 가난했던 마음이 눈부시게\n[01:58.18] 점점 변해갈 때\n[02:00.71] 작은 욕심들이 더는 넘치지 않게\n[02:04.36] 내 맘의 그릇 커져갈 때\n[02:07.05] 알고 있어 그 모든 이유는 분명히\n[02:09.97] 네가 있어주었다는 것,\n[02:11.83] 그것 딱 하나 뿐\n[02:13.46] 언제나 감사해\n[02:15.33] 내가 너만큼 그리 잘 할 수 있겠니\n[02:19.02] 가슴이 소리쳐 말해\n[02:22.34] 자유로운 내 영혼\n[02:25.20] 언제나 처음의 이\n[02:26.91] 마음으로 너를 사랑해\n[02:28.71] 걸어왔던 시간보다\n[02:30.52] 남은 날이 더 많아\n[02:31.93] 너 같은 사람 또 없어\n[02:34.19] 주위를 둘러봐도 그저 그렇던 걸\n[02:37.68] 너같이 좋은 사람\n[02:39.87] 너같이 좋은 사람\n[02:41.46] 너같이 좋은 마음\n[02:43.00] 너같이 좋은 선물\n[02:44.63] 너무 다행이야 애써\n[02:46.94] 너를 지켜줄 그 사람이 바로 나라서\n[02:50.06] 어디서 찾니\n[02:51.19] 나같이 행복한 놈\n[02:52.68] 나같이 행복한 놈\n[02:54.10] 나같이 웃는\n[02:55.29] 그런 최고로 행복한 놈\n[02:57.16] 있잖아 조금 아주 조금\n[02:58.64] 나 수줍지만 넌 몰라 속은\n[03:00.79] 태양보다 뜨거워 내 맘 좀 알아줘\n[03:03.49] TV쇼에 나오는 Girl들은 무대에서\n[03:05.83] 빛이 난데도 넌 언제나 눈부셔\n[03:08.30] (내가 미쳐 미쳐 Baby)\n[03:10.06] 사랑한단 너의 말에 세상을 다 가진 난\n[03:13.09] You & I, You're so fine너\n[03:14.77] 같은 사람 있을까\n[03:16.69] 사랑해 오, 내게는 오직 너뿐이란 걸\n[03:19.54] 바보 같은 나에게는 전부라는 걸 알아줘\n[03:22.70] 같은 길을 걸어왔어\n[03:24.71] 우린 서로 닮아가고 있잖아\n[03:27.99] 놀라울 뿐이야\n[03:29.51] 고마울 뿐이야\n[03:31.22] 사랑할 뿐이야\n[03:35.00] 너 같은 사람 또 없어\n[03:37.33] 주위를 둘러봐도 그저 그렇던 걸\n[03:40.75] 너같이 좋은 사람\n[03:43.20] 너같이 좋은 사람\n[03:44.62] 너같이 좋은 마음\n[03:46.22] 너같이 좋은 선물\n[03:47.85] 너무 다행이야 애써\n[03:50.12] 너를 지켜줄 그 사람이 바로 나라서\n[03:53.16] 어디서 찾니\n[03:54.30] 나같이 행복한 놈\n[03:55.79] 나같이 행복한 놈\n[03:57.35] 나같이 웃는\n[03:58.38] 그런 최고로 행복한 놈\n[04:00.79] 너 같은 사람 또 없어\n[04:01.26] "
}

const englishAndJapanese = {
  isSync: true,
  lyrics: "[00:01.45] Tonight, we celebrate our love\n[00:05.28] After all this time, we're still together\n[00:09.43] いつも 照らす sunshine, その光で I'm fine\n[00:13.86] 君の愛は so bright, 輝かせた (uh-huh)\n[00:17.75] そうやって一緒に 歩き続けた, history\n[00:21.89] そばに君が居たから, I came this far, baby\n[00:26.22] どんな時でも ちゃんと声は届いてるよ\n[00:30.46] 離れていても 隣でささやくように\n[00:34.68] そうやって ずっと 一瞬一瞬を\n[00:38.65] 乗り越えてきたの\n[00:42.26] I'm next to you 今でも\n[00:44.40] You're nеxt to me, そう 君の居場所で ずっと\n[00:49.07] Let's ce-ce-ce-celebrate\n[00:51.33] 変わりゆく未来\n[00:53.40] そのままで居たい 君の手にも\n[00:57.77] Let's ce-ce-ce-celebrate\n[01:00.35] Ta-ta-ta-ra, ta-ra-ta\n[01:02.42] Ta-ra-ta-ta, celebrate (I love it)\n[01:05.00] Ta-ta-ta-ra, ta-ra-ta\n[01:06.65] Ta-ra-ta-ta, celebrate (I love it)\n[01:08.71] It's real love この世界でも\n[01:10.47] 私たちは変わらないわ\n[01:12.61] (One, two, three, four, oh)\n[01:14.27] 積もる mеmory, どうか忘れないように\n[01:16.88] そう 気付けばいつしか like a family\n[01:18.90] 誰より支えあう存在に\n[01:22.17] こんな距離は 素敵ね, I won't be afraid, baby\n[01:26.10] 何が起こっても 向き合ってゆく お互いを\n[01:30.93] 笑顔の日にも 涙する日でさえも\n[01:34.81] 何百回でも どんな瞬間も\n[01:39.21] 一緒に歌おう\n[01:42.58] I'm next to you 今でも\n[01:44.70] You're nеxt to me, そう 君の居場所で ずっと\n[01:49.15] Let's ce-ce-ce-celebrate\n[01:51.15] 変わりゆく未来\n[01:53.25] そのままで居たい 君の手にも\n[01:57.95] Let's ce-ce-ce-celebrate\n[02:00.48] Ta-ta-ta-ra, ta-ra-ta\n[02:02.02] Ta-ra-ta-ta, celebrate (I love it)\n[02:04.62] Ta-ta-ta-ra, ta-ra-ta\n[02:06.43] Ta-ra-ta-ta, celebrate (I love it)\n[02:09.18] これまでにずっと 君がくれた love\n[02:13.63] 今日の私を you made it\n[02:18.10] 確かな energy 送らせて 今\n[02:23.42] 大切に思うの, 'cause we've been together\n[02:27.93] I'm next to you 今でも (ah)\n[02:29.89] You're nеxt to me, そう 君の居場所で ずっと\n[02:34.47] Let's ce-ce-ce-celebrate\n[02:36.16] 変わりゆく未来\n[02:38.39] そのままで居たい 君の手にも\n[02:42.94] Let's ce-ce-ce-celebrate (celebrate, yeah)\n[02:45.77] Ta-ta-ta-ra, ta-ra-ta\n[02:47.56] Ta-ra-ta-ta, celebrate (I love it)\n[02:50.05] Ta-ta-ta-ra, ta-ra-ta\n[02:51.73] Ta-ra-ta-ta, celebrate (I love it)\n[02:53.95] 君となら ふたり\n[02:55.54] 弾んでいく期待 いつまででも\n[03:00.20] Let's ce-ce-ce-celebrate\n[03:03.37] "
}

const incompleteLyrics = {
  isSync: true,
  'lyrics': "[00:01.64] Babe I love U\n[00:04.79] Babe I miss U\n[00:07.75] Babe I want U\n[00:11.56] Dear 未来のダーリン\n[00:13.71]"
}

const plainLyrics = {
  isSync: false,
  lyrics: "Babe I love U\nBabe I miss U\nBabe I want U\nDear 未来のダーリン\n\n24h 頭ん中キミのことばっか\nメイク中も眠る3秒前も考えちゃう\nあぁ何も手につかない\n明日も朝早いのに\n\nふと見たストーリーに写る可愛いすぎな Girl\nねぇ誰なの？Oh my god\n聞けるわけないじゃん\nモヤモヤ ありえない\nいっそ諦めたなら楽になれんのかな\n\nむり むり むり\n諦めんのやめた\nLove U Love U Love U\n止まんないの\nそもそもだけど\nこの気持ち気付いてないのまだ!?\n\n今すぐ会いたいや キミに会いたいや\nすぐ伝えたいや 気持ち伝えたいんだ\n誰かにとられたくない\n私の未来のダーリン\nとにかく会いたいや キミに会えたならきっと\n今なら好きって言えそうな気がする\nねぇ好きだよ 大好きだよ\n誰にもあげない\n私の未来のダーリン\n\nBabe I love U\n気付いてよ\nBabe I miss U\n振り向いて\nBabe I want U\n誰にもあげない\n私の未来のダーリン"
}

const emptyLyrics = {
  isSync: true,
  lyrics: "lksfijssldaskmidng"
}

const otherThingSend = {
  'test': true
}

test.group('Lyrics', () => {
  test('Bad Format', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(
      { 'lyrics': 'no format permited', 'isSync': true }
    ).header('accept-language', 'es')
    response.assertStatus(400)
  }).tags(['romanized'])

  test('Valid Format', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(lyrics).header('accept-language', 'es')
    response.assertStatus(200)
  }).tags(['romanized'])

  test('Empty Lyrics', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json({}).header('accept-language', 'es')
    response.assertStatus(422)
  }).tags(['romanized'])

  test('Sort Lyrics', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(incompleteLyrics).header('accept-language', 'es')
    response.assertStatus(200)
  }).tags(['romanized'])

  test('Other Thing', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(otherThingSend).header('accept-language', 'es')
    response.assertStatus(422)
  }).tags(['romanized'])

  test('Valid format korean', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(lyricsSuperJunior).header('accept-language', 'es')
    response.assertStatus(200)
  }).tags(['romanized'])

  test('Valid format english and japanese', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(englishAndJapanese).header('accept-language', 'es')
    response.assertStatus(200)
  }).tags(['romanized'])

  test('No json received', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').header('accept-language', 'es')
    response.assertStatus(422)
  }).tags(['romanized'])

  test('Plain lyrics', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(plainLyrics).header('accept-language', 'es')
    response.assertStatus(200)
  }).tags(['romanized'])

  test('Empty lyrics other', async ({ client }) => {
    const response = await client.post('api/v1/lyrics').json(emptyLyrics).header('accept-language', 'es')
    response.assertStatus(400)
  }).tags(['romanized'])

})