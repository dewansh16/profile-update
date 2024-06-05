import { db } from "@/lib/db";
import { ProfileFormSchema } from "@/validations/profileFormValidations";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const validation = ProfileFormSchema.safeParse(data);
    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return new Response("Invalid data", { status: 400 });
    }

    const { firstName, lastName, email, address, profilePhoto } = data;
    console.log("data in BE = ", data);
    // Check if the user with ID 1 exists
    const existingUser = await db.user.findUnique({ where: { id: 1 } });

    let user;
    if (existingUser) {
      // Update the existing user
      user = await db.user.update({
        where: { id: 1 },
        data: { firstName, lastName, email, address, profilePhoto },
      });
    } else {
      // Create a new user with ID 1
      user = await db.user.create({
        data: { id: 1, firstName, lastName, email, address, profilePhoto },
      });
    }
    return new Response(
      JSON.stringify({ message: "Profile saved successfully", user })
    );
  } catch (error) {
    console.error("Error saving profile:", error);
    return new Response("Error saving profile", { status: 500 });
  }
}

// Handle GET requests to fetch the user profile
export async function GET(req: Request) {
  try {
    const user = await db.user.findUnique({
      where: { id: 1 },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    } else {
      return new Response(JSON.stringify({ message: "Profile found", user }));
    }
  } catch (error) {
    return new Response("Error fetching profile:", { status: 500 });
  }
}
