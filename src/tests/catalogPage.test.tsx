import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogPage } from "@/pages/CatalogPage";

test("shows catalog filters and a layer card", async () => {
  render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole("heading", { name: "مكتبة البيانات" }),
  ).toBeInTheDocument();
  expect(await screen.findByText("حدود الأحياء")).toBeInTheDocument();
});
