import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const { name } = await request.json();
  // Here you would typically handle form creation logic, e.g., saving to a database
};
