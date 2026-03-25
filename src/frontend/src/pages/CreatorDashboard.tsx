import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, DollarSign, Edit, Eye, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { AuthUser } from "../App";
import { MOCK_COURSES } from "../data/courses";

interface CreatorDashboardProps {
  user: AuthUser;
}

export function CreatorDashboard({ user }: CreatorDashboardProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Film");
  const [newPrice, setNewPrice] = useState("");
  const [newThumb, setNewThumb] = useState("");

  const creatorCourses = MOCK_COURSES.slice(0, 3);
  const totalRevenue = creatorCourses.reduce((acc, c) => acc + c.price * 24, 0);
  const totalEnrollments = creatorCourses.length * 24;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUpload(false);
    setNewTitle("");
    setNewDesc("");
    setNewPrice("");
    setNewThumb("");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.name}! 👋
            </p>
          </div>
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="creator.upload.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-2" /> New Course
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-card border-border max-w-lg"
              data-ocid="creator.upload.modal"
            >
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Create New Course
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">
                    Course Title
                  </Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Advanced Photography"
                    className="bg-muted border-border"
                    data-ocid="creator.course_title.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">
                    Description
                  </Label>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What will students learn?"
                    className="bg-muted border-border resize-none"
                    rows={3}
                    data-ocid="creator.course_desc.textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">
                      Category
                    </Label>
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger
                        className="bg-muted border-border"
                        data-ocid="creator.category.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Film">Film</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">
                      Price (USD)
                    </Label>
                    <Input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="99"
                      className="bg-muted border-border"
                      data-ocid="creator.course_price.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">
                    Thumbnail URL
                  </Label>
                  <Input
                    value={newThumb}
                    onChange={(e) => setNewThumb(e.target.value)}
                    placeholder="https://..."
                    className="bg-muted border-border"
                    data-ocid="creator.thumbnail.input"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="creator.create.submit_button"
                  >
                    Create Course
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border"
                    onClick={() => setShowUpload(false)}
                    data-ocid="creator.upload.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Courses",
              value: creatorCourses.length,
              icon: BookOpen,
              color: "text-primary",
            },
            {
              label: "Total Enrollments",
              value: totalEnrollments,
              icon: Users,
              color: "text-accent",
            },
            {
              label: "Total Revenue",
              value: `$${totalRevenue.toLocaleString()}`,
              icon: DollarSign,
              color: "text-[oklch(0.7_0.15_160)]",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5"
              data-ocid="creator.stats.card"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* My Courses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {creatorCourses.map((course, i) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-4"
                  data-ocid={`creator.course.item.${i + 1}`}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge className="bg-secondary text-muted-foreground border-border text-xs">
                        {course.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {24 * (i + 1)} students
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      data-ocid={`creator.course.edit_button.${i + 1}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      data-ocid={`creator.course.view_button.${i + 1}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
