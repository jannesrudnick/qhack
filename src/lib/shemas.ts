import { z } from 'zod';

const basicString = z.string().min(3).max(255);
const longString = z.string().min(3).max(1000);

export const customerPropertyShema = z.object({
  id: z.string().uuid(),
  // Step 1
  customer_legal_name: basicString,
  customer_adress: basicString,
  customer_postcal_code: z.string().length(5),
  customer_city: basicString,
  customer_phone_number: z.string().min(7).max(20),
  // Step 2
  property_type: basicString,
  address: basicString,
  postal_code: z.string().length(5),
  city: basicString,
  living_space: z.number().min(1),
  year_of_construction: z.number().min(1400, { message: 'das ist ganz schön alt' }).max(new Date().getFullYear()),
  number_of_floors: z.number().min(1).max(50),
  number_of_units: z.number().min(1).max(1000),
  apartment_rental_area: z.any(),
  apartment_location_in_building: z.any(),
  apartment_number: z.any(),
  basement_type: basicString,
  land_register_sheet_number: z.any().optional(),
  plot_number: z.any(),
  district: z.any(),
  land_registry_office: z.any(),
  // Step 3
  construction_type: basicString,
  ceiling_construction: basicString,
  window_frames: basicString,
  roof_shape: basicString,
  roof_covering: basicString,
  heating_type: basicString,
  hot_water_supply: basicString,
  // Step 4
  roof_renovation_age: basicString,
  facade_renovation_age: basicString,
  windows_doors_renovation_age: basicString,
  heating_renovation_age: basicString,
  pipes_renovation_age: basicString,
  bathrooms_renovation_age: basicString,
  floor_plan_changes: basicString,
  // Rest
  date_of_viewing: z.any(),
  viewed_by_name: z.any(),
  poa_city: z.any(),
  poa_date: z.any(),
});
