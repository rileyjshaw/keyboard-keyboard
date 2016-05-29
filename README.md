![Musical keyboard with the alphabet A to Y overlaid](./keyboard.jpg)

_Use a MIDI keyboard as your laptop keyboard._

Built on the cab ride over to [Stupid Shit No One Needs & Terrible Ideas
Hackathon Toronto](http://stupidhacktoronto.com/).


# Usage
Plug in a MIDI keyboard, then:

```bash
git clone https://github.com/rileyjshaw/keyboard-keyboard.git
cd keyboard-keyboard
npm i  # note: `node-midi` wasn't jiving with Node v6. v5 seems to work.
node index.js
```

Hit keys!

## Controls
**1 key:** Letter A-Y (sorry, Z!). Hard press = UPPERCASE, soft press = lowercase.

**2 keys simultaneously:** Spacebar

**3+ keys simultaneously:** On the roadmap...

[Public domain.](./LICENSE)
