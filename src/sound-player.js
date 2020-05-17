import { Howl } from 'howler'
import sound from './sound.mp3'

export const soundPlayer = new Howl({
  src: [sound],
  sprite: {
    whoosh: [0, 400],
    hit: [400, 300],
    win: [700, 600],
  },
})
