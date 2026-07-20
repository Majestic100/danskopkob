import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { POSTS, formatDate, getPost } from "@/lib/posts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  useEffect(() => {
    if (post) document.title = `${post.title} | MinBilPris`;
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-offwhite">
      <article>
        {/* Artikel-hoved */}
        <header className="bg-white">
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Alle indlæg
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink/50">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 font-bold uppercase tracking-wide text-brand">
                {post.category}
              </span>
              <span>{formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min.
                læsning
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-ink/60">{post.description}</p>
            <p className="mt-5 text-sm font-semibold text-ink/45">
              Af {post.author}
            </p>
          </div>
        </header>

        {/* Cover-billede */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-0 aspect-[16/8] translate-y-8 overflow-hidden rounded-3xl shadow-softlg">
            <img
              src={post.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Brødtekst */}
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* CTA i bunden af artiklen */}
          <div className="mt-12 rounded-3xl bg-ink p-8 text-white sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Hvad er <span className="text-brand">din</span> bil værd?
            </h2>
            <p className="mt-2 max-w-lg text-white/65">
              Indtast din nummerplade og få et gratis, uforpligtende tilbud
              inden for 24 timer — betaling samme dag og gratis afhentning i
              hele Danmark.
            </p>
            <a
              href={`${import.meta.env.BASE_URL}#tilbud`}
              className="btn-cta mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-bold text-white shadow-soft"
            >
              Få dit tilbud nu
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </article>

      {/* Relaterede indlæg */}
      {related.length > 0 && (
        <section className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Læs også
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-offwhite ring-1 ring-black/5 transition-shadow hover:shadow-soft"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand">
                      {p.category}
                    </p>
                    <h3 className="mt-2 font-extrabold leading-snug text-ink group-hover:text-brand">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
