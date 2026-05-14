import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { RequireRole } from "@/features/auth/RequireRole";

test("redirects unauthenticated users away from admin content", async () => {
  const router = createMemoryRouter(
    [
      {
        path: "/admin",
        element: (
          <AuthProvider>
            <RequireRole allow={["admin"]}>
              <div>لوحة الإدارة</div>
            </RequireRole>
          </AuthProvider>
        ),
      },
      {
        path: "/login",
        element: <div>تسجيل الدخول</div>,
      },
    ],
    { initialEntries: ["/admin"] },
  );

  render(
    <RouterProvider router={router} />,
  );

  expect(await screen.findByText("تسجيل الدخول")).toBeInTheDocument();
  expect(screen.queryByText("لوحة الإدارة")).not.toBeInTheDocument();
});
