export async function loader({ request }: { request: Request }) {
  return Response.json({ message: "Hello from API" });
} 