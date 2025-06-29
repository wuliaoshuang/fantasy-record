"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Search, Filter, Calendar, Tag, Edit } from "lucide-react"
import Link from "next/link"
import { useRecords, useRecordFilters } from "@/hooks/use-records"
import { formatDate, getMoodEmoji } from "@/lib/data-utils"
import { SORT_OPTIONS } from "@/lib/constants"
import { Loading, RecordListSkeleton } from "@/components/ui/loading"

export default function AllRecords() {
  // 使用自定义hooks
  const { records, loading, pagination, fetchRecords } = useRecords(1)
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterTag,
    setFilterTag,
    filteredRecords,
    allTags,
  } = useRecordFilters(records)

  const handlePageChange = (page: number) => {
    fetchRecords(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-gray-200">所有记录</h1>
            <p className="text-gray-600">浏览和搜索你的所有幻想记录</p>
          </div>
          <RecordListSkeleton count={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-200">所有记录</h1>
          <p className="text-gray-600">浏览和搜索你的所有幻想记录</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4" />
              <Input
                placeholder="搜索记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glassmorphism border-0 !backdrop-blur-none"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 glassmorphism border-0">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Tag */}
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full sm:w-48 glassmorphism border-0">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标签</SelectItem>
                {allTags.map((tag: string) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>共 {pagination.totalRecords} 条记录</span>
            <span>第 {pagination.currentPage} 页，共 {pagination.totalPages} 页</span>
            {filterTag !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {filterTag}
              </Badge>
            )}
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid gap-6">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="glassmorphism border-0 hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Link href={`/records/${record.id}`} className="flex-1">
                    <CardTitle className="text-xl font-medium text-foreground hover:text-primary transition-colors cursor-pointer">{record.title}</CardTitle>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(record.mood)}</span>
                    <Link href={`/records/${record.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <Link href={`/records/${record.id}`}>
                <CardContent className="space-y-4 cursor-pointer">
                  <p className="text-muted-foreground leading-relaxed">{record.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {record.tags?.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFilterTag(tag)
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(record.createdAt, true)}</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.currentPage > 1) {
                        handlePageChange(pagination.currentPage - 1)
                      }
                    }}
                    className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* 页码显示逻辑 */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                  // 显示逻辑：始终显示第1页、最后一页、当前页及其前后各1页
                  const showPage = 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.currentPage) <= 1
                  
                  if (!showPage) {
                    // 显示省略号
                    if (page === 2 && pagination.currentPage > 4) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    if (page === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page)
                        }}
                        isActive={pagination.currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.currentPage < pagination.totalPages) {
                        handlePageChange(pagination.currentPage + 1)
                      }
                    }}
                    className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Empty State */}
        {filteredRecords.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>没有找到匹配的记录</p>
              <p className="text-sm">尝试调整搜索条件或筛选器</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterTag("all")
              }}
            >
              清除筛选条件
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
