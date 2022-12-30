var handleDecodedXML = function(decodedXml) {
  let rerurnXml = '';

  const blockArr = decodedXml.split('&lt;');

  for (let i = 0; i < blockArr.length; i++) {
    let blockStr = blockArr[i];
    let handleBlockStr = '';
    let returnBlockStr = '';

    const sliceBlockStr = blockStr.split(' ');

    for(let j = 0; j < sliceBlockStr.length; j++) {
      const subBlockStr = sliceBlockStr[j];
      
      const eIndex = subBlockStr.indexOf('=');
      if (eIndex !== -1) {
        handleBlockStr += ' <span class="attr-name">' + subBlockStr.slice(0, eIndex) +'</span>' + subBlockStr.slice(eIndex);
      } else {
        handleBlockStr += subBlockStr;
      }
    }
    // console.log(sliceBlockStr);

    const blockEndIndexB = handleBlockStr.indexOf(' ');
    const blockEndIndexR = handleBlockStr.indexOf('&gt;');
    // Handle XMLTag
    if (blockEndIndexB === -1 && blockEndIndexR === -1) {
      continue;
    }
    const endBlockFlag = handleBlockStr[0] === '/';

    if (blockEndIndexR !== -1) {
      handleBlockStr += '<br>'
    }
    if (blockEndIndexR < blockEndIndexB) {
      returnBlockStr = '&lt;' + (endBlockFlag ? '/' : '') + '<span class="block-name">' + handleBlockStr.slice(endBlockFlag ? 1 : 0, blockEndIndexR) + '</span>' + handleBlockStr.slice(blockEndIndexR);
    } else if (blockEndIndexB !== -1) {
      returnBlockStr = '&lt;' + (endBlockFlag ? '/' : '') +'<span class="block-name">' + handleBlockStr.slice(endBlockFlag ? 1 : 0, blockEndIndexB) + '</span>' + handleBlockStr.slice(blockEndIndexB);
    } else if (blockEndIndexR !== -1) {
      returnBlockStr = '&lt;' + (endBlockFlag ? '/' : '') + '<span class="block-name">' + handleBlockStr.slice(endBlockFlag ? 1 : 0, blockEndIndexR) + '</span>' + handleBlockStr.slice(blockEndIndexR);
    }
    rerurnXml += returnBlockStr;
  }
  return rerurnXml;
}

var escapeMarkup = function(dangerousInput) {
  const dangerousString = String(dangerousInput);
  const matchHtmlRegExp = /["'&<>]/;
  const match = matchHtmlRegExp.exec(dangerousString);
  if (!match) {
    return dangerousInput;
  }

  const encodedSymbolMap = {
    '"': '&quot;',
    '\'': '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  const dangerousCharacters = dangerousString.split('');
  const safeCharacters = dangerousCharacters.map(function (character) {
    return encodedSymbolMap[character] || character;
  });
  const safeString = safeCharacters.join('');
  return safeString;
}


module.exports = {
  handleDecodedXML,
  escapeMarkup
}