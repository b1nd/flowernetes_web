import moment from "moment";

export const ISO_DATE_FORMAT = "YYYY-MM-DD";

export function localDate() {
  return moment().format(ISO_DATE_FORMAT);
}