import {
    Filter,
    LayoutGrid,
    List,
    SortAsc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DashboardToolbarProps {
    view: "grid" | "list";
    onViewChange: (view: "grid" | "list") => void;
    statusFilter: string;
    onStatusFilterChange: (status: string) => void;
    sortOrder: string;
    onSortOrderChange: (sort: string) => void;
}

export function DashboardToolbar({
    view,
    onViewChange,
    statusFilter,
    onStatusFilterChange,
    sortOrder,
    onSortOrderChange,
}: DashboardToolbarProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={statusFilter}
                            onValueChange={onStatusFilterChange}
                        >
                            <DropdownMenuRadioItem value="all">All Forms</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="published">
                                Published
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="draft">Drafts</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <SortAsc className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Sort
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={sortOrder}
                            onValueChange={onSortOrderChange}
                        >
                            <DropdownMenuRadioItem value="updated">
                                Last Updated
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="alphabetical">
                                Alphabetical
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="responses">
                                Most Responses
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(value) => {
                        if (value) onViewChange(value as "grid" | "list");
                    }}
                >
                    <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
                        <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view" size="sm">
                        <List className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}
