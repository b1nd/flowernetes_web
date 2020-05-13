import moment from "moment";

export function localDate() {
  return moment().format("YYYY-MM-DD");
}