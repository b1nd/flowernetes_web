import moment from "moment";

export const ISO_DATE_FORMAT = "YYYY-MM-DD";
export const FULL_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss";

export function localDate() {
  return moment().format(ISO_DATE_FORMAT);
}

export function fullDate(date) {
  return moment(date).format(FULL_DATE_FORMAT);
}

export function differenceSeconds(from, to) {
  return moment(from).diff(moment(to), "s")
}