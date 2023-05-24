import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Graph } from 'react-github-contribution-graph';

const TOKEN = process.env.REACT_APP_GITHUB_TOKEN || '';
const username = 'rwxmad';
const theme = 'light';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Graph token={TOKEN} username={username} theme={theme} />
  </React.StrictMode>,
);
