import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listYouTubePosts, type YouTubePost } from "@/lib/youtubePosts";
import { useAuth } from "@/contexts/AuthContext";
import { youtubeThumbUrl } from "@/lib/youtube";
import { estimateReadingTimeMinutes } from "@/lib/postMeta";

const ADMIN_EMAIL = "dimasmukhlas@gmail.com";

export default function YouTubeIndex() {
  const { user } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [posts, setPosts] = useState<YouTubePost[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const items = await listYouTubePosts({ includeUnpublished: isAdmin });
        if (mounted) setPosts(items);
      } catch (e) {
        if (mounted) setErr(e instanceof Error ? e.message : "Failed to load posts");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const title = useMemo(() => "Cognizo YouTube Posts", []);

  const featured = posts?.[0] ?? null;
  const rest = posts?.slice(1) ?? [];

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-6xl mx-auto pt-8 md:pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="text-gradient">{title}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Professional, readable posts inspired by the best blog experiences — powered by Cognizo videos.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild>
              <a href="https://www.youtube.com/@Cognizo" target="_blank" rel="noreferrer">
                Visit YouTube
              </a>
            </Button>
          </div>
        </div>

        {err ? <p className="mt-6 text-sm text-destructive">{err}</p> : null}

        {posts === null ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No posts yet. {isAdmin ? <Link className="underline" to="/admin">Create one in the CMS</Link> : null}
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {featured ? (
              <Link to={`/youtube/${featured.slug}`} className="block">
                <Card className="overflow-hidden hover:shadow-card transition-shadow">
                  <div className="grid lg:grid-cols-[1.2fr_1fr]">
                    <div className="aspect-video lg:aspect-auto lg:min-h-[320px] bg-muted">
                      <img
                        src={featured.coverImageUrl || youtubeThumbUrl(featured.youtubeId, "max")}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = "1";
                            img.src = featured.coverImageUrl || youtubeThumbUrl(featured.youtubeId, "hq");
                          }
                        }}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {featured.tags?.slice(0, 5)?.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                        {!featured.published ? <Badge variant="secondary">Draft</Badge> : null}
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{featured.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {estimateReadingTimeMinutes(featured.contentMd)} min read
                      </div>
                      <Button>Read post</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : null}

            {rest.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.slug} to={`/youtube/${p.slug}`} className="block">
                    <Card className="h-full overflow-hidden hover:shadow-card transition-shadow">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={p.coverImageUrl || youtubeThumbUrl(p.youtubeId, "max")}
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = "1";
                              img.src = p.coverImageUrl || youtubeThumbUrl(p.youtubeId, "hq");
                            }
                          }}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {!p.published ? (
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary">Draft</Badge>
                          </div>
                        ) : null}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.tags?.slice(0, 3)?.map((t) => (
                            <Badge key={t} variant="outline">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {estimateReadingTimeMinutes(p.contentMd)} min read
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

