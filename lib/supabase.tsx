import { createClient } from "@supabase/supabase-js";
import { get } from "http";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const setUserStatus = async () => {
  await getUser();
  await getSession();
};

const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  globals.user = data.user;
  return data.user;
};

const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw null;
  }
  globals.session = data.session;
  return data.session;
};

const signOut = async () => {
  await supabase.auth.signOut();
};

const saveStory = async (
  story: any,
  title: string,
  prompt: string,
  imageUrl: string
) => {
  const { data, error } = await supabase.from("stories").insert({
    title: title,
    story_text: story,
    picture_url: imageUrl,
  });
  if (error) {
    console.log(error);
    return null;
  }
  console.log("from supa: ", data);
  return data;
};

const getStoriesByUser = async (userId: any) => {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.log(error);
    return null;
  }
  console.log("from supa: ", data);
  return data;
};

export const globals: any = {
  supabase,
  user: null,
  session: null,
  signOut,
  saveStory,
  getStoriesByUser,
};

export {
  getUser,
  getSession,
  signOut,
  saveStory,
  getStoriesByUser,
  setUserStatus,
};
