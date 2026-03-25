import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Play, Trophy } from "lucide-react";
import { motion } from "motion/react";
import type { AuthUser } from "../App";
import { MOCK_COURSES } from "../data/courses";

interface StudentDashboardProps {
  user: AuthUser;
  onCourseClick: (course: (typeof MOCK_COURSES)[0]) => void;
}

const ENROLLED_COURSES = [
  { course: MOCK_COURSES[0], progress: 72 },
  { course: MOCK_COURSES[1], progress: 45 },
  { course: MOCK_COURSES[4], progress: 18 },
];

export function StudentDashboard({
  user,
  onCourseClick,
}: StudentDashboardProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome card */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                You're making great progress. Keep it up!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">
                {ENROLLED_COURSES.length}
              </p>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <Trophy className="w-5 h-5 text-[oklch(0.83_0.165_82)] mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">24h</p>
              <p className="text-xs text-muted-foreground">Watch Time</p>
            </div>
          </div>
        </div>

        {/* Enrolled courses */}
        <h2 className="text-xl font-semibold text-foreground mb-4">
          My Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ENROLLED_COURSES.map(({ course, progress }, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
              onClick={() => onCourseClick(course)}
              data-ocid={`student.course.item.${i + 1}`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <Badge className="bg-secondary text-muted-foreground border-border text-xs mb-1">
                    {course.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground text-sm leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {course.instructor}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
