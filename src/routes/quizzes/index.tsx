// src/routes/quizzes/quizzes.index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { QuizSummary } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Skeleton } from "@/components/atoms/skeleton";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/quizzes/")({
  component: QuizListPage,
});

function QuizListPage() {
  const { token } = useAuth()
  const { data: publicQuizzes, isLoading: loadingPublic, isError: errorPublic } = useQuery({
    queryKey: ["quizzes", "public"],
    queryFn: async () => (await api.get<QuizSummary[]>("/quizzes")).data,
  })
  const { data: myQuizzes, isLoading: loadingMine } = useQuery({
    queryKey: ["quizzes", "mine"],
    queryFn: async () => (await api.get<QuizSummary[]>("/quizzes/my-quizzes")).data,
    enabled: !!token,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Public Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPublic ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : errorPublic ? (
            <p className="text-destructive">Failed to load quizzes.</p>
          ) : publicQuizzes && publicQuizzes.length > 0 ? (
            <ul className="space-y-3">
              {publicQuizzes.map((q) => (
                <li key={q.id} className="flex items-center justify-between">
                  <div>
                    <Link
                      to="/quizzes/$id"
                      params={{ id: q.id }}
                      className="font-medium underline"
                    >
                      {q.title}
                    </Link>
                    {q.description && (
                      <p className="text-sm text-muted-foreground">{q.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">{q._count.quizWords ?? 0} words</Badge>
                    <Badge variant="outline">{q._count.attempts ?? 0} attempts</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No quizzes yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p className="text-muted-foreground">Login to see your custom quizzes.</p>
          ) : loadingMine ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : myQuizzes && myQuizzes.length > 0 ? (
            <ul className="space-y-3">
              {myQuizzes.map((q) => (
                <li key={q.id} className="flex items-center justify-between">
                  <div>
                    <Link
                      to="/quizzes/$id"
                      params={{ id: q.id }}
                      className="font-medium underline"
                    >
                      {q.title}
                    </Link>
                    {q.description && (
                      <p className="text-sm text-muted-foreground">{q.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{q._count.quizWords ?? 0} words</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">You haven't created any quizzes yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
