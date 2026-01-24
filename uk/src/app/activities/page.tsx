import { getActivitiesList } from "@/lib/data/activities/getActivitiesList";
import ActivitiesClient from "./Activities.client";

export default async function ActivitiesPage() {
  const initialActivities = await getActivitiesList({
    limit: 12,
  });

  return <ActivitiesClient initialActivities={initialActivities} />;
}

