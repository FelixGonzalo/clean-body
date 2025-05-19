const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook|BB10/i.test(
    userAgent
  )
}

const writeClipboardText = (text: string) => {
  navigator.clipboard.writeText(text).catch(console.error)
}

export const onShare = (text = 'Compartir', url = location.href) => {
  if (!navigator.share || !isMobileOrTablet()) {
    const msg_modal = document.getElementById('msg_modal')
    msg_modal?.classList.add('msg_modal_on')
    writeClipboardText(url)
    setTimeout(() => msg_modal?.classList.remove('msg_modal_on'), 500)
    return
  }
  navigator.share({ text, url }).catch(console.error)
}
