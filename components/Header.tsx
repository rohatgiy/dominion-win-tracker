"use client";

import { Button } from "./ui/button";

export default function Header() {
	return (<header>
	<Button variant="link" className="font-semibold" onClick={() => window.location.href = "/"}>dowinion</Button>
	</header>);
}