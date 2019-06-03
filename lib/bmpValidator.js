'use strict';

module.exports = (bmp) => {
  if (bmp.type === 'BM'){
    return true;
  } else {
    return false;
  }
};