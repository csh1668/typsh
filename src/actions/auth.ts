import { auth } from "@/auth";

// Checks if the user is authenticated and returns the user ID
export async function checkAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
