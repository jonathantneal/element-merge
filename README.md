# element-merge [<img src="https://jonneal.dev/js-logo.svg" alt="" width="90" height="90" align="right">][element-merge]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[element-merge] is a 1.52 kB zero-dependency module that patches an
element with the contents of another element.

All diffing functionality is derived from [domdiff], while this package
specifically manages patching.

```html
<script src="https://unpkg.com/element-merge"></script>
<script src="https://unpkg.com/usestate-js"></script>
<body><script>
function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const fragment = document.createRange().createContextualFragment(`
    <div>
      <p>You clicked ${count} times</p>
      <button>
        Click me
      </button>
    </div>
  `);

  fragment.querySelector('button').onclick = () => setCount(count + 1);

  elementMerge(document.body, fragment);
}

connect(Example)();
</script></body>
```

## Usage with Web Components

```html
<script src="https://unpkg.com/element-merge"></script>
<script src="https://unpkg.com/usestate-js"></script>
<script>
class CounterExample extends HTMLElement {
  constructor () {
    super();

    this.attachShadow({ mode: 'open' });

    // connect and run render()
    this.render = connect(this.render);
    this.render();
  }

  render () {
    const [count, setCount] = useState(0);

    // update the component innerhtml
    const fragment = document.createRange().createContextualFragment(`
      <p>You clicked ${count} times</p>
      <button>Click me</button>
    `);

    // bind the setter to the button
    fragment.lastElementChild.onclick = () => setCount(count + 1);

    elementMerge(document.body, fragment);
  }
}

customElements.define('counter-example', CounterExample);
</script>
<body>
  <counter-example></counter-example>
  <counter-example></counter-example>
</body>
```

## Usage with Node

Add [element-merge] to your project:

```bash
npm install element-merge
```

Import [element-merge]:

```js
import elementMerge from 'element-merge';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const fragment = document.createRange().createContextualFragment(`
    <div>
      <p>You clicked ${count} times</p>
      <button>
        Click me
      </button>
    </div>
  `);

  fragment.querySelector('button').onclick = () => setCount(count + 1);

  elementMerge(document.body, fragment);
}

connect(Example)();
```

[cli-img]: https://img.shields.io/travis/jonathantneal/element-merge.svg
[cli-url]: https://travis-ci.org/jonathantneal/element-merge
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/element-merge.svg
[npm-url]: https://www.npmjs.com/package/element-merge

[domdiff]: https://github.com/WebReflection/domdiff
[element-merge]: https://github.com/jonathantneal/element-merge
