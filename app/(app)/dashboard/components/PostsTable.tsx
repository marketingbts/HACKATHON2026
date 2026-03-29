'use client'

import { cn } from '@/lib/utils'
import { SocialBadge } from './SocialBadge'
import type { UpcomingPostFromAPI } from '@/lib/services/dashboard'

type PostsTableProps = {
  posts: UpcomingPostFromAPI[]
  className?: string
}

function TypeBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'rounded-sm bg-surface-primary-wash',
        'text-xs font-medium text-neutral-ui-label',
      )}
    >
      {label}
    </span>
  )
}

export function PostsTable({ posts, className }: PostsTableProps) {
  return (
    <>
      {/* ── Desktop table (lg+) ── */}
      <div className={cn('hidden lg:block rounded-lg overflow-hidden border border-border-light', className)}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-[44px] bg-surface-muted border-b border-border-light">
              {['DÍA', 'PLAN DE ORIGEN', 'TIPO', 'RED SOCIAL'].map((col) => (
                <th
                  key={col}
                  className="px-6 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-ui-muted w-[240px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr
                key={post.id}
                className={cn(
                  'h-[65px] border-b border-border-light last:border-0',
                  i % 2 === 0 ? 'bg-surface-white' : 'bg-surface-background',
                )}
              >
                {/* Día */}
                <td className="px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold capitalize text-brand-900">{post.date}</span>
                    {post.time && <span className="text-xs text-neutral-ui-muted">{post.time}</span>}
                  </div>
                </td>

                {/* Plan de origen */}
                <td className="px-6">
                  <span className="text-sm text-neutral-900">{post.planName}</span>
                </td>

                {/* Tipo */}
                <td className="px-6">
                  <TypeBadge label={post.type} />
                </td>

                {/* Red Social */}
                <td className="px-6">
                  <SocialBadge network={post.socialNetwork} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards (< lg) ── */}
      <div className={cn('flex flex-col gap-3 lg:hidden', className)}>
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-border-light bg-surface-white p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold capitalize text-brand-900">{post.date}</span>
                {post.time && <span className="text-xs text-neutral-ui-muted">{post.time}</span>}
              </div>
              <SocialBadge network={post.socialNetwork} />
            </div>
            <span className="text-sm text-neutral-900">{post.planName}</span>
            <TypeBadge label={post.type} />
          </div>
        ))}
      </div>
    </>
  )
}
