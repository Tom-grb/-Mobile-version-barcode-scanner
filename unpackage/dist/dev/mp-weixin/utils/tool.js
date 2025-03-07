"use strict";
function formatMillisecondsToDate(milliseconds) {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
exports.formatMillisecondsToDate = formatMillisecondsToDate;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/tool.js.map
