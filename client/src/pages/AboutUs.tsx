import { Building, Users, Rocket, Target, Globe } from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    { name: "Eric Demuth", role: "Co-Founder & CEO", imageUrl: "/src/assets/IMG_5549.jpeg" },
    { name: "Paul Klanschek", role: "Co-Founder & CEO", imageUrl: "/src/assets/IMG_5550.jpeg" },
    { name: "Christian Trummer", role: "Co-Founder & CTO", imageUrl: "/src/assets/IMG_5551.jpeg" },
    { name: "Lukas Enzersdorfer-Konrad", role: "Deputy CEO", imageUrl: "/src/assets/IMG_5552.jpeg" },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-transparent py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Building the Future of Finance
          </h1>
          <p className="mt-4 md:mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            At BITPANDA PRO, we are dedicated to tearing down the barriers to investing. We believe everyone deserves access to the financial markets, and our mission is to provide a simple, secure, and powerful platform for both new and experienced investors.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Rocket className="w-10 h-10 text-primary" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                To empower people to take control of their financial future. We provide the tools, the technology, and the education to make investing accessible and understandable for everyone.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Target className="w-10 h-10 text-primary" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                To be the world's most trusted and user-friendly investment platform, offering a diverse range of assets and innovative products that cater to the evolving needs of the modern investor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Meet Our Leadership</h2>
            <p className="mt-2 text-muted-foreground text-lg">The visionaries driving our mission forward.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="rounded-full w-full h-full object-cover shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Globe className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Our Global Reach</h2>
            <p className="mt-2 text-muted-foreground text-lg max-w-2xl mx-auto">
              From our headquarters in Vienna, Austria, we serve a global community of millions of users, providing localized services and support across Europe and beyond.
            </p>
            <div className="mt-8 flex justify-center gap-8 text-2xl font-bold">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-primary">10M+</div>
                <div className="text-sm text-muted-foreground mt-1">Users Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-primary">15+</div>
                <div className="text-sm text-muted-foreground mt-1">European Licenses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-primary">700+</div>
                <div className="text-sm text-muted-foreground mt-1">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
