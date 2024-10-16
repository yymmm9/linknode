import UserProfile from '@/components/supaauth/user-profile';
import UserShortLinks from '@/components/user-short-links';

export default async function page() {
  return (
    <div>
      <UserProfile />
      {/* todo show links */}
      <UserShortLinks />
    </div>
  );
}
