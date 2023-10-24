# midilizer-node

SQLizer bridge for midi to sqlizer communications

## Mac

**Launch*sqlizer**

% ./sqlizer-daemon - | play -t raw -b 16 -e signed -c 1 --endian big -r 44100 -v 0.2 -

**Start*bridge**

Update your midi input device first.

% npm install
% node app.js

**How*to*find*your*midi*input**

% node

Welcome to Node.js v20.8.0.
Type ".help" for more information.
var easymidi = require('easymidi');
var inputs = easymidi.getInputs();
console.log(inputs)
[
  'Ableton Push 2 Live Port',
  'Ableton Push 2 User Port',
  'IAC Driver Bus 1',
  'Studio 1824'
]

Copy the device name into app.js
