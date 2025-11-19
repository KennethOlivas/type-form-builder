export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes, not hours
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Build</h3>
            <p className="text-muted-foreground">
              Drag and drop your questions. Choose from 10+ question types.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Customize</h3>
            <p className="text-muted-foreground">
              Add your logic and brand design. Make it uniquely yours.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Share</h3>
            <p className="text-muted-foreground">
              Get a link and share it anywhere. Track responses in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
