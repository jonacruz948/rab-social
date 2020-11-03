if (typeof window !== `undefined`) {
  window.Clipboard = (function (window, document, navigator) {
    var textArea, copy

    function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i)
    }

    function createTextArea(text) {
      textArea = document.createElement('textArea')
      textArea.setAttribute('readonly', false)
      textArea.setAttribute('contenteditable', true)
      textArea.value = text
      document.body.appendChild(textArea)
    }

    function selectText() {
      if (isOS()) {
        const range = document.createRange()
        range.selectNode(textArea)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        textArea.setSelectionRange(0, 999999)
      } else {
        const range = document.createRange()
        range.selectNode(textArea)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    function copyToClipboard() {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    }

    copy = function (text) {
      createTextArea(text)
      selectText()
      return copyToClipboard()
    }

    return {
      copy,
    }
  })(window, document, navigator)
}

export const copySharableLink = (url) => {
  return Clipboard.copy(url)
}
