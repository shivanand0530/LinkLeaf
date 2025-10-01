import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { FolderOpen, Link as LinkIcon, Pin, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeProvider } from "../context/ThemeContext";
import { useAppSelector } from "../hooks/useRedux";
import { SignIn } from "../components/auth/SignIn";
import { SignUp } from "../components/auth/SignUp";
import { useState, useRef } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { LayoutTextFlip } from "../components/ui/layout-text-flip";
import VariableProximity from "../components/ui/VariableProximity";
import Header from "../components/Header";


export default function Landing() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const Refcontainer = useRef(null!);

  const handleGetStarted = () => {
    if (user) {
      navigate("/main");
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <ThemeProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        <Header />

        {/* Hero Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold tracking-tight mb-8">
                {user ? (
                  "Welcome Back,"
                ) : (
                  <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                    <LayoutTextFlip text="Welcome to " words={["LinkLeaf"]} />
                  </motion.div>
                )}
                <br />
                <span className="text-muted-foreground">
                  {user
                    ? user.email?.split("@")[0]?.replace(/[0-9]/g, "") ?? "User"
                    : "Your Personal Link Manager"}
                </span>
              </h2>{" "}
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                {user
                  ? "Continue organizing your links and managing your collections."
                  : "A minimal link manager that helps you save, organize, and find your important links without the clutter."}
              </p>
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={loading}
                className="text-lg px-8 py-6"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>

              <Dialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
              >
                <DialogContent className="sm:max-w-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <DialogHeader className="text-center">
                    <DialogTitle>Welcome to LinkLeaf</DialogTitle>
                    <DialogDescription>
                      Sign in or create an account to start organizing your
                      links
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs
                    defaultValue={mode}
                    onValueChange={(value) =>
                      setMode(value as "signin" | "signup")
                    }
                  >
                    <TabsList className="w-full mb-6 justify-center flex-items-center ">
                      <TabsTrigger
                        value="signin"
                        className="w-full justify-center flex-items-center"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className="w-full justify-center flex-items-center"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                      <SignIn onSuccess={() => setIsAuthDialogOpen(false)} />
                    </TabsContent>
                    <TabsContent value="signup">
                      <SignUp onSuccess={() => setIsAuthDialogOpen(false)} />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold tracking-tight mb-4">
                Everything you need
              </h3>
              <p className="text-muted-foreground text-lg">
                Simple tools for effective link management
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 box-shadow: 5px 10px #ffffff;">
              {[
                {
                  icon: LinkIcon,
                  title: "Save Links",
                  description:
                    "Quickly save any URL with a title and optional description",
                },
                {
                  icon: FolderOpen,
                  title: "Organize",
                  description:
                    "Create folders to categorize your links by topic or project",
                },
                {
                  icon: Pin,
                  title: "Pin Favorites",
                  description: "Pin your most-used links for instant access",
                },
                {
                  icon: Search,
                  title: "Find Fast",
                  description:
                    "Search through all your links by title, URL, or description",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-8">
                      <feature.icon className="h-12 w-12 mx-auto mb-6 text-primary" />
                      <h4 className="text-lg font-semibold mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-3xl font-bold tracking-tight mb-6">
                Ready to organize?
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                Start managing your links with a clean, distraction-free
                interface.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto ">
            <div
              ref={Refcontainer}
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <VariableProximity
                label={"LInkLeaf"}
                className={
                  "variable-proximity-demo font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
                }
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={Refcontainer}
                radius={100}
                falloff="linear"
              />
            </div>
            {/* Copyright */}
            <div className=" text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} LinkLeaf. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </ThemeProvider>
  );
}
