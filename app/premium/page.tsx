import { redirect } from "next/navigation"

export default function PremiumPage() {
  // Redirect to the new payment page
  redirect("/payment")
}
