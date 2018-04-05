import React from 'react';
import {render} from 'react-dom';
import generateDocs from './generateDocs';
import {css, cx} from 'emotion';

const SRC = `
import express from 'express';

// Create the app
const app = express();

/* Set up the initial route */
app.get('/', function (req, res) {
  res.send('Hello World');
});

/* Start the server! */
app.listen(3000);
`;

const parsed = generateDocs(SRC);

const codeDisplay = css({
  whiteSpace: 'pre',
  fontFamily: 'IBM Plex Mono, monospaced',
});

const Syntax = {
  ImportSource: css({
    ':visited': {
      color: 'steelblue'
    }
  }),
  CommentLine: css({
    fontFamily: 'Arial, serif',
    // color: '#8a8',
    backgroundColor: '#eee',
    '::before': {
      content: '"//"',
    },
  }),
  CommentBlock: css({
    fontFamily: 'Arial, serif',
    // color: 'steelblue',
    backgroundColor: '#eee',
    '::before': {
      content: '"/*"',
    },
    '::after': {
      content: '"*/"',
    },
  }),
  Identifier: css({
    fontStyle: 'italic',
    fontWeight: 'bold',
  }),
};

const styles = {
  fontFamily: 'sans-serif',
};

const App = () => (
  <div style={styles}>
    <div className={codeDisplay}>
      {parsed.map(
        (
          {
            type,
            value,
            delimeters = [],
            startsLine = false,
            as: Component = 'span',
            props: {className, ...props} = {},
          },
          i
        ) => (
          <Component
            key={i}
            className={cx(Syntax[type], className, startsLine && 'starts-line')}
            {...props}
          >
            {value}
          </Component>
        )
      )}
    </div>
  </div>
);

render(<App />, document.getElementById('root'));
