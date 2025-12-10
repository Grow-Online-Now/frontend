/**
 * PostsPagination Component
 * Pagination controls with translation support
 */

import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import type { PaginationMeta } from '@/types/posts'

interface PostsPaginationProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  className?: string
}

export function PostsPagination({ pagination, onPageChange, className }: PostsPaginationProps) {
  const { t } = useTranslation()
  const { page, totalPages, total, limit } = pagination

  // Calculate showing range
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (page > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {t('dashboard.posts.pagination.showing', { from, to, total })}
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-disabled={page <= 1}
                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, idx) =>
              pageNum === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={pageNum === page}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-disabled={page >= totalPages}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
