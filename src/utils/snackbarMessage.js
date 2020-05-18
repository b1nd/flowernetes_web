import {HIDE_SNACKBAR, SHOW_SNACKBAR} from "../data/constants/snackbar_constants";
import store from "../data/store";

export default {
  show(message) {
    store.dispatch(SHOW_SNACKBAR, message);
  },
  hide() {
    store.dispatch(HIDE_SNACKBAR);
  }
}