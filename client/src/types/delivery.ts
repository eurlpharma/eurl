
export interface GuepexParcel {
  tracking: string;
  order_id: string;
  firstname: string;
  familyname: string;
  contact_phone: string;
  address: string;
  stopdesk_id: number | null;
  stopdesk_name: string | null;
  from_wilaya_id: number;
  from_wilaya_name: string;
  to_commune_name: string;
  to_wilaya_id: number;
  to_wilaya_name: string;
  product_list: string;
  price: number;
  do_insurance: number;
  declared_value: number;
  length: number | null;
  height: number | null;
  width: number | null;
  weight: number | null;
  delivery_fee: number;
  freeshipping: number;
  import_id: number;
  date_creation: string; // ISO date string
  date_expedition: string; // ISO date string
  date_last_status: string; // ISO date string
  last_status: string;
  taxe_percentage: number;
  taxe_from: number;
  taxe_retour: number;
  parcel_type: "ecommerce" | string;
  parcel_sub_type: "eco" | string;
  has_receipt: boolean | null;
  has_recouvrement: number;
  return_center_code: string;
  current_center_id: number;
  current_center_name: string;
  current_wilaya_id: number;
  current_wilaya_name: string;
  current_commune_id: number;
  current_commune_name: string;
  payment_status: "payed" | "not_payed" | string;
  payment_id: string;
  has_exchange: number;
  product_to_collect: string | null;
  economic: number;
  label: string; // PDF link
  pin: string;
  qr_text: string;
}

export interface GuepexParcelRes {
  message: string | null,
  data: GuepexParcel[],
  has_more: number,
  total_data: number,
  links?: {
    self: string | null
  }

}
