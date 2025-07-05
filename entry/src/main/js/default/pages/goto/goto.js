import router from '@system.router';

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
    router.replace({
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
  },
}