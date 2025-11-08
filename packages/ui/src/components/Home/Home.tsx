/**
 * Notion-style Home Page
 * Dynamic greeting (Good morning/afternoon/evening) with recent pages
 */

import * as React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export interface RecentPage {
  id: string;
  title: string;
  icon?: string;
  lastVisited: Date;
}

export interface HomeProps {
  recentPages?: RecentPage[];
  onPageClick?: (pageId: string) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

export function Home({ recentPages = [], onPageClick }: HomeProps) {
  const greeting = getGreeting();

  return (
    <div className="flex flex-col h-full overflow-auto p-6 lg:p-12">
      {/* Greeting Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-[var(--color-icon-default)]" />
          <span className="text-sm text-[var(--color-text-emphasis-medium)]">
            {formatTime(new Date())}
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          {greeting}
        </h1>
      </div>

      {/* Recently Visited Pages */}
      {recentPages.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Recently Visited
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPages.map((page) => (
              <Card
                key={page.id}
                className="cursor-pointer"
                onClick={() => onPageClick?.(page.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {page.icon ? (
                      <div className="text-2xl">{page.icon}</div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-[var(--color-bg-muted)] flex items-center justify-center text-[var(--color-text-muted)]">
                        📄
                      </div>
                    )}
                    <CardTitle className="flex-1 truncate">
                      {page.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <span className="text-xs text-[var(--color-text-emphasis-low)]">
                    {formatRelativeTime(page.lastVisited)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentPages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              Welcome to your workspace
            </h2>
            <p className="text-sm text-[var(--color-text-emphasis-medium)]">
              Start by creating a new page or opening an existing one
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
