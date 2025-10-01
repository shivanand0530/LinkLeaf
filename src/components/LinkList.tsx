import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Pin, PinOff, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { LinkDoc, Id } from "../types";
import { extractTitleFromURL } from "../utils/url";
import { LinkService } from "../services/linkService";


interface LinkListProps {
  links: LinkDoc[];
  onEdit: (link: {
    id: Id;
    url: string;
    title: string;
    description?: string;
    folderId?: Id;
  }) => void;
  onDelete: (id: Id) => void;
  onTogglePin: (id: Id) => void;
}

export default function LinkList({ links, onEdit, onDelete, onTogglePin }: LinkListProps) {

  const handleDelete = (id: Id) => {
    // Call the onDelete prop to delete the link
    onDelete(id);
    LinkService.deleteLink(id);
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-260px)] pr-1 scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {links.map((link) => (
          <motion.div 
            key={link._id} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.15 }}
          >
            <Card className="group hover:shadow-sm transition-shadow h-full">
              <CardHeader className="px-2 py-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium leading-tight">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-start gap-2"
                    >
                      {link.favicon ? (
                        <img
                          src={link.favicon}
                          alt=""
                          className="h-4 w-4 rounded-sm shrink-0 mt-0.5"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="inline-flex h-4 w-4 items-center justify-center shrink-0 mt-0.5">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{link.title || extractTitleFromURL(link.url)}</div>
                        <div className="text-xs text-muted-foreground truncate">{new URL(link.url).hostname}</div>
                      </div>
                    </a>
                  </CardTitle>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onEdit({
                          id: link._id,
                          url: link.url,
                          title: link.title,
                          description: link.description,
                          folderId: link.folderId,
                        })
                      }
                      aria-label="Edit link"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePin(link._id)}
                      aria-label={link.isPinned ? "Unpin link" : "Pin link"}
                    >
                      {link.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link._id)}
                      aria-label="Delete link"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {link.description && (
                <CardContent className="px-2 pb-1 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12">
          <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No links found</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first link
          </p>
        </div>
      )}
    </div>
  );
}