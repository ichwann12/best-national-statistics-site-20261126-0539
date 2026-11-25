// NusaStat data: rounded approximations compiled from Badan Pusat Statistik (BPS)
// publications, 2019-2024. Figures are deliberately rounded (no fake decimals) and
// every view states its source and year next to the number.
window.NUSA = {
  meta: {
    country: 'Indonesia',
    updated: 'November 2026',
    source: 'Badan Pusat Statistik (BPS), 2019–2024 (rounded approximations)',
  },

  // Headline indicators shown on the overview dashboard.
  kpis: [
    { label: 'Population', value: '283.5 m', note: 'Mid-year estimate, 2024', change: '+0.9% on 2023', route: '#/population' },
    { label: 'GDP', value: 'Rp 22,139 tn', note: 'Current prices, 2024', change: '≈ US$ 1.4 trillion', route: '#/economy' },
    { label: 'GDP growth', value: '5.03%', note: 'Real GDP growth, 2024', change: '5.05% in 2023', route: '#/economy' },
    { label: 'Inflation', value: '1.57%', note: 'Year on year, Dec 2024', change: '2.61% in Dec 2023', route: '#/economy' },
    { label: 'Unemployment', value: '4.91%', note: 'Open unemployment, Aug 2024', change: '5.32% in Aug 2023', route: '#/economy' },
    { label: 'Poverty rate', value: '8.57%', note: 'Share of population, Sep 2024', change: '9.36% in Sep 2023', route: '#/population' },
    { label: 'Life expectancy', value: '74.2 yrs', note: 'At birth, 2024', change: '73.9 yrs in 2023', route: '#/education-health' },
    { label: 'Human Development Index', value: '75.02', note: 'HDI score, 2024', change: '74.39 in 2023', route: '#/education-health' },
  ],

  // Annual series used by the charts. Values are rounded approximations.
  series: {
    gdpGrowth: {
      title: 'Real GDP growth, % per year',
      unit: '%',
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
      source: 'BPS, National Accounts 2015–2024',
    },
    population: {
      title: 'Total population, millions',
      unit: 'million people',
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 283.5],
      source: 'BPS, Population Census 2020 and mid-year projections',
    },
    inflation: {
      title: 'Consumer price inflation, % year on year',
      unit: '%',
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
      source: 'BPS, Consumer Price Index, December of each year',
    },
    unemployment: {
      title: 'Open unemployment rate, %',
      unit: '%',
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
      source: 'BPS, National Labour Force Survey (Sakernas), August of each year',
    },
    ageStructure: {
      title: 'Population by broad age group, 2024 (%)',
      unit: '% of population',
      labels: ['0–14 years', '15–64 years', '65+ years'],
      values: [24.0, 68.7, 7.3],
      source: 'BPS, population projection 2024',
    },
    urbanRural: {
      title: 'Where Indonesians live, 2024 (%)',
      unit: '% of population',
      labels: ['Urban', 'Rural'],
      values: [58.6, 41.4],
      source: 'BPS, population projection 2024',
    },
  },

  // Demographic facts for the population page.
  demographics: [
    { label: 'Median age', value: '≈ 30 years', detail: 'Half the population is younger than 30 — one of the youngest large populations in Asia.', source: 'BPS, 2024' },
    { label: 'Sex ratio', value: '≈ 102 men per 100 women', detail: 'Slightly more men than women in the 2024 estimate.', source: 'BPS, 2024' },
    { label: 'Population density', value: '≈ 148 people / km²', detail: 'National average. Java is far denser: about 1,100 people / km², while Papua averages under 15.', source: 'BPS, 2024' },
    { label: 'Births per year', value: '≈ 4.4 million', detail: 'Crude birth rate around 16 per 1,000 people.', source: 'BPS, 2024' },
    { label: 'Households', value: '≈ 74 million', detail: 'Average household size about 3.8 people.', source: 'BPS, 2024' },
    { label: 'Working-age share', value: '≈ 69%', detail: 'People aged 15–64. The demographic dividend window runs through the 2030s.', source: 'BPS, 2024' },
  ],

  // Economy facts and the sector mix.
  economy: [
    { label: 'GDP per capita', value: '≈ Rp 78.6 million', detail: 'About US$ 4,960 at the 2024 average exchange rate.', source: 'BPS, 2024' },
    { label: 'Largest sector', value: 'Manufacturing ≈ 19%', detail: 'Share of GDP, followed by trade (≈ 13%) and agriculture (≈ 12%).', source: 'BPS, 2024' },
    { label: 'Exports 2024', value: '≈ US$ 265 billion', detail: 'Coal, palm oil, nickel products and electronics lead exports.', source: 'BPS, 2024' },
    { label: 'Government debt', value: '≈ 39% of GDP', detail: 'Central government debt ratio, end-2024 — low by global standards.', source: 'Ministry of Finance, 2024' },
    { label: 'Labour force', value: '≈ 152 million', detail: 'People working or looking for work, August 2024.', source: 'BPS Sakernas, Aug 2024' },
    { label: 'Informal work', value: '≈ 59% of workers', detail: 'Share of employed people in informal jobs, August 2024.', source: 'BPS Sakernas, Aug 2024' },
  ],
  gdpSectors: [
    { label: 'Manufacturing', value: 18.9 },
    { label: 'Wholesale & retail trade', value: 12.9 },
    { label: 'Agriculture & fishing', value: 12.5 },
    { label: 'Construction', value: 9.9 },
    { label: 'Mining & quarrying', value: 9.6 },
    { label: 'Transport & storage', value: 5.5 },
    { label: 'Information & communication', value: 4.0 },
    { label: 'Other services', value: 26.7 },
  ],

  // All 38 provinces: population (millions, approx 2024), area (km²), capital.
  provinces: [
    { name: 'Jawa Barat', pop: 49.9, area: 35378, capital: 'Bandung' },
    { name: 'Jawa Timur', pop: 41.8, area: 47803, capital: 'Surabaya' },
    { name: 'Jawa Tengah', pop: 37.9, area: 32801, capital: 'Semarang' },
    { name: 'Sumatera Utara', pop: 15.6, area: 72981, capital: 'Medan' },
    { name: 'Banten', pop: 12.4, area: 9663, capital: 'Serang' },
    { name: 'DKI Jakarta', pop: 10.6, area: 664, capital: 'Jakarta' },
    { name: 'Sulawesi Selatan', pop: 9.4, area: 46717, capital: 'Makassar' },
    { name: 'Lampung', pop: 9.3, area: 34624, capital: 'Bandar Lampung' },
    { name: 'Sumatera Selatan', pop: 9.0, area: 91592, capital: 'Palembang' },
    { name: 'Riau', pop: 6.9, area: 87024, capital: 'Pekanbaru' },
    { name: 'Sumatera Barat', pop: 6.0, area: 42013, capital: 'Padang' },
    { name: 'Kalimantan Barat', pop: 5.8, area: 147307, capital: 'Pontianak' },
    { name: 'Nusa Tenggara Timur', pop: 5.7, area: 48718, capital: 'Kupang' },
    { name: 'Aceh', pop: 5.6, area: 57956, capital: 'Banda Aceh' },
    { name: 'Nusa Tenggara Barat', pop: 5.6, area: 18572, capital: 'Mataram' },
    { name: 'Bali', pop: 4.4, area: 5780, capital: 'Denpasar' },
    { name: 'Kalimantan Selatan', pop: 4.3, area: 38744, capital: 'Banjarmasin' },
    { name: 'Kalimantan Timur', pop: 4.0, area: 127347, capital: 'Samarinda' },
    { name: 'DI Yogyakarta', pop: 3.8, area: 3133, capital: 'Yogyakarta' },
    { name: 'Jambi', pop: 3.7, area: 50058, capital: 'Jambi' },
    { name: 'Sulawesi Tengah', pop: 3.1, area: 61841, capital: 'Palu' },
    { name: 'Kalimantan Tengah', pop: 2.8, area: 153564, capital: 'Palangka Raya' },
    { name: 'Sulawesi Tenggara', pop: 2.8, area: 38140, capital: 'Kendari' },
    { name: 'Sulawesi Utara', pop: 2.7, area: 13892, capital: 'Manado' },
    { name: 'Kepulauan Riau', pop: 2.2, area: 8202, capital: 'Tanjung Pinang' },
    { name: 'Bengkulu', pop: 2.1, area: 19919, capital: 'Bengkulu' },
    { name: 'Maluku', pop: 2.0, area: 46158, capital: 'Ambon' },
    { name: 'Sulawesi Barat', pop: 1.6, area: 16787, capital: 'Mamuju' },
    { name: 'Kepulauan Bangka Belitung', pop: 1.5, area: 16424, capital: 'Pangkal Pinang' },
    { name: 'Papua Pegunungan', pop: 1.5, area: 51213, capital: 'Wamena' },
    { name: 'Maluku Utara', pop: 1.4, area: 31983, capital: 'Sofifi' },
    { name: 'Papua Tengah', pop: 1.4, area: 61073, capital: 'Nabire' },
    { name: 'Gorontalo', pop: 1.2, area: 11257, capital: 'Gorontalo' },
    { name: 'Papua', pop: 1.1, area: 82680, capital: 'Jayapura' },
    { name: 'Kalimantan Utara', pop: 0.7, area: 75467, capital: 'Tanjung Selor' },
    { name: 'Papua Barat', pop: 0.6, area: 64134, capital: 'Manokwari' },
    { name: 'Papua Barat Daya', pop: 0.6, area: 38021, capital: 'Sorong' },
    { name: 'Papua Selatan', pop: 0.6, area: 117849, capital: 'Merauke' },
  ],

  // Education and health indicators.
  education: [
    { label: 'Literacy rate (15+)', value: '≈ 96.5%', detail: 'Share of people aged 15 and over who can read and write.', source: 'BPS, 2024' },
    { label: 'Mean years of schooling', value: '≈ 9.0 years', detail: 'Average schooling completed by people aged 25 and over.', source: 'BPS, 2024' },
    { label: 'Expected years of schooling', value: '≈ 13.2 years', detail: 'Schooling a child entering school today can expect to receive.', source: 'BPS, 2024' },
    { label: 'Primary net enrolment', value: '≈ 98%', detail: 'Children of primary-school age enrolled in primary school.', source: 'BPS, 2024' },
    { label: 'Junior secondary net enrolment', value: '≈ 82%', detail: 'Children of junior-secondary age enrolled at that level.', source: 'BPS, 2024' },
    { label: 'Universities & colleges', value: '≈ 4,500', detail: 'Higher-education institutions across the country, 2024.', source: 'Ministry of Higher Education, 2024' },
  ],
  health: [
    { label: 'Life expectancy', value: '74.2 years', detail: 'At birth, 2024 — up from about 71 years a decade earlier.', source: 'BPS, 2024' },
    { label: 'Infant mortality', value: '≈ 16 per 1,000', detail: 'Deaths under age one per 1,000 live births.', source: 'BPS, 2023' },
    { label: 'Stunting (under 5)', value: '19.8%', detail: 'Share of children under five who are stunted, 2024 — down from 24.4% in 2021.', source: 'Ministry of Health, 2024' },
    { label: 'Hospitals', value: '≈ 3,100', detail: 'Public and private hospitals nationwide.', source: 'Ministry of Health, 2024' },
    { label: 'Community health centres', value: '≈ 10,400', detail: 'Puskesmas — the front line of primary care.', source: 'Ministry of Health, 2024' },
    { label: 'Health spending', value: '≈ 3% of GDP', detail: 'Total (public and private) health expenditure, approximate.', source: 'WHO / BPS, 2023' },
  ],
  literacyByYear: {
    title: 'Literacy rate, age 15+ (%)',
    unit: '%',
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    values: [95.7, 96.0, 96.0, 96.1, 96.3, 96.5],
    source: 'BPS, 2019–2024',
  },
};
