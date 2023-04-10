import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
  }
}

interface IMonth {
  id?: string;
  monthNumber?: number;
  monthName?: string;
  year?: number;
  days?: IDay[];
  userEmail?: string;
  hoursTotal?: number;
}

interface IDay {
  id?: string;
  dayName: string;
  date: string;
  monthId?: string;
  from?: string;
  to?: string;
  hours?: string;
  breakTime?: string;
  leaveType?: string;
  businessTrip?: boolean
}
