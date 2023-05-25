# react-github-contribution-graph

Embeddable GitHub contributions graph

![graph](https://github.com/rwxmad/react-github-contribution-graph/assets/30772868/0f43891c-14df-4f2f-8a61-83d8543c2af2)

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
