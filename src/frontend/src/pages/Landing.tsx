import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Star, TrendingUp, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import { CourseCard } from "../components/CourseCard";
import { MOCK_COURSES } from "../data/courses";
import type { MockCourse } from "../data/courses";

interface LandingProps {
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: "signin" | "signup") => void;
  onCourseClick: (course: MockCourse) => void;
}

const CATEGORIES = ["All", "Film", "Design", "Business"];

export function Landing({
  onNavigate,
  onOpenAuth,
  onCourseClick,
}: LandingProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MOCK_COURSES.filter((c) => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Announcement Banner */}
      {showBanner && (
        <div className="bg-[#2B6DEB] text-white px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium relative">
          <span>
            🎉 New courses every week — Join 50,000+ creators and students on
            CourseFlow
          </span>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-white/80 hover:text-white transition-colors"
            data-ocid="banner.close.button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-1">
              🚀 The Creator Economy Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Teach the World.
              <br />
              <span className="text-primary">Build Your Empire.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Create and sell premium video courses to a global audience.
              Everything you need to teach, grow, and earn — in one beautiful
              platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => onOpenAuth("signup")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                data-ocid="hero.signup.primary_button"
              >
                Start Creating Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("courses")}
                className="rounded-full px-8 border-border text-foreground hover:bg-secondary"
                data-ocid="hero.browse.secondary_button"
              >
                Browse Courses
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">1,200+</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">$2M+</p>
                <p className="text-xs text-muted-foreground">
                  Paid to Creators
                </p>
              </div>
            </div>
          </motion.div>

          {/* Decorative illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Main card */}
              <div className="absolute inset-0 rounded-2xl bg-card border border-border overflow-hidden flex flex-col">
                <div className="bg-muted h-2/5 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-secondary rounded-full w-3/4" />
                  <div className="h-2 bg-muted rounded-full w-1/2" />
                  <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 bg-primary/60 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3.5,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-lg flex items-center gap-2 min-w-max"
              >
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  +340% Revenue
                </span>
              </motion.div>
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-lg flex items-center gap-2 min-w-max"
              >
                <Users className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-foreground">
                  12,400 enrolled
                </span>
              </motion.div>
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.8,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 -right-8 bg-card border border-border rounded-xl p-3 shadow-lg flex items-center gap-2 min-w-max"
              >
                <Star className="w-4 h-4 fill-[oklch(0.83_0.165_82)] text-[oklch(0.83_0.165_82)]" />
                <span className="text-xs font-semibold text-foreground">
                  4.9 Rating
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Explore Premium Creator Courses
            </h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked courses from world-class instructors
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate("courses")}
            className="border-border text-foreground hover:bg-secondary shrink-0"
            data-ocid="landing.view_all.button"
          >
            View All
          </Button>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search courses or instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border max-w-xs"
            data-ocid="landing.search.input"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="landing.filter.tab"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <CourseCard
                course={course}
                index={i + 1}
                onClick={onCourseClick}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
