const historySection = document.querySelector('.aside__history')
console.log(historySection, historySection.scrollHeight)
historySection.scrollTop = historySection.scrollHeight

const btSettings = document.getElementById('bt-settings')
const btCloseSettings = document.getElementById('bt-close-settings')
const settings = document.getElementById('settings')

btSettings.addEventListener('click', () => {
  settings.style.display = 'block'
})

btCloseSettings.addEventListener('click', () => {
  settings.style.display = 'none'
})
