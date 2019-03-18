`react-suggestible`
===================

Inline autocompletion component. Autocompletion is started by a combination of
a specific 'trigger' character (e.g. `@`) and a prefix of a specified minimum
length (e.g. 2).

```javascript
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Suggestible from 'react-suggestible'
import COUNTRIES from './countries.json'

const Example = () => {
  const [text, setText] = useState('')

  return (
    <Suggestible
      value={text}
      options={COUNTRIES}
      trigger="#"
      minPrefix={1}
      rows={6}
      onChange={setText}
      autoFocus
    />
  )
}
```

In this example, typing `#N` would display a popup containing the first five
countries starting with the letter `N` (Namibia, Nauru, Nepal, etc). Continuing
to type `#New` narrows the options in the menu until only 'New Zealand' is
shown.


Options
-------

`trigger` — the character that triggers the popup (default `@`). Note that this
will be visible as part of the input element's `value`.

`options` — an array of strings containing the possible values for the popup.
These should ideally be in sorted order.

`minPrefix` — the number of characters that must be typed before the popup
appears (excluding the trigger character).

`component` — the input component to render. Uses a `textarea` by default, but
also works with `input`, or any 'input-like' component that takes a `value` prop
and handles 'normal' events like `oninput`, `onkeydown`, and `onchange`.

Any other props provided to `Suggestible` will be passed directly to the wrapped
component.


License
-------

Copyright © 2019 Optimal Workshop

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
