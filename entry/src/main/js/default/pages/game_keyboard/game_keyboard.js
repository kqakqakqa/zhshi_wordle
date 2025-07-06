import file from '@system.file';
import router from '@system.router';

export default {
  data: {
    trials: undefined,
    keys: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ],
    answer: undefined,
    keyboardHint: undefined,
    animationDuration: 0,
    animationInterval: null,
    animationFactor: 0,
    message: undefined,
    finished: undefined,
    // refresh: true,
    isEnterPress: false,
  },
  onShowKeyboardPress(){
    router.replace({
      uri: "/pages/index/index",
      params:{
        goto: "/pages/game_no_keyboard/game_no_keyboard",
        trials: this.trials,
        answer: this.answer,
        keyboardHint: this.keyboardHint,
        message: this.message,
        finished: this.finished,
        isEnterPress: this.isEnterPress,
      }
    });
  },
  onKeyPress(v){
    if(this.finished) return;
    const trialCount = this.trials.length - 1;
    this.trials[trialCount] = this.trials[trialCount]
      .filter(function(v){return v.char !== "";})
      .concat([{char:v.toString()},{char:""},{char:""},{char:""},{char:""}])
      .slice(0,5);
    this.refreshTrials();
  },
  onDelPress(){
    if(this.finished) return;
    const trialCount = this.trials.length - 1;
    this.trials[trialCount] = this.trials[trialCount]
      .filter(function(v){return v.char !== "";})
      .slice(0,-1)
      .concat([{char:""},{char:""},{char:""},{char:""},{char:""}])
      .slice(0,5);
    this.refreshTrials();
  },
  checkValid(trial, callbackfn){
    if(trial[4].char === "") callbackfn(false);

    file.readText({
      uri: `internal://app/words/${trial[0].char + trial[1].char}`,
      success: data => {
        var i = 0;
        while (i <= data.text.length - 3) {
          if (data.text.substring(i, i + 3) === trial[2].char + trial[3].char + trial[4].char) return callbackfn(true);
          i += 3;
        }
        return callbackfn(false);
      },
      fail: () => {
        callbackfn(false);
      }
    });
  },
  onEnterPress(){
    if(this.finished) return this.setAnimation();
    const trialCount = this.trials.length - 1
    const trial = this.trials[trialCount];
    this.checkValid(trial,isValid=>{
      if(!isValid) {
        this.message = "Invalid word"
        this.refreshTrials();
        this.setAnimation();
        return;
      }
      this.isEnterPress = true;
      this.onShowKeyboardPress();
    });
  },
  refreshTrials(){
    // this.refresh = false;
    const trials = this.trials;
    this.trials = trials;
    // this.refresh = true;
  },
  flat1(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (Array.isArray(item)) {
        for (var j = 0; j < item.length; j++) {
          result.push(item[j]);
        }
      } else {
        result.push(item);
      }
    }
    return result;
  },
  setAnimation() {
    this.animationDuration = this.animationDuration % 15 + 15;
    if (!this.animationInterval) {
      this.animationInterval = setInterval( function(self) {
        const x = self.animationDuration / 15;
        self.animationFactor = Math.sin(x * 6 * Math.PI) * Math.atan(x * 2) ** 2;
        if (self.animationDuration < 1) {
          clearInterval(self.animationInterval);
          self.animationInterval = null;
          return;
        }
        self.animationDuration -= 1;
      }, 500/15 ,this);
    }
  },
  getHintColor(str){
    switch (str) {
      case "green": return "#595";
      case "yellow": return "#ba3";
      case "gray": return "#777";
      default: return "#444";
    }
  },
  getHintBgColor(str){
    switch (str) {
      case "green": return "#595";
      case "yellow": return "#ba3";
      case "gray": return "#777";
      default: return "transparent";
    }
  },
  getKeyboardHintColor(key){
    return this.getHintColor(this.keyboardHint[key]);
  }
}