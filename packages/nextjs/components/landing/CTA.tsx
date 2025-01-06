import Link from "next/link";

export default function CTA() {
  return (
    <div className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join Estate today and discover a new way to invest in real estate through blockchain technology.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/properties" className="btn btn-secondary btn-lg">
            Browse Properties
          </Link>
          <Link href="/list-property" className="btn btn-outline btn-lg text-white hover:text-primary">
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
}
