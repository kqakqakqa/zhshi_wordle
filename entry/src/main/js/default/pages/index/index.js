import router from '@system.router';
import file from '@system.file';

export default {
  data: {
    wordsVersion: "2",
    answer: [],
  },
  onShow() {
    setTimeout(()=>{
      file.readText({
        uri: "internal://app/words/version",
        success: data => {
          if(data.text !== this.wordsVersion) {
            return this.gotoInitWords();
          }
          this.setAnswer(()=>{
            router.replace({
              uri: "/pages/view_trials/view_trials",
              params:{
                answer: this.answer,
              }
            });
          });
        },
        fail: this.gotoInitWords,
      });
    },0);
  },
  gotoInitWords(){
    router.replace({
      uri: "/pages/init_words/init_words",
      params:{
        wordsVersion: this.wordsVersion,
      }
    });
  },
  setAnswer(callbackFn){
    let targetIndex = Math.floor(1919 * this.getDailyRnd());
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
                return callbackFn();
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