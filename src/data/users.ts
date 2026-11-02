import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  username: string | null;
  roleKey: string;
};

type ProfileRow = {
  id: string;
  email: string;
  username: string | null;
  roles: { key: string } | { key: string }[] | null;
};

function toCurrentUser(profile: ProfileRow): CurrentUser | null {
  const role = profile.roles;
  const roleKey = Array.isArray(role) ? role[0]?.key : role?.key;
  if (!roleKey) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    roleKey,
  };
}

async function loadProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data: profile, error } = await supabase
    .from("users")
    .select("id, email, username, roles!inner(key)")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  return profile as ProfileRow;
}

export async function loadCurrentUser(
  supabase: SupabaseClient,
): Promise<CurrentUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let profile = await loadProfile(supabase, user.id);

  if (!profile) {
    const { error } = await supabase.rpc("ensure_user_profile");
    if (error) {
      return null;
    }
    profile = await loadProfile(supabase, user.id);
  }

  if (!profile) {
    return null;
  }

  return toCurrentUser(profile);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  return loadCurrentUser(supabase);
}
