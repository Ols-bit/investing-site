import { createClient } from "@supabase/supabase-js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_request", message: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (payload === null || typeof payload !== "object") {
    return Response.json(
      { error: "invalid_request", message: "A valid email address is required." },
      { status: 400 },
    );
  }

  const { email, website } = payload as Record<string, unknown>;
  if (typeof website === "string" && website.trim()) {
    return Response.json({ status: "subscribed" });
  }

  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (
    normalizedEmail.length > 254 ||
    !emailPattern.test(normalizedEmail)
  ) {
    return Response.json(
      { error: "invalid_email", message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Subscription storage is not configured.");
    return Response.json(
      { error: "storage_unavailable", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { error } = await supabase.from("subscribers").insert({ email: normalizedEmail });

    if (error?.code === "23505") {
      return Response.json({ status: "already_subscribed" });
    }
    if (error) {
      console.error("Unable to store subscription.", error);
      return Response.json(
        { error: "storage_unavailable", message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unable to store subscription.", error);
    return Response.json(
      { error: "storage_unavailable", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return Response.json({ status: "subscribed" });
}
