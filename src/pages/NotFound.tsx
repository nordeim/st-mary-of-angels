import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-shrine-maroon-950 pt-24">
      <Container className="py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shrine-gold-300">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl text-shrine-cream sm:text-5xl">
          This path does not lead to the church.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-shrine-cream/75">
          The address you asked for is not on these grounds. Return home, or come in time for
          Mass.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">Return home</Button>
          <Button to="/worship" variant="outline-light">
            Mass times
          </Button>
        </div>
      </Container>
    </section>
  );
}
