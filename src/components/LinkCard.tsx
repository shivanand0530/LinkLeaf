import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Pin, PinOff, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { LinkDoc } from "../types";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "./ui/alert-dialog";

interface LinkCardProps {
  links: Array<LinkDoc>;
  setEditingLink: (link: LinkDoc) => void;
  handleTogglePin: (id: string) => void;
  handleDeleteLink: (id: string) => void;
}

const LinkCard = ({ links, setEditingLink, handleTogglePin, handleDeleteLink }: LinkCardProps) => {
  return (
    <>
      {links.map((link) => (
        <motion.div
          key={link._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Card className="group hover:shadow-sm transition-shadow h-full">
            <CardHeader >
              <div className="flex items-center justify-between ">
                <CardTitle className="text-sm font-medium leading-tight">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-2 w-full"
                  >
                    {link.favicon ? (
                      <img
                        src={link.favicon}
                        alt=""
                        className="h-4 w-4 rounded-sm"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </span>
                    )}
                    <span className="truncate max-w-[30vw] md:max-w-[20rem]">
                      {link.title}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardTitle>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingLink(link)}
                    aria-label="Edit link"
                    aria-describedby={`edit-link-${link._id}`}
                  >

                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePin(link._id)}
                    aria-label={link.isPinned ? "Unpin link" : "Pin link"}
                  >
                    {link.isPinned ? (
                      <PinOff className="h-3 w-3" />
                    ) : (
                      <Pin className="h-3 w-3" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Delete link"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this link? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteLink(link._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            {link.description && (
              <CardContent >
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {link.description}
                </p>
              </CardContent>
            )}
          </Card>
        </motion.div>
      ))}
    </>
  );
};

export default LinkCard;
