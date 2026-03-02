import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function NotFound() {
  return <NotFoundState entity="Page" backHref="/" backLabel="Go home" />;
}
