import { stringify } from '../src/index';

const options = {
  partial: true,
  disableFormatHtml: true,
  math: true,
};

it('inline', () => {
  const received = stringify('text$x=y$text', options);
  const expected = '<p>text<span class="math inline">\\(x=y\\)</span>text</p>';
  expect(received).toBe(expected);
});

it('inline: multiline', () => {
  const md = `$x=y
1 + 1 = 2$`;
  const received = stringify(md, options);
  const expected = `<p><span class="math inline">\\(x=y
1 + 1 = 2\\)</span></p>`;
  expect(received).toBe(expected);
});

it('inline: ignore "$ ...$"', () => {
  const md = 'text $ text$x = y$';
  const received = stringify(md, options);
  const expected =
    '<p>text $ text<span class="math inline">\\(x = y\\)</span></p>';
  expect(received).toBe(expected);
});

it('inline: ignore "$... $"', () => {
  const md = 'text $x = $y$ text';
  const received = stringify(md, options);
  const expected =
    '<p>text <span class="math inline">\\(x = $y\\)</span> text</p>';
  expect(received).toBe(expected);
});

it('inline: ignore "$" with number', () => {
  const md = 'There are $3 and $4 bread.';
  const received = stringify(md, options);
  const expected = '<p>There are $3 and $4 bread.</p>';
  expect(received).toBe(expected);
});

it('inline: ignore "$.\\$.$"', () => {
  const md = 'text $x = 5\\$ + 4$ text';
  const received = stringify(md, options);
  const expected =
    '<p>text <span class="math inline">\\(x = 5\\$ + 4\\)</span> text</p>';
  expect(received).toBe(expected);
});

it('inline: exclusive other markdown syntax', () => {
  const received = stringify('text$**bold**$text', options);
  const expected =
    '<p>text<span class="math inline">\\(**bold**\\)</span>text</p>';
  expect(received).toBe(expected);
});

it('display', () => {
  const received = stringify('text$$1 + 1 = 2$$text', options);
  const expected =
    '<p>text<span class="math display">$$1 + 1 = 2$$</span>text</p>';
  expect(received).toBe(expected);
});

it('display: multiline', () => {
  const md = `$$
x=y
1 + 1 = 2
$$`;
  const received = stringify(md, options);
  const expected = `<p><span class="math display">$$
x=y
1 + 1 = 2
$$</span></p>`;
  expect(received).toBe(expected);
});

it('display: exclusive other markdown syntax', () => {
  const received = stringify('text$$**bold**$$text', options);
  const expected =
    '<p>text<span class="math display">$$**bold**$$</span>text</p>';
  expect(received).toBe(expected);
});

it('inline and display', () => {
  const received = stringify(
    'inline: $x = y$\n\ndisplay: $$1 + 1 = 2$$',
    options,
  );
  const expected = `<p>inline: <span class="math inline">\\(x = y\\)</span></p>
<p>display: <span class="math display">$$1 + 1 = 2$$</span></p>`;
  expect(received).toBe(expected);
});

it('un-match: $$$...', () => {
  const received = stringify('text$$$unmatch$$$text', options);
  const expected = '<p>text$$$unmatch$$$text</p>';
  expect(received).toBe(expected);
});

it('un-match inline', () => {
  const received = stringify('$x = y$ $ x = y$ $x = y $ $x = y$7', options);
  const expected =
    '<p><span class="math inline">\\(x = y\\)</span> $ x = y$ $x = y $ $x = y$7</p>';
  expect(received).toBe(expected);
});

it('un-match: divided paragraph', () => {
  const md = `$x = y

1 + 1 = 2$
$$
x = y

1 + 1 = 2
$$`;
  const received = stringify(md, options);
  const expected = `<p>$x = y</p>
<p>1 + 1 = 2$
$$
x = y</p>
<p>1 + 1 = 2
$$</p>`;
  expect(received).toBe(expected);
});

it('HTML header and body', () => {
  const received = stringify('$x=y$', { math: true, disableFormatHtml: true });
  const expected = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"></script>
</head>
<body data-math-typeset="true">
<p><span class="math inline">\\(x=y\\)</span></p>
</body>
</html>
`;
  expect(received).toBe(expected);
});

it('disable', () => {
  const markdown = `---
math: false
---
$x=y$
`;
  const received = stringify(markdown, { math: true, disableFormatHtml: true });
  const expected = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<p>$x=y$</p>
</body>
</html>
`;
  expect(received).toBe(expected);
});
