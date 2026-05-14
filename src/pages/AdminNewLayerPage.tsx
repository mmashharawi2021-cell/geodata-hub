import { AddLayerForm } from "@/features/admin/AddLayerForm";

export function AdminNewLayerPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">إضافة طبقة جديدة</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          أدخل بيانات الطبقة وارفع ملف GeoJSON أو CSV. يتم فحص الملف قبل أي
          محاولة حفظ.
        </p>
      </div>
      <AddLayerForm />
    </section>
  );
}
