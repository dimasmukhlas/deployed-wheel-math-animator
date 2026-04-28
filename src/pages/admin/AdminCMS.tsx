import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { deleteYouTubePost, listYouTubePosts, upsertYouTubePost, type YouTubePostInput } from "@/lib/youtubePosts";
import { youtubeIdFromUrl } from "@/lib/youtube";
import { seedPosts } from "@/data/youtubePostsSeed";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, Plus, Eye, Save, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { WpRichTextEditor } from "@/components/editor/WpRichTextEditor";
import { uploadCoverImage } from "@/lib/storageUpload";

const ADMIN_EMAIL = "dimasmukhlas@gmail.com";

type LoginState = { email: string; password: string };

const emptyDraft: YouTubePostInput = {
  slug: "",
  title: "",
  excerpt: "",
  youtubeId: "",
  coverImageUrl: undefined,
  tags: [],
  published: false,
  publishedAt: null,
  contentMd: "",
};

export default function AdminCMS() {
  const { user, loading, signInEmail, signInGoogle, logout } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const [login, setLogin] = useState<LoginState>({ email: ADMIN_EMAIL, password: "" });
  const [posts, setPosts] = useState<YouTubePostInput[] | null>(null);
  const [draft, setDraft] = useState<YouTubePostInput>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [coverBusy, setCoverBusy] = useState(false);

  const tagsStr = useMemo(() => draft.tags.join(", "), [draft.tags]);
  const isNew = !draft.slug.trim();

  const filteredPosts = useMemo(() => {
    if (!posts) return null;
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const hay = `${p.title} ${p.slug} ${p.excerpt} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, query]);

  const loadPosts = async () => {
    const items = await listYouTubePosts({ includeUnpublished: true });
    setPosts(items);
  };

  const ensureLoaded = async () => {
    if (posts !== null) return;
    await loadPosts();
  };

  const save = async () => {
    if (!draft.slug.trim()) throw new Error("Slug is required");
    if (!draft.title.trim()) throw new Error("Title is required");
    if (!draft.youtubeId.trim()) throw new Error("YouTube video id is required");
    await upsertYouTubePost({
      ...draft,
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      youtubeId: draft.youtubeId.trim(),
      tags: draft.tags.map((t) => t.trim()).filter(Boolean),
    });
  };

  useEffect(() => {
    // Auto-load list once, WordPress-style.
    if (!isAdmin) return;
    if (posts !== null) return;
    void loadPosts().catch(() => {
      // ignore
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">CMS login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with the admin account to manage YouTube posts.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email & password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={login.email}
                  onChange={(e) => setLogin((s) => ({ ...s, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={login.password}
                  onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={async () => {
                    try {
                      setBusy(true);
                      await signInEmail(login.email, login.password);
                      toast.success("Signed in");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Sign-in failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  disabled={busy}
                >
                  Sign in
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      setBusy(true);
                      await signInGoogle();
                      toast.success("Signed in");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Sign-in failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  disabled={busy}
                >
                  Google
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            You’re signed in as <span className="font-medium">{user.email}</span>, but only{" "}
            <span className="font-medium">{ADMIN_EMAIL}</span> can access the CMS.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                await logout();
              }}
            >
              Sign out
            </Button>
            <Button asChild variant="outline">
              <Link to="/youtube">Back to posts</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto pt-6 md:pt-8 px-4 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Cognizo CMS</h1>
            <p className="text-sm text-muted-foreground">A WordPress-like editor for YouTube posts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/youtube">View site</Link>
            </Button>
            <Button variant="secondary" onClick={async () => logout()}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(720px,1fr)_280px]">
          {/* Left: posts list */}
          <Card className="h-[calc(100vh-150px)] overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Posts</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={async () => {
                      try {
                        setBusy(true);
                        await loadPosts();
                        toast.success("Refreshed");
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Refresh failed");
                      } finally {
                        setBusy(false);
                      }
                    }}
                    disabled={busy}
                    aria-label="Refresh"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={async () => {
                      await ensureLoaded();
                      setDraft(emptyDraft);
                      setActiveTab("editor");
                    }}
                    aria-label="New"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts…" className="pl-9" />
              </div>

              <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={async () => {
                  try {
                    setBusy(true);
                    for (const p of seedPosts) {
                      await upsertYouTubePost({ ...p, publishedAt: p.publishedAt ?? null });
                    }
                    toast.success("Seeded starter posts");
                    await loadPosts();
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Seed failed");
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Seed starter posts
                </span>
                <Badge variant="outline">{seedPosts.length}</Badge>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="p-4 pt-0 space-y-2">
                  {filteredPosts === null ? (
                    <p className="text-xs text-muted-foreground py-2">Loading…</p>
                  ) : filteredPosts.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No matches.</p>
                  ) : (
                    filteredPosts.map((p) => (
                      <button
                        key={p.slug}
                        className={[
                          "w-full text-left rounded-lg border px-3 py-2 transition-colors",
                          draft.slug === p.slug ? "bg-muted" : "hover:bg-muted/60",
                        ].join(" ")}
                        onClick={() => {
                          setDraft(p);
                          setActiveTab("editor");
                        }}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{p.title || p.slug}</div>
                            <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                          </div>
                          {!p.published ? <Badge variant="secondary">Draft</Badge> : <Badge>Live</Badge>}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Center: editor/preview */}
          <Card className="h-[calc(100vh-150px)] overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{isNew ? "New post" : "Edit post"}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("preview")}
                    disabled={!draft.slug.trim()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "editor" | "preview")}>
                <div className="px-8 pb-3">
                  <TabsList>
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="editor" className="m-0">
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="px-8 pb-8 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={draft.title}
                          onChange={(e) => setDraft((s) => ({ ...s, title: e.target.value }))}
                          placeholder="Post title"
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={draft.slug}
                            onChange={(e) => setDraft((s) => ({ ...s, slug: e.target.value }))}
                            placeholder="your-post-slug"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="youtube">YouTube URL or ID</Label>
                          <Input
                            id="youtube"
                            value={draft.youtubeId}
                            onChange={(e) => {
                              const v = e.target.value;
                              const id = youtubeIdFromUrl(v) ?? v;
                              setDraft((s) => ({ ...s, youtubeId: id }));
                            }}
                            placeholder="https://www.youtube.com/watch?v=…"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={draft.excerpt}
                          onChange={(e) => setDraft((s) => ({ ...s, excerpt: e.target.value }))}
                          placeholder="Short description for the card and SEO snippet."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={tagsStr}
                          onChange={(e) =>
                            setDraft((s) => ({
                              ...s,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="privacy, networking, security"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Content</Label>
                        <WpRichTextEditor
                          valueMarkdown={draft.contentMd}
                          onChangeMarkdown={(next) => setDraft((s) => ({ ...s, contentMd: next }))}
                          placeholder="Start writing your post…"
                          uploadSlug={draft.slug || "unsaved"}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="preview" className="m-0">
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="px-8 pb-8 space-y-4">
                      <div className="space-y-1 pt-2">
                        <div className="text-2xl font-bold tracking-tight">{draft.title || "Untitled"}</div>
                        <div className="text-sm text-muted-foreground">{draft.excerpt}</div>
                      </div>
                      <div className="cognizo-article p-6 md:p-8">
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
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.contentMd || "_No content yet._"}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right: publish panel */}
          <Card className="h-[calc(100vh-150px)] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Cover image</div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={coverBusy}
                    onClick={() => {
                      const input = document.getElementById("cover-upload") as HTMLInputElement | null;
                      input?.click();
                    }}
                  >
                    Upload
                  </Button>
                </div>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    try {
                      setCoverBusy(true);
                      const url = await uploadCoverImage({ file, slug: draft.slug || "unsaved" });
                      setDraft((s) => ({ ...s, coverImageUrl: url }));
                      toast.success("Cover uploaded");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Cover upload failed");
                    } finally {
                      setCoverBusy(false);
                    }
                  }}
                />
                <Input
                  value={draft.coverImageUrl ?? ""}
                  onChange={(e) => setDraft((s) => ({ ...s, coverImageUrl: e.target.value || undefined }))}
                  placeholder="Paste an image URL (optional)"
                />
                {draft.coverImageUrl ? (
                  <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
                    <img src={draft.coverImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    If empty, the site uses the YouTube thumbnail as the cover.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="font-medium">Status</div>
                  <div className="text-sm text-muted-foreground">{draft.published ? "Published" : "Draft"}</div>
                </div>
                <Switch checked={draft.published} onCheckedChange={(v) => setDraft((s) => ({ ...s, published: v }))} />
              </div>

              <div className="grid gap-2">
                <Button
                  onClick={async () => {
                    try {
                      setBusy(true);
                      await save();
                      toast.success("Saved");
                      await loadPosts();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Save failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  disabled={busy}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button variant="outline" asChild disabled={!draft.slug.trim()}>
                  <Link to={draft.slug.trim() ? `/youtube/${draft.slug.trim()}` : "/youtube"}>
                    <Eye className="h-4 w-4 mr-2" />
                    View on site
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      if (!draft.slug.trim()) throw new Error("Select a post first");
                      const ok = window.confirm(`Delete “${draft.slug}”? This cannot be undone.`);
                      if (!ok) return;
                      setBusy(true);
                      await deleteYouTubePost(draft.slug.trim());
                      toast.success("Deleted");
                      setDraft(emptyDraft);
                      await loadPosts();
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Delete failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Drafts are only visible to the admin. When you publish, the post becomes public on `/youtube`.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

