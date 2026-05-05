type PublicCardProps = {
    name: string;
    title: string;
    bio: string;
    phone: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    website: string;
  };
  
  export default function PublicCard({
    name,
    title,
    bio,
    phone,
    email,
    whatsapp,
    linkedin,
    website,
  }: PublicCardProps) {
    return (
      <section className="w-full max-w-sm rounded-[2rem] bg-white/10 border border-white/15 p-6 text-center shadow-2xl">
        <div className="w-28 h-28 mx-auto rounded-full bg-yellow-500 p-1">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-white">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>
  
        <h1 className="text-3xl font-bold mt-5 text-white">{name}</h1>
  
        <p className="text-yellow-400 mt-2">{title}</p>
  
        <p className="text-white/70 mt-4 text-sm">{bio}</p>
  
        <div className="mt-8 grid gap-3">
          <a href={`tel:${phone}`} className="bg-yellow-500 text-slate-900 py-3 rounded-full font-semibold">
            Call
          </a>
  
          <a href={`mailto:${email}`} className="bg-white/10 border border-white/15 py-3 rounded-full text-white">
            Email
          </a>
  
          <a href={`https://wa.me/${whatsapp}`} className="bg-white/10 border border-white/15 py-3 rounded-full text-white">
            WhatsApp
          </a>
  
          <a href={linkedin} className="bg-white/10 border border-white/15 py-3 rounded-full text-white">
            LinkedIn
          </a>
  
          <a href={website} className="bg-white/10 border border-white/15 py-3 rounded-full text-white">
            Website
          </a>
        </div>
      </section>
    );
  }