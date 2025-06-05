export default {
  data: {
    text: "",
    keys: [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ],
    keyboard: false,
    // cursor: false,
    // cursorAnimation: null,
  },
  onInit() {
    // this.resetCursorAnimation();
  },
  onKeyboardSwipe(e){
    if (e.direction === "down") this.keyboard = false;
    else if (e.direction === "up") this.keyboard = true;
  },
  onKeyPress(v){
    this.writeText(v);
  },
  onDelPress(){
    this.delText();
  },
  onEnterPress(){

  },
  writeText(v){
    // this.resetCursorAnimation();
    // if(v==="\\n")v="\n"
    this.text = this.text + v.toString();
  },
  delText(){
    // this.resetCursorAnimation();
    this.text = this.text.slice(0,-1);
  },
  // resetCursorAnimation() {
  //   this.cursor = true;
  //   clearInterval(this.cursorAnimation);
  //   this.cursorAnimation = setInterval(()=>{
  //     this.cursor = !this.cursor
  //   },500);
  // },
}
