const MAX_LENGTH_FOR_TRUNATE = 60;
const ONE_MILLION = 1000000;

function truncateText(text = '') {
  if (text <= MAX_LENGTH_FOR_TRUNATE) return text;
  return `${text.substring(0, MAX_LENGTH_FOR_TRUNATE)}...`;
}

function numberToString(num = 0) {
  return num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function formatViews(views = 0) {
  if (views < ONE_MILLION) {
    return `${numberToString(views)} views`;
  }

  return `${(views / ONE_MILLION).toFixed(1)} M views`;
}

export default {
  truncateText,
  formatViews,
};
