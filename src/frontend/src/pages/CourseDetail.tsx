import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Lock, Play, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { AuthUser, Page } from "../App";
import type { MockCourse } from "../data/courses";

interface CourseDetailProps {
  course: MockCourse;
  user: AuthUser | null;
  onNavigate: (page: Page) => void;
  onOpenAuth: (mode: "signin" | "signup") => void;
}

export function CourseDetail({
  course,
  user,
  onNavigate,
  onOpenAuth,
}: CourseDetailProps) {
  const [activeLesson, setActiveLesson] = useState(0);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    if (!user) {
      onOpenAuth("signup");
      return;
    }
    setEnrolled(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={() => onNavigate("courses")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        data-ocid="course_detail.back.button"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Courses
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-border"
          >
            {enrolled ? (
              <video
                controls
                className="w-full h-full"
                poster={course.thumbnail}
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  type="video/mp4"
                />
                <track kind="captions" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Enroll to watch this course
                </p>
              </div>
            )}
          </motion.div>

          {/* Course info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="bg-secondary text-foreground border-border mb-2">
                  {course.category}
                </Badge>
                <h1 className="text-2xl font-bold text-foreground">
                  {course.title}
                </h1>
                <p className="text-muted-foreground mt-1">
                  by {course.instructor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(course.rating)
                        ? "fill-[oklch(0.83_0.165_82)] text-[oklch(0.83_0.165_82)]"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 font-medium text-foreground">
                  {course.rating}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2,400 students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.lessons.length} lessons</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Enroll card */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 sticky top-24">
            <div className="text-3xl font-bold text-foreground">
              ${course.price}
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleEnroll}
              data-ocid="course_detail.enroll.primary_button"
            >
              {enrolled ? (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" /> Continue
                  Learning
                </>
              ) : (
                `Enroll Now — $${course.price}`
              )}
            </Button>
            {!user && (
              <p className="text-xs text-muted-foreground text-center">
                <button
                  type="button"
                  onClick={() => onOpenAuth("signin")}
                  className="text-primary hover:underline"
                  data-ocid="course_detail.signin.button"
                >
                  Sign in
                </button>{" "}
                to track your progress
              </p>
            )}
            {enrolled && (
              <p className="text-xs text-center text-muted-foreground">
                ✅ You are enrolled in this course
              </p>
            )}
          </div>

          {/* Lesson list */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                Course Curriculum
              </h3>
            </div>
            <div className="divide-y divide-border">
              {course.lessons.map((lesson, i) => (
                <button
                  type="button"
                  key={lesson.id}
                  onClick={() => enrolled && setActiveLesson(i)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                    activeLesson === i && enrolled
                      ? "bg-primary/10"
                      : enrolled
                        ? "hover:bg-secondary/50"
                        : "cursor-default"
                  }`}
                  data-ocid={`course_detail.lesson.item.${i + 1}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      activeLesson === i && enrolled
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {enrolled ? (
                      <Play className="w-3 h-3 fill-current" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
