import router from '@system.router';
import file from '@system.file';

export default {
  data: {},
  onInit() {
    file.get({
      uri: "internal://app/words/status",
      success: () => {
        router.replace({uri: "/pages/main/main"});
      },
      fail: () => {
        router.replace({uri: "/pages/init_words/init_words"});
      },
    })
  },
}