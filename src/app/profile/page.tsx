import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';

export default async function page() {
  return (
    <div className="flex flex-col gap-4 m-4">
      <UserProfile />
      {/* todo show links */}
      <UserShortLinks />
    </div>
  );
}
