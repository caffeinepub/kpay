import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { MockCourse } from "../data/courses";

interface CourseCardProps {
  course: MockCourse;
  index: number;
  onClick: (course: MockCourse) => void;
}

export function CourseCard({ course, index, onClick }: CourseCardProps) {
  return (
    <article
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
      data-ocid={`courses.item.${index}`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-secondary/80 text-foreground border-border backdrop-blur-sm text-xs">
            {course.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {course.instructor}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= Math.floor(course.rating)
                  ? "fill-[oklch(0.83_0.165_82)] text-[oklch(0.83_0.165_82)]"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {course.rating}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-foreground">
            ${course.price}
          </span>
          <Button
            size="sm"
            onClick={() => onClick(course)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs px-4"
            data-ocid={`courses.view.button.${index}`}
          >
            View Course
          </Button>
        </div>
      </div>
    </article>
  );
}
