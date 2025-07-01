// Datos de las wilayas (provincias) y dairas (distritos) de Argelia
export interface Daira {
  id: number;
  name: string;
}

export interface Wilaya {
  id: number;
  name: string;
  dairas: Daira[];
}

export const algeriaWilayas: Wilaya[] = [
  {
    id: 1,
    name: 'أدرار',
    dairas: [
      { id: 1, name: 'أدرار' },
      { id: 2, name: 'أولف' },
      { id: 3, name: 'رقان' },
      { id: 4, name: 'تيميمون' },
      { id: 5, name: 'تينركوك' },
      { id: 6, name: 'شروين' },
    ]
  },
  {
    id: 2,
    name: 'الشلف',
    dairas: [
      { id: 1, name: 'الشلف' },
      { id: 2, name: 'تنس' },
      { id: 3, name: 'واد الفضة' },
      { id: 4, name: 'أبو الحسن' },
      { id: 5, name: 'المرسى' },
    ]
  },
  {
    id: 3,
    name: 'الأغواط',
    dairas: [
      { id: 1, name: 'الأغواط' },
      { id: 2, name: 'آفلو' },
      { id: 3, name: 'قلتة سيدي سعد' },
      { id: 4, name: 'حاسي الرمل' },
    ]
  },
  {
    id: 4,
    name: 'أم البواقي',
    dairas: [
      { id: 1, name: 'أم البواقي' },
      { id: 2, name: 'عين البيضاء' },
      { id: 3, name: 'عين مليلة' },
      { id: 4, name: 'سوق نعمان' },
    ]
  },
  {
    id: 5,
    name: 'باتنة',
    dairas: [
      { id: 1, name: 'باتنة' },
      { id: 2, name: 'بريكة' },
      { id: 3, name: 'عين التوتة' },
      { id: 4, name: 'آريس' },
      { id: 5, name: 'نقاوس' },
    ]
  },
  {
    id: 6,
    name: 'بجاية',
    dairas: [
      { id: 1, name: 'بجاية' },
      { id: 2, name: 'أقبو' },
      { id: 3, name: 'صدوق' },
      { id: 4, name: 'تيشي' },
    ]
  },
  {
    id: 7,
    name: 'بسكرة',
    dairas: [
      { id: 1, name: 'بسكرة' },
      { id: 2, name: 'أولاد جلال' },
      { id: 3, name: 'سيدي عقبة' },
      { id: 4, name: 'طولقة' },
    ]
  },
  {
    id: 8,
    name: 'بشار',
    dairas: [
      { id: 1, name: 'بشار' },
      { id: 2, name: 'العبادلة' },
      { id: 3, name: 'بني ونيف' },
      { id: 4, name: 'تاغيت' },
    ]
  },
  {
    id: 9,
    name: 'البليدة',
    dairas: [
      { id: 1, name: 'البليدة' },
      { id: 2, name: 'بوفاريك' },
      { id: 3, name: 'موزاية' },
      { id: 4, name: 'الأربعاء' },
    ]
  },
  {
    id: 10,
    name: 'البويرة',
    dairas: [
      { id: 1, name: 'البويرة' },
      { id: 2, name: 'عين بسام' },
      { id: 3, name: 'سور الغزلان' },
      { id: 4, name: 'مشدالله' },
    ]
  },
  // Agregamos más wilayas hasta completar las 58
  {
    id: 11,
    name: 'تمنراست',
    dairas: [
      { id: 1, name: 'تمنراست' },
      { id: 2, name: 'عين صالح' },
      { id: 3, name: 'عين قزام' },
    ]
  },
  {
    id: 12,
    name: 'تبسة',
    dairas: [
      { id: 1, name: 'تبسة' },
      { id: 2, name: 'الشريعة' },
      { id: 3, name: 'بئر العاتر' },
      { id: 4, name: 'الونزة' },
    ]
  },
  {
    id: 13,
    name: 'تلمسان',
    dairas: [
      { id: 1, name: 'تلمسان' },
      { id: 2, name: 'مغنية' },
      { id: 3, name: 'الرمشي' },
      { id: 4, name: 'سبدو' },
    ]
  },
  {
    id: 14,
    name: 'تيارت',
    dairas: [
      { id: 1, name: 'تيارت' },
      { id: 2, name: 'فرندة' },
      { id: 3, name: 'عين الذهب' },
      { id: 4, name: 'قصر الشلالة' },
    ]
  },
  {
    id: 15,
    name: 'تيزي وزو',
    dairas: [
      { id: 1, name: 'تيزي وزو' },
      { id: 2, name: 'عزازقة' },
      { id: 3, name: 'عين الحمام' },
      { id: 4, name: 'بوغني' },
    ]
  },
  // Continuamos con más wilayas
  {
    id: 16,
    name: 'الجزائر',
    dairas: [
      { id: 1, name: 'باب الوادي' },
      { id: 2, name: 'الحراش' },
      { id: 3, name: 'بئر مراد رايس' },
      { id: 4, name: 'حسين داي' },
      { id: 5, name: 'براقي' },
      { id: 6, name: 'الدار البيضاء' },
    ]
  },
  // Agregamos las wilayas restantes de manera similar
  {
    id: 17,
    name: 'الجلفة',
    dairas: [
      { id: 1, name: 'الجلفة' },
      { id: 2, name: 'مسعد' },
      { id: 3, name: 'حاسي بحبح' },
      { id: 4, name: 'عين وسارة' },
    ]
  },
  {
    id: 18,
    name: 'جيجل',
    dairas: [
      { id: 1, name: 'جيجل' },
      { id: 2, name: 'الميلية' },
      { id: 3, name: 'الطاهير' },
      { id: 4, name: 'زيامة منصورية' },
    ]
  },
  {
    id: 19,
    name: 'سطيف',
    dairas: [
      { id: 1, name: 'سطيف' },
      { id: 2, name: 'العلمة' },
      { id: 3, name: 'عين ولمان' },
      { id: 4, name: 'بوقاعة' },
    ]
  },
  {
    id: 20,
    name: 'سعيدة',
    dairas: [
      { id: 1, name: 'سعيدة' },
      { id: 2, name: 'الحساسنة' },
      { id: 3, name: 'سيدي بوبكر' },
      { id: 4, name: 'يوب' },
    ]
  },
  // Continuamos con más wilayas hasta completar las 58
  {
    id: 21,
    name: 'سكيكدة',
    dairas: [
      { id: 1, name: 'سكيكدة' },
      { id: 2, name: 'القل' },
      { id: 3, name: 'عزابة' },
      { id: 4, name: 'تمالوس' },
    ]
  },
  {
    id: 22,
    name: 'سيدي بلعباس',
    dairas: [
      { id: 1, name: 'سيدي بلعباس' },
      { id: 2, name: 'تلاغ' },
      { id: 3, name: 'سفيزف' },
      { id: 4, name: 'مرحوم' },
    ]
  },
  {
    id: 23,
    name: 'عنابة',
    dairas: [
      { id: 1, name: 'عنابة' },
      { id: 2, name: 'برحال' },
      { id: 3, name: 'الحجار' },
      { id: 4, name: 'عين الباردة' },
    ]
  },
  {
    id: 24,
    name: 'قالمة',
    dairas: [
      { id: 1, name: 'قالمة' },
      { id: 2, name: 'واد الزناتي' },
      { id: 3, name: 'بوشقوف' },
      { id: 4, name: 'سوق أهراس' },
    ]
  },
  {
    id: 25,
    name: 'قسنطينة',
    dairas: [
      { id: 1, name: 'قسنطينة' },
      { id: 2, name: 'الخروب' },
      { id: 3, name: 'حامة بوزيان' },
      { id: 4, name: 'زيغود يوسف' },
    ]
  },
  // Continuamos con el resto de wilayas
  {
    id: 26,
    name: 'المدية',
    dairas: [
      { id: 1, name: 'المدية' },
      { id: 2, name: 'قصر البخاري' },
      { id: 3, name: 'عين بوسيف' },
      { id: 4, name: 'البرواقية' },
    ]
  },
  {
    id: 27,
    name: 'مستغانم',
    dairas: [
      { id: 1, name: 'مستغانم' },
      { id: 2, name: 'عين تادلس' },
      { id: 3, name: 'عشعاشة' },
      { id: 4, name: 'سيدي علي' },
    ]
  },
  {
    id: 28,
    name: 'المسيلة',
    dairas: [
      { id: 1, name: 'المسيلة' },
      { id: 2, name: 'بوسعادة' },
      { id: 3, name: 'سيدي عيسى' },
      { id: 4, name: 'عين الملح' },
    ]
  },
  {
    id: 29,
    name: 'معسكر',
    dairas: [
      { id: 1, name: 'معسكر' },
      { id: 2, name: 'سيق' },
      { id: 3, name: 'تيغنيف' },
      { id: 4, name: 'المحمدية' },
    ]
  },
  {
    id: 30,
    name: 'ورقلة',
    dairas: [
      { id: 1, name: 'ورقلة' },
      { id: 2, name: 'حاسي مسعود' },
      { id: 3, name: 'تقرت' },
      { id: 4, name: 'الطيبات' },
    ]
  },
  // Continuamos con el resto de wilayas
  {
    id: 31,
    name: 'وهران',
    dairas: [
      { id: 1, name: 'وهران' },
      { id: 2, name: 'عين الترك' },
      { id: 3, name: 'السانية' },
      { id: 4, name: 'أرزيو' },
      { id: 5, name: 'بطيوة' },
    ]
  },
  // Agregamos las wilayas restantes
  {
    id: 32,
    name: 'البيض',
    dairas: [
      { id: 1, name: 'البيض' },
      { id: 2, name: 'بريزينة' },
      { id: 3, name: 'الأبيض سيد الشيخ' },
      { id: 4, name: 'بوعلام' },
    ]
  },
  {
    id: 33,
    name: 'إليزي',
    dairas: [
      { id: 1, name: 'إليزي' },
      { id: 2, name: 'جانت' },
      { id: 3, name: 'دبداب' },
      { id: 4, name: 'برج عمر إدريس' },
    ]
  },
  {
    id: 34,
    name: 'برج بوعريريج',
    dairas: [
      { id: 1, name: 'برج بوعريريج' },
      { id: 2, name: 'رأس الوادي' },
      { id: 3, name: 'برج الغدير' },
      { id: 4, name: 'المنصورة' },
    ]
  },
  {
    id: 35,
    name: 'بومرداس',
    dairas: [
      { id: 1, name: 'بومرداس' },
      { id: 2, name: 'برج منايل' },
      { id: 3, name: 'دلس' },
      { id: 4, name: 'بودواو' },
    ]
  },
  // Continuamos con más wilayas
  {
    id: 36,
    name: 'الطارف',
    dairas: [
      { id: 1, name: 'الطارف' },
      { id: 2, name: 'بن مهيدي' },
      { id: 3, name: 'القالة' },
      { id: 4, name: 'بوحجار' },
    ]
  },
  {
    id: 37,
    name: 'تندوف',
    dairas: [
      { id: 1, name: 'تندوف' },
      { id: 2, name: 'أم العسل' },
    ]
  },
  {
    id: 38,
    name: 'تيسمسيلت',
    dairas: [
      { id: 1, name: 'تيسمسيلت' },
      { id: 2, name: 'ثنية الحد' },
      { id: 3, name: 'برج بونعامة' },
      { id: 4, name: 'عماري' },
    ]
  },
  {
    id: 39,
    name: 'الوادي',
    dairas: [
      { id: 1, name: 'الوادي' },
      { id: 2, name: 'المغير' },
      { id: 3, name: 'جامعة' },
      { id: 4, name: 'الرباح' },
    ]
  },
  {
    id: 40,
    name: 'خنشلة',
    dairas: [
      { id: 1, name: 'خنشلة' },
      { id: 2, name: 'قايس' },
      { id: 3, name: 'أولاد رشاش' },
      { id: 4, name: 'بوحمامة' },
    ]
  },
  // Continuamos con más wilayas
  {
    id: 41,
    name: 'سوق أهراس',
    dairas: [
      { id: 1, name: 'سوق أهراس' },
      { id: 2, name: 'سدراتة' },
      { id: 3, name: 'مداوروش' },
      { id: 4, name: 'تاورة' },
    ]
  },
  {
    id: 42,
    name: 'تيبازة',
    dairas: [
      { id: 1, name: 'تيبازة' },
      { id: 2, name: 'شرشال' },
      { id: 3, name: 'القليعة' },
      { id: 4, name: 'حجوط' },
    ]
  },
  {
    id: 43,
    name: 'ميلة',
    dairas: [
      { id: 1, name: 'ميلة' },
      { id: 2, name: 'فرجيوة' },
      { id: 3, name: 'شلغوم العيد' },
      { id: 4, name: 'واد العثمانية' },
    ]
  },
  {
    id: 44,
    name: 'عين الدفلى',
    dairas: [
      { id: 1, name: 'عين الدفلى' },
      { id: 2, name: 'خميس مليانة' },
      { id: 3, name: 'مليانة' },
      { id: 4, name: 'العطاف' },
    ]
  },
  {
    id: 45,
    name: 'النعامة',
    dairas: [
      { id: 1, name: 'النعامة' },
      { id: 2, name: 'عين الصفراء' },
      { id: 3, name: 'مشرية' },
      { id: 4, name: 'مغرار' },
    ]
  },
  // Continuamos con más wilayas
  {
    id: 46,
    name: 'عين تموشنت',
    dairas: [
      { id: 1, name: 'عين تموشنت' },
      { id: 2, name: 'حمام بوحجر' },
      { id: 3, name: 'العامرية' },
      { id: 4, name: 'بني صاف' },
    ]
  },
  {
    id: 47,
    name: 'غرداية',
    dairas: [
      { id: 1, name: 'غرداية' },
      { id: 2, name: 'المنيعة' },
      { id: 3, name: 'بريان' },
      { id: 4, name: 'متليلي' },
    ]
  },
  {
    id: 48,
    name: 'غليزان',
    dairas: [
      { id: 1, name: 'غليزان' },
      { id: 2, name: 'وادي رهيو' },
      { id: 3, name: 'مازونة' },
      { id: 4, name: 'عين طارق' },
    ]
  },
  // Las nuevas wilayas creadas en 2019
  {
    id: 49,
    name: 'تيميمون',
    dairas: [
      { id: 1, name: 'تيميمون' },
      { id: 2, name: 'أولاد سعيد' },
      { id: 3, name: 'شروين' },
    ]
  },
  {
    id: 50,
    name: 'برج باجي مختار',
    dairas: [
      { id: 1, name: 'برج باجي مختار' },
      { id: 2, name: 'تيمياوين' },
    ]
  },
  {
    id: 51,
    name: 'أولاد جلال',
    dairas: [
      { id: 1, name: 'أولاد جلال' },
      { id: 2, name: 'سيدي خالد' },
    ]
  },
  {
    id: 52,
    name: 'بني عباس',
    dairas: [
      { id: 1, name: 'بني عباس' },
      { id: 2, name: 'كرزاز' },
      { id: 3, name: 'إقلي' },
    ]
  },
  {
    id: 53,
    name: 'عين صالح',
    dairas: [
      { id: 1, name: 'عين صالح' },
      { id: 2, name: 'فقارة الزوى' },
    ]
  },
  {
    id: 54,
    name: 'عين قزام',
    dairas: [
      { id: 1, name: 'عين قزام' },
      { id: 2, name: 'تين زواتين' },
    ]
  },
  {
    id: 55,
    name: 'تقرت',
    dairas: [
      { id: 1, name: 'تقرت' },
      { id: 2, name: 'تماسين' },
      { id: 3, name: 'الطيبات' },
    ]
  },
  {
    id: 56,
    name: 'جانت',
    dairas: [
      { id: 1, name: 'جانت' },
      { id: 2, name: 'برج الحواس' },
    ]
  },
  {
    id: 57,
    name: 'المغير',
    dairas: [
      { id: 1, name: 'المغير' },
      { id: 2, name: 'جامعة' },
    ]
  },
  {
    id: 58,
    name: 'المنيعة',
    dairas: [
      { id: 1, name: 'المنيعة' },
      { id: 2, name: 'حاسي الفحل' },
    ]
  }
];

// Función para obtener las dairas de una wilaya
export const getDairasByWilaya = (wilayaId: number): Daira[] => {
  const wilaya = algeriaWilayas.find(w => w.id === wilayaId);
  return wilaya ? wilaya.dairas : [];
};
