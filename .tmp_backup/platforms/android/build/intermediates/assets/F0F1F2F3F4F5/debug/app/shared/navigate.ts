import { topmost } from "ui/frame";

export function go(view) {
    topmost().navigate(view);
}