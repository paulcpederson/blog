let date = new Date()
let seconds = date.getSeconds() * 6
let minutes = date.getMinutes() * 6
let hours = (date.getHours() * 30) + (minutes / 12)
document.querySelector('.js-second').style.transform = `rotate(${seconds}deg)`
document.querySelector('.js-minute').style.transform = `rotate(${minutes}deg)`
document.querySelector('.js-hour').style.transform = `rotate(${hours}deg)`
