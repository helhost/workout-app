import { WorkoutsPage, HomePage } from '@/pages';
import { Banner } from '@/components';
import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("");

  useEffect(() => {
    setPage(window.location.pathname);
  }, []);

  const pages = new Map([
    ["/", <HomePage />],
    ["/workouts", <WorkoutsPage />]
  ]);

  return (

    <Banner name="test" navigation={[
      { href: "/", label: "Home" },
      { href: "/workouts", label: "Workouts" }
    ]}>
      {
        pages.get(page) ?? <HomePage />
      }
    </Banner>
  )
}
