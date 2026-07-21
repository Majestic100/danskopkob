import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { POSTS, formatDate, type Post } from "@/lib/posts";

function CategoryChip({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
      {category}
    </span>
  );
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 text-xs text-ink/50">
      <span>{formatDate(post.date)}</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min. læsning
      </span>
    </div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="reveal group grid overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-softlg lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[320px]">
        <img
          src={post.image}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
        <div className="flex items-center gap-3">
          <CategoryChip category={post.category} />
          <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink/60">
            Seneste indlæg
          </span>
        </div>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
          {post.title}
        </h2>
        <p className="text-ink/65">{post.description}</p>
        <div className="mt-1 flex items-center justify-between">
          <PostMeta post={post} />
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand">
            Læs indlæg
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post, delay }: { post: Post; delay: number }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="reveal group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-softlg"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-lg font-extrabold leading-snug tracking-tight text-ink group-hover:text-brand">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm text-ink/60">{post.description}</p>
        <div className="mt-auto pt-2">
          <PostMeta post={post} />
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  useEffect(() => {
    document.title = "Blog | MinBilPris — guides om bilsalg, priser og eksport";
  }, []);

  const [featured, ...rest] = POSTS;

  return (
    <div className="bg-offwhite">
      {/* Side-hoved */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="reveal text-xs font-bold uppercase tracking-[0.25em] text-brand">
            Blog & guides
          </p>
          <h1 className="reveal mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Bliv klogere på dit bilsalg
          </h1>
          <p
            className="reveal mx-auto mt-4 max-w-2xl text-lg text-ink/60"
            style={{ transitionDelay: "80ms" }}
          >
            Guides, priser og indsigt fra folk, der køber biler hver eneste
            dag — så du kan sælge din bil klogere og til en bedre pris.
          </p>
        </div>
      </section>

      {/* Indlæg */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {featured && <FeaturedCard post={featured} />}

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <PostCard key={post.slug} post={post} delay={i * 80} />
            ))}
          </div>
        )}
      </section>

      {/* CTA-bånd */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col items-center gap-5 rounded-3xl bg-ink px-7 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Klar til at høre, hvad din bil er værd?
          </h2>
          <p className="max-w-xl text-white/65">
            Indtast din nummerplade og få et gratis, uforpligtende tilbud
            inden for 24 timer.
          </p>
          <Link
            to="/saelg-din-bil"
            className="btn-cta inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-bold text-white shadow-soft"
          >
            Få dit tilbud nu
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
