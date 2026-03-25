import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CourseCard } from "../components/CourseCard";
import { MOCK_COURSES } from "../data/courses";
import type { MockCourse } from "../data/courses";

interface CoursesProps {
  onCourseClick: (course: MockCourse) => void;
}

const CATEGORIES = ["All", "Film", "Design", "Business"];

export function Courses({ onCourseClick }: CoursesProps) {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Course Catalog
        </h1>
        <p className="text-muted-foreground mb-8">
          Discover {MOCK_COURSES.length} premium courses from expert creators
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border-border pl-10"
              data-ocid="courses.search.input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="courses.filter.tab"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="courses.empty_state"
          >
            <p className="text-lg">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <CourseCard
                  course={course}
                  index={i + 1}
                  onClick={onCourseClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
