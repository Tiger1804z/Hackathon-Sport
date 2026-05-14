import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "ORGANIZER") redirect("/dashboard");
  redirect("/teams");
}