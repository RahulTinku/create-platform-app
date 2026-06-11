// Force dynamic to avoid statically prerendering auth state
export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { HomeContent } from "@/components/home-content";

export default async function HomePage() {
  // auth() is safe here because dynamic = "force-dynamic" prevents
  // static prerender — this only runs at request time
  const session = await auth();

  return <HomeContent session={session} />;
}
