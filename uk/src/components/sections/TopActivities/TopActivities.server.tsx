import TopActivitiesClient from './TopActivities.client';
import { getActivities } from '@/lib/data/activities/getActivities';

// ISR: landing page ke liye safe caching
export const revalidate = 300; // 5 minutes

export default async function TopActivitiesServer() {
  // Landing page ke liye limited, curated data
  const activities = await getActivities(6);

  return (
    <TopActivitiesClient activities={activities} />
  );
}
