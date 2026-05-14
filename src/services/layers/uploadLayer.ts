import { supabase } from "@/lib/supabase/client";
import { parseCsvLayerFile } from "@/services/layers/parseCsvLayer";
import { parseGeoJsonFile } from "@/services/layers/parseGeoJson";
import type { UploadLayerPayload } from "@/services/layers/uploadTypes";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function parseLayerUploadFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("حجم الملف يتجاوز الحد المسموح للنسخة الأولى.");
  }

  if (file.name.toLowerCase().endsWith(".csv")) {
    return parseCsvLayerFile(file);
  }

  return parseGeoJsonFile(file);
}

export async function uploadLayer(payload: UploadLayerPayload) {
  if (!supabase) {
    throw new Error("بيئة Supabase غير مضبوطة. يمكن فحص الملف محليًا فقط.");
  }

  const parsed = await parseLayerUploadFile(payload.file);
  const sourceStoragePath = `layers/source/${payload.slug}/${payload.file.name}`;
  const previewStoragePath = `layers/previews/${payload.slug}.geojson`;

  const sourceUpload = await supabase.storage
    .from("layer-assets")
    .upload(sourceStoragePath, payload.file, { upsert: false });

  if (sourceUpload.error) {
    throw sourceUpload.error;
  }

  const previewBlob = new Blob([JSON.stringify(parsed.preview)], {
    type: "application/geo+json",
  });

  const previewUpload = await supabase.storage
    .from("layer-assets")
    .upload(previewStoragePath, previewBlob, {
      contentType: "application/geo+json",
      upsert: true,
    });

  if (previewUpload.error) {
    throw previewUpload.error;
  }

  const layerInsert = await supabase
    .from("layers")
    .insert({
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      category_id: payload.categoryId,
      geometry_type: parsed.geometryType,
      source: payload.source,
      license: payload.license,
      crs: payload.crs,
      file_url: sourceStoragePath,
      preview_geojson_url: previewStoragePath,
      records_count: parsed.recordsCount,
      file_size: payload.file.size,
      status: payload.status,
      is_public: payload.isPublic,
      quality_summary: {
        ...parsed.qualitySummary,
        ...payload.qualitySummary,
      },
    })
    .select("id")
    .single();

  if (layerInsert.error) {
    throw layerInsert.error;
  }

  const activityInsert = await supabase.from("activity_logs").insert({
    action_type: "create_layer",
    target_type: "layer",
    target_id: layerInsert.data.id,
    target_name: payload.name,
    details: {
      geometryType: parsed.geometryType,
      sourceStoragePath,
      previewStoragePath,
    },
  });

  if (activityInsert.error) {
    throw activityInsert.error;
  }

  return layerInsert.data.id as string;
}
