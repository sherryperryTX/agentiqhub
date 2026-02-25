"use client";
import { useParams } from "next/navigation";
import CourseApp from "@/components/CourseApp";

export default function CourseLearn() {
  const params = useParams();
  const slug = params.slug as string;

  return <CourseApp courseSlug={slug} />;
}
