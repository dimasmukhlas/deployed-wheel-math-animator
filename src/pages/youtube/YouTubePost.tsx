import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getYouTubePostBySlug, type YouTubePost } from "@/lib/youtubePosts";
import { useAuth } from "@/contexts/AuthContext";
import { youtubeThumbUrl } from "@/lib/youtube";
import { estimateReadingTimeMinutes, formatPostDate } from "@/lib/postMeta";
import { extractToc, nodeText } from "@/lib/markdownToc";
import { toast } from "sonner";
import { Link2, Share2 } from "lucide-react";

const ADMIN_EMAIL = "dimasmukhlas@gmail.com";
const AUTHOR_NAME = "Cognizo";
const AUTHOR_ROLE = "Creator / Educator";

export default function YouTubePostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [post, setPost] = useState<YouTubePost | null>(null);
  const [missing, setMissing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        if (!slug) return;
        const p = await getYouTubePostBySlug(slug);
        if (!mounted) return;
        if (!p) {
          setMissing(true);
          return;
        }
        // Non-admins can't view drafts even if they guess the URL.
        if (!p.published && !isAdmin) {
          setMissing(true);
          return;
        }
        setPost(p);
      } catch (e) {
        if (mounted) setErr(e instanceof Error ? e.message : "Failed to load post");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug, isAdmin]);

  const ytLink = useMemo(() => (post ? `https://www.youtube.com/watch?v=${post.youtubeId}` : null), [post]);
  const cover = useMemo(() => (post ? post.coverImageUrl || youtubeThumbUrl(post.youtubeId, "max") : null), [post]);
  const readingMins = useMemo(() => (post ? estimateReadingTimeMinutes(post.contentMd) : null), [post]);
  const publishedDate = useMemo(
    () => (post?.publishedAt ? formatPostDate(post.publishedAt.toDate()) : null),
    [post]
  );
  const canonicalUrl = useMemo(() => (slug ? `${window.location.origin}/youtube/${slug}` : null), [slug]);
  const toc = useMemo(() => (post ? extractToc(post.contentMd) : []), [post]);
  const [showToc, setShowToc] = useState(true);
  const jsonLd = useMemo(() => {
    if (!post || !canonicalUrl) return null;
    const thumbnail = post.coverImageUrl || youtubeThumbUrl(post.youtubeId, "hq");
    const publishedIso = post.publishedAt ? post.publishedAt.toDate().toISOString() : undefined;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}/` },
            { "@type": "ListItem", position: 2, name: "YouTube posts", item: `${window.location.origin}/youtube` },
            { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
          ],
        },
        {
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          headline: post.title,
          description: post.excerpt,
          image: [thumbnail],
          author: { "@type": "Organization", name: "Cognizo" },
          publisher: { "@type": "Organization", name: "Cognizo" },
          ...(publishedIso ? { datePublished: publishedIso, dateModified: publishedIso } : {}),
        },
        {
          "@type": "VideoObject",
          name: post.title,
          description: post.excerpt,
          thumbnailUrl: [thumbnail],
          uploadDate: publishedIso,
          embedUrl: `https://www.youtube-nocookie.com/embed/${post.youtubeId}`,
          contentUrl: `https://www.youtube.com/watch?v=${post.youtubeId}`,
        },
      ],
    };
  }, [post, canonicalUrl]);

  if (missing) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">This post doesn’t exist (or it’s not published).</p>
          <Button asChild variant="outline">
            <Link to="/youtube">Back to posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 pt-6 md:pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <Button asChild variant="outline">
              <Link to="/youtube">Back to posts</Link>
            </Button>
            <div className="flex items-center gap-2">
              {post && !post.published ? <Badge variant="secondary">Draft</Badge> : null}
              {isAdmin ? (
                <Button asChild variant="secondary">
                  <Link to="/admin">Edit in CMS</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {err ? (
        <div className="px-4 mt-4">
          <div className="max-w-5xl mx-auto text-sm text-destructive">{err}</div>
        </div>
      ) : null}

      {!post ? (
        <div className="px-4 mt-10">
          <div className="max-w-5xl mx-auto text-sm text-muted-foreground">Loading…</div>
        </div>
      ) : (
        <>
          {jsonLd ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          ) : null}
          {/* Hero */}
          <header className="mt-6 md:mt-8">
            <div className="max-w-5xl mx-auto px-4">
              <div className="relative overflow-hidden rounded-2xl border bg-card shadow-card">
                <div className="absolute inset-0">
                  {cover ? (
                    <img
                      src={cover}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = "1";
                          img.src = youtubeThumbUrl(post.youtubeId, "hq");
                        }
                      }}
                      alt=""
                      className="w-full h-full object-cover scale-[1.03]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/65 to-background/10" />
                </div>

                <div className="relative p-6 md:p-10">
                  <div className="max-w-3xl space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.slice(0, 6)?.map((t) => (
                        <Badge key={t} variant="outline" className="bg-background/70">
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                      <span className="text-gradient">{post.title}</span>
                    </h1>

                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      {publishedDate ? <span>{publishedDate}</span> : null}
                      {readingMins ? <span>• {readingMins} min read</span> : null}
                      {ytLink ? (
                        <a href={ytLink} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                          Watch on YouTube
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="mt-8 md:mt-10 px-4">
            <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
              <div className="max-w-3xl space-y-8">
                {/* Byline + share */}
                <Card className="p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{AUTHOR_NAME}</div>
                      <div className="text-xs text-muted-foreground">
                        {AUTHOR_ROLE}
                        {publishedDate ? ` • ${publishedDate}` : ""}
                        {readingMins ? ` • ${readingMins} min read` : ""}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!canonicalUrl) return;
                          try {
                            await navigator.clipboard.writeText(canonicalUrl);
                            toast.success("Link copied");
                          } catch {
                            toast.error("Could not copy link");
                          }
                        }}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Copy link
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          if (!canonicalUrl) return;
                          try {
                            if (navigator.share) {
                              await navigator.share({ title: post.title, text: post.excerpt, url: canonicalUrl });
                              return;
                            }
                          } catch {
                            // ignore user cancel
                          }

                          const shareText = `${post.title}\n\n${canonicalUrl}`;
                          try {
                            await navigator.clipboard.writeText(shareText);
                            toast.success("Share text copied");
                          } catch {
                            toast.error("Share not supported");
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      {canonicalUrl ? (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              X
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Facebook
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              LinkedIn
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${canonicalUrl}`)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
                      title={post.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </Card>

                <div className="cognizo-article p-6 md:p-10">
                  <div
                    className={[
                      "prose prose-slate dark:prose-invert max-w-none",
                      "prose-headings:font-display prose-headings:tracking-tight",
                      "prose-p:leading-relaxed prose-p:text-foreground/90",
                      "prose-a:underline prose-a:decoration-primary/40 prose-a:underline-offset-4 hover:prose-a:decoration-primary",
                      "prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-lg prose-blockquote:px-4 prose-blockquote:py-3",
                      "prose-h2:border-l-4 prose-h2:border-primary/60 prose-h2:pl-4",
                      "prose-h3:pl-4 prose-h3:text-foreground/90",
                      "prose-ul:pl-6 prose-ol:pl-6",
                      "prose-li:my-1",
                      "prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                      "prose-pre:bg-muted/60 prose-pre:border prose-pre:shadow-sm",
                    ].join(" ")}
                  >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children, ...props }) => {
                        const text = nodeText(children);
                        const match = toc.find((t) => t.text === text && t.level === 2);
                        const id = match?.id ?? undefined;
                        return (
                          <h2 id={id} {...props}>
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ children, ...props }) => {
                        const text = nodeText(children);
                        const match = toc.find((t) => t.text === text && t.level === 3);
                        const id = match?.id ?? undefined;
                        return (
                          <h3 id={id} {...props}>
                            {children}
                          </h3>
                        );
                      },
                    }}
                  >
                    {post.contentMd}
                  </ReactMarkdown>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button asChild variant="outline">
                    <Link to="/youtube">Back to posts</Link>
                  </Button>
                  {ytLink ? (
                    <Button asChild>
                      <a href={ytLink} target="_blank" rel="noreferrer">
                        Watch on YouTube
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* TOC */}
              <aside className="hidden lg:block">
                {toc.length ? (
                  <div className="sticky top-6 space-y-3">
                    <Card className="p-5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold">On this page</div>
                        <Button variant="ghost" size="sm" onClick={() => setShowToc((v) => !v)}>
                          {showToc ? "Hide" : "Show"}
                        </Button>
                      </div>
                      {showToc ? (
                        <nav className="mt-3 space-y-2 text-sm">
                          {toc.map((item) => (
                            <a
                              key={item.id}
                              href={`#${item.id}`}
                              className={[
                                "block text-muted-foreground hover:text-foreground transition-colors",
                                item.level === 3 ? "pl-3" : "",
                              ].join(" ")}
                            >
                              {item.text}
                            </a>
                          ))}
                        </nav>
                      ) : null}
                    </Card>
                  </div>
                ) : null}
              </aside>
            </div>
          </main>

          {/* Lightweight “header/thumbnail” fallback for social previews */}
          <img src={youtubeThumbUrl(post.youtubeId, "hq")} alt="" className="hidden" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

