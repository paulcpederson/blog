import Tone from 'tone'
const palette = [
  '#cb4b16',
  '#268bd2',
  '#fdf6e3',
  '#002b36',
  '#b58900',

  '#6c71c4',
  '#d33682',
  '#93a1a1',
  '#dc322f',
  '#268bd2',

  '#2aa198',
  '#073642',
  '#859900',
  '#657b83',
  '#eee8d5',

  '#dc322f',
  '#839496',
  '#d33682',
  '#eee8d5',
  '#2aa198',

  '#859900',
  '#cb4b16',
  '#fdf6e3',
  '#b58900',
  '#6c71c4'
]

var synth = new Tone.Synth().toMaster()
var pingPong = new Tone.PingPongDelay('4n', 0.2).toMaster()
synth.connect(pingPong)

var buttons = document.querySelectorAll('.js-tone-button')

Array.from(buttons).forEach((button, i) => {
  button.style.backgroundColor = palette[i]
  button.addEventListener('mouseover', function (e) {
    var note = e.target.getAttribute('data-tone')
    synth.triggerAttackRelease(note, '4n')
  })
})
