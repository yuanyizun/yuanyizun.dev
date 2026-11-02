import { Container } from "@/components/primitive/container/container";

export default function Loading() {
  return (
    <Container
      as="main"
      id="main-content"
      className="flex min-h-[36rem] flex-col gap-6 py-8 sm:py-12"
    >
      <div className="h-14 w-2/3 max-w-xl rounded-xl bg-card" />
      <div className="h-6 w-1/2 max-w-md rounded-md bg-card" />
      <div className="mt-6 h-48 rounded-xl bg-card" />
      <div className="h-24 rounded-xl bg-card" />
      <div className="h-24 rounded-xl bg-card" />
    </Container>
  );
}
