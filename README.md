# react-github-contribution-graph

Embeddable GitHub contributions graph

## Installation

```bash
npm i react-github-contribution-graph --save
```

## Usage

```js
import { Graph } from 'react-github-contribution-graph';

const TOKEN = ''; // your github token
const username = '';
const theme = ''; // light or dark

const App = () => {
  return <Graph token={TOKEN} username={username} theme={theme} />;
};
```
