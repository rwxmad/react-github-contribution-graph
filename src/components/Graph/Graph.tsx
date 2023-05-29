import React, { FC, useEffect, useState, CSSProperties } from 'react';
import { Octokit } from 'octokit';
import { IDay, IMonth, IResponse } from '../../types';

interface IProps {
  token: string;
  username: string;
  theme?: 'light' | 'dark';
}

export const Graph: FC<IProps> = ({ token, username, theme = 'light' }) => {
  const octokit = new Octokit({
    auth: token,
  });

  const fg = theme === 'light' ? '#1F2328' : '#adbac7';
  const bg = theme === 'light' ? '#ebedf0' : '#161b22';

  let response: IResponse;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [months, setMonths] = useState<IMonth[]>([]);
  const [data, setData] = useState<Array<IDay[]>>([]);

  useEffect(() => {
    const query = `
      query ($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              colors
              months {
                firstDay
                name
                totalWeeks
                year
              }
              weeks {
                contributionDays {
                  color
                  contributionCount
                  contributionLevel
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `;
    const fetchData = async () => {
      if (data.length) return;
      response = await octokit.graphql(query, {
        userName: username,
      });

      if (!response) return;

      setMonths(
        response.user.contributionsCollection.contributionCalendar.months,
      );

      const sortedData: Array<IDay[]> = [];
      for (let i = 0; i < 7; i++) {
        const arr: IDay[] = [];

        for (const obj of response.user.contributionsCollection
          .contributionCalendar.weeks) {
          arr.push(obj.contributionDays[i]);
        }
        sortedData[i] = [...arr];
      }
      setData(sortedData);
    };
    fetchData();
  }, []);

  function getMonths() {
    const ms = months.map((el, idx) => {
      return (
        <>
          {idx === 0 && <td width="28px"></td>}
          {el.totalWeeks > 1 && (
            <td
              colSpan={el.totalWeeks}
              key={idx}
              style={{
                position: 'relative',
                fontSize: '12px',
                textAlign: 'left',
                padding: '0.125em 0.5em 0.125em 0',
              }}
            >
              <span style={{ position: 'absolute', top: 0, color: fg }}>
                {el.name}
              </span>
            </td>
          )}
        </>
      );
    });
    return ms;
  }

  const cellStyles: CSSProperties = {
    position: 'relative',
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  };

  function getCells(obj: IDay[]) {
    return obj.map((el, idx) => {
      if (!el) return;
      let color: string = el.color;
      if (el.contributionLevel === 'NONE') {
        color = bg;
      }
      return (
        <>
          {idx === 0 && (
            <>
              <td style={{ position: 'relative', fontSize: '12px' }}>
                {(el.weekday === 1 || el.weekday === 3 || el.weekday === 5) && (
                  <span
                    style={{
                      position: 'absolute',
                      clipPath: 'none',
                      bottom: '-3px',
                      color: fg,
                    }}
                  >
                    {days[el.weekday]}
                  </span>
                )}
              </td>
              <td
                className="cell"
                key={idx}
                style={{ backgroundColor: color, ...cellStyles }}
              ></td>
            </>
          )}
          <td
            className="cell"
            key={idx}
            style={{ backgroundColor: color, ...cellStyles }}
          ></td>
        </>
      );
    });
  }

  return (
    <table
      style={{
        width: 'max-content',
        lineHeight: 1,
        borderSpacing: '3px',
        borderCollapse: 'separate',
      }}
    >
      <thead>
        <tr style={{ height: '13px' }}>{getMonths()}</tr>
      </thead>
      <tbody>
        {data.map((el, index) => {
          return (
            <tr style={{ height: '10px' }} key={index}>
              {getCells(el)}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
