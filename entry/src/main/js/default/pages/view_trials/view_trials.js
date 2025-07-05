import file from '@system.file';
import router from '@system.router';

export default {
  data: {
    trials:[[{char:""},{char:""},{char:""},{char:""},{char:""}]],
    keys: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ],
    answer: undefined,
    keyboardHint: {},
    animationDuration: 0,
    animationInterval: null,
    animationFactor: 0,
    message: "",
    finished: false,
    // showKeyboard: false,
    isEnterPress: undefined,
  },
  onInit() {
    if(this.isEnterPress) this.onEnterPress();
  },
  onShowKeyboardPress(){
    // this.showKeyboard = !this.showKeyboard;
    router.replace({
      uri: "/pages/goto/goto",
      params:{
        goto: "/pages/keyboard/keyboard",
        trials: this.trials,
        answer: this.answer,
        keyboardHint: this.keyboardHint,
        message: this.message,
        finished: this.finished,
      }
    });
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
  isCorrect(trial){
    return trial[0].char + trial[1].char + trial[2].char + trial[3].char + trial[4].char === this.answer.join("");
  },
  onEnterPress(){
    if(this.finished) return this.setAnimation();
    const trialCount = this.trials.length - 1
    const trial = this.trials[trialCount];
    this.checkValid(trial,isValid=>{
      if(!isValid) {
        this.message = "Invalid word"
        this.setAnimation();
        return;
      }
      this.trials[trialCount] = this.getHint(trial,this.answer);
      this.keyboardHint = this.getKeyboardHint(this.trials);
      if(this.isCorrect(trial)){
        this.message = "Splendid!";
        this.finished = true;
        this.refreshTrials();
        this.setAnimation();
        return;
      }
      if(trialCount>4){
        this.finished = true;
        this.message = this.answer.join("");
        return;
      }
      this.trials.push([{char:""},{char:""},{char:""},{char:""},{char:""}]);
    });
  },
  refreshTrials(){
    const trials = this.trials;
    this.trials = trials;
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
  getHint(trial, answer) {
    const answerUsed = [false,false,false,false,false];

    for (let i = 0; i < 5; i++) {
      if (trial[i].char === answer[i]) {
        trial[i].hint = "green";
        answerUsed[i] = true;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (trial[i].hint === undefined) trial[i].hint = "gray";
      else if (trial[i].hint !== "gray") continue;

      for (let j = 0; j < 5; j++) {
        if (!answerUsed[j] && trial[i].char === answer[j]) {
          trial[i].hint = "yellow";
          answerUsed[j] = true;
          break;
        }
      }
    }

    return trial;
  },
  getKeyboardHint(trials) {
    const priority = { gray: 0, yellow: 1, green: 2 };
    const keyboardHint = {};

    const trialsFlat = this.flat1(trials);

    for (let i = 0; i < trialsFlat.length; i++) {
      const char = trialsFlat[i].char;
      const color = trialsFlat[i].hint;

      if (!keyboardHint[char] || priority[color] > priority[keyboardHint[char]]) {
        keyboardHint[char] = color;
      }
    }

    return keyboardHint;
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