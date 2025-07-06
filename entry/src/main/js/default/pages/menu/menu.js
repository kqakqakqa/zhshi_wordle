import router from '@system.router';
import file from '@system.file';

export default {
  data: {
    answer: [],
  },
  onDailyGameClick() {
    this.setAnswer({
      rnd: this.getDailyRnd(),
      then: this.gotoGame,
    });
  },
  onRndGameClick() {
    this.setAnswer({
      rnd: Math.random(),
      then: this.gotoGame,
    });
  },
  onAboutClick() {
    return router.replace({
      uri: "/pages/about/about",
    });
  },
  gotoGame() {
    return router.replace({
      uri: "/pages/game_no_keyboard/game_no_keyboard",
      params:{
        answer: this.answer,
      }
    });
  },
  setAnswer({rnd, then}) {
    let targetIndex = Math.floor(1919 * rnd);
    file.readText({
      uri: `internal://app/words/dict`,
      success: data => {
        const dict = JSON.parse(data.text);
        for (const key in dict) {
          const freq = dict[key];
          if (targetIndex < freq) {
            file.readText({
              uri: `internal://app/words/${key}`,
              position: targetIndex * 3,
              length: 3,
              success: data => {
                this.answer = (key + data.text).split("");
                return then();
              },
            });
            return;
          }
          targetIndex -= freq;
        }
      },
    });
  },
  getDailyRnd(time = Date.now()) {
    const date = new Date(time + 8 * 60 * 60 * 1000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const seed =year * 10000 + month * 100 + day;
    const a = 9301;
    const c = 49297;
    const m = 233280;
    return (seed * a + c) % m / m;
  },
}