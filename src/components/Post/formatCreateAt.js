import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

export const formatCreatedAt = (createdAt) => {
   const now = new Date();

   const differenceInMinutesValue = differenceInMinutes(now, new Date(createdAt));
   const differenceInHoursValue = differenceInHours(now, new Date(createdAt));
   const differenceInDaysValue = differenceInDays(now, new Date(createdAt));
   const differenceInWeeksValue = differenceInWeeks(now, new Date(createdAt));
   const differenceInMonthsValue = differenceInMonths(now, new Date(createdAt));
   const differenceInYearsValue = differenceInYears(now, new Date(createdAt));

   if (differenceInMinutesValue < 1) {
      return 'Now';
   } else if (differenceInMinutesValue < 60) {
      return `${differenceInMinutesValue} minutes ago`;
   } else if (differenceInHoursValue < 24) {
      return `${differenceInHoursValue} hours ago`;
   } else if (differenceInDaysValue === 1) {
      return '1 day ago';
   } else if (differenceInDaysValue < 7) {
      return `${differenceInDaysValue} days ago`;
   } else if (differenceInWeeksValue === 1) {
      return '1 week ago';
   } else if (differenceInWeeksValue < 4) {
      return `${differenceInWeeksValue} weeks ago`;
   } else if (differenceInMonthsValue === 1) {
      return '1 month ago';
   } else if (differenceInMonthsValue < 12) {
      return `${differenceInMonthsValue} months ago`;
   } else if (differenceInYearsValue === 1) {
      return '1 year ago';
   } else {
      return `${differenceInYearsValue} years ago`;
   }
};