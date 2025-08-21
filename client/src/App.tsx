import { WorkoutsPage, HomePage, WorkoutDetailPage, WorkoutEditPage } from '@/pages';
import { Banner } from '@/components';
import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("");

  useEffect(() => {
    setPage(window.location.pathname);
  }, []);

  const routes = [
    { pattern: /^\/workouts\/[^/]+\/edit$/, component: <WorkoutEditPage /> },
    { pattern: /^\/workouts\/[^/]+$/, component: <WorkoutDetailPage /> },
    { pattern: /^\/workouts$/, component: <WorkoutsPage /> },
    { pattern: /.*/, component: <HomePage /> },
  ];


  const getBestMatch = (path: string) => {
    for (const { pattern, component } of routes) {
      if (pattern.test(path)) return component;
    }
  };

  return (
    <Banner name="test" navigation={[
      { href: "/", label: "Home" },
      { href: "/workouts", label: "Workouts" }
    ]}>
      {
        getBestMatch(page)
      }
    </Banner>
  )
}
