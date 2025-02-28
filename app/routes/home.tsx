import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
	return [{ title: "New React Router App" }];
}

export default function Home() {
	return <Welcome />;
}
