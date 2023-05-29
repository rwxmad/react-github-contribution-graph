export interface IDay {
  color: string;
  contributionCount: number;
  contributionLevel: string;
  date: string;
  weekday: number;
}

export interface IMonth {
  firstDay: string;
  name: string;
  totalWeeks: number;
  year: string;
}

export interface IResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        colors: string[];
        months: IMonth[];
        weeks: {
          contributionDays: IDay[];
        }[];
      };
    };
  };
}
