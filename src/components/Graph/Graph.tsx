import React, { FC, useEffect, useState } from 'react'
import { Octokit } from 'octokit'
import { IDay, IMonth, IResponse } from '../../types'

import './Graph.css'

interface IProps {
  token: string
  username: string
  theme?: 'light' | 'dark'
}

export const Graph: FC<IProps> = ({ token, username, theme = 'light' }) => {
  const octokit = new Octokit({
    auth: token,
  })

  const fg = theme === 'light' ? '#1F2328' : '#adbac7'
  const bg = theme === 'light' ? '#ebedf0' : '#161b22'

  let response: IResponse

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const [months, setMonths] = useState<IMonth[]>([])
  const [data, setData] = useState<Array<IDay[]>>([])

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
    `
    const fetchData = async () => {
      if (data.length) return
      response = await octokit.graphql(query, {
        userName: username,
      })

      if (!response) return

      setMonths(
        response.user.contributionsCollection.contributionCalendar.months,
      )

      const sortedData: Array<IDay[]> = []
      for (let i = 0; i < 7; i++) {
        const arr: IDay[] = []

        for (const obj of response.user.contributionsCollection
          .contributionCalendar.weeks) {
          arr.push(obj.contributionDays[i])
        }
        sortedData[i] = [...arr]
      }
      setData(sortedData)
    }
    fetchData()
  }, [])

  function getMonths() {
    const ms = months.map((el, idx) => {
      return (
        <>
          {idx === 0 && <td width="28px"></td>}
          {el.totalWeeks > 1 && (
            <td colSpan={el.totalWeeks} key={idx} className="graph__month">
              <span style={{ color: fg }}>{el.name}</span>
            </td>
          )}
        </>
      )
    })
    return ms
  }

  function getCells(obj: IDay[]) {
    return obj.map((el, idx) => {
      if (!el) return
      let color: string = el.color
      if (el.contributionLevel === 'NONE') {
        color = bg
      }
      return (
        <>
          {idx === 0 && (
            <>
              <td className="graph__weekday">
                {(el.weekday === 1 || el.weekday === 3 || el.weekday === 5) && (
                  <span
                    style={{
                      color: fg,
                    }}
                  >
                    {days[el.weekday]}
                  </span>
                )}
              </td>
              <td
                className="graph__cell"
                key={idx}
                style={{ backgroundColor: color }}
              ></td>
            </>
          )}
          <td
            className="graph__cell"
            key={idx}
            style={{ backgroundColor: color }}
          ></td>
        </>
      )
    })
  }

  return (
    <table className="graph">
      <thead>
        <tr className="graph__header">{getMonths()}</tr>
      </thead>
      <tbody>
        {data.map((el, index) => {
          return (
            <tr className="graph__cells" key={index}>
              {getCells(el)}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
