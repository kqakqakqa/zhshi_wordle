import router from '@system.router';
import file from '@system.file';
import app from '@system.app';

export default {
  data: {
    goto: undefined,
    trials: undefined,
    answer: undefined,
    keyboardHint: undefined,
    message: undefined,
    finished: undefined,
    isEnterPress: undefined,
  },
  onInit() {
    // game_no_keyboard和game_keyboard之间跳转
    if(this.goto !== undefined){
      return router.replace({
        uri: this.goto,
        params:{
          trials: this.trials,
          answer: this.answer,
          keyboardHint: this.keyboardHint,
          message: this.message,
          finished: this.finished,
          isEnterPress: this.isEnterPress,
        }
      });
    }
    // 已初始化则跳转menu，未初始化则跳转init_words
    setTimeout(()=>{
      file.readText({
        uri: "internal://app/words/version",
        success: data => {
          if(data.text === app.getInfo().versionName) {
            return router.replace({uri: "/pages/menu/menu"});
          }
        },
        complete: () => {
          return router.replace({uri: "/pages/init_words/init_words"});
        },
      });
    },0);
  },
}