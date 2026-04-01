import { redirect } from "next/navigation";

// Root path — middleware handles locale detection and redirects.
// This is a fallback in case middleware is bypassed.
export default function RootPage() {
  redirect("/fr");
}
