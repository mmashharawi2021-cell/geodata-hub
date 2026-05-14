import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

test("renders the GeoData Hub hero section", () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: /GeoData Hub/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "استكشاف البيانات" }),
  ).toBeInTheDocument();
});
