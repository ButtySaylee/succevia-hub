-- ============================================================
-- Insert new scholarships from scholarships_v2.xlsx
-- Generated: auto (with manual review of uncertain entries)
-- ============================================================
-- 
-- DEDUPLICATION SUMMARY:
-- 3 DUPLICATES (skipped): Chevening, DAAD, Orange Knowledge Programme
-- 1 DUPLICATE (detected manually): Commonwealth Scholarship → "Commonwealth Master's Scholarships 2026"
-- 26 NEW scholarships to insert
-- ============================================================

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Fulbright Foreign Student Program', 'Coverage: Full tuition, living stipend, health insurance, airfare. Level: Masters / PhD. Field: Any subject. Eligible: 155+ countries. Apply through your country''s national Fulbright commission. Extremely competitive.', 'scholarship', 'U.S. Dept of State', 'United States', 'Varies by country', 'Bachelors, strong GPA; Eligible countries: 155+ countries', 'https://foreign.fulbrightonline.org', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Erasmus Mundus Joint Masters (EMJM)', 'Coverage: Tuition waived, ~€1,000/mo living, travel, health insurance. Level: Masters. Field: Various; specific per programme. Eligible: All countries globally. Study across 2–3 European countries. STEM, Law, Social Science options.', 'scholarship', 'European Commission', 'Europe (2+ countries)', 'Late 2025/early 2026 per programme', 'Bachelors, strong academics; Eligible countries: All countries globally', 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Mastercard Foundation Scholars Program', 'Coverage: Full tuition, accommodation, books, mentorship, career support. Level: Undergraduate / Masters. Field: All subjects (partner university). Eligible: Sub-Saharan Africa (priority: Nigeria, Kenya, Ghana). Apply through partner institution. Women, refugees encouraged.', 'scholarship', 'Mastercard Foundation', 'Africa, USA, Canada, UK, others', 'Varies per partner institution', 'Strong academics; financially disadvantaged preferred; Eligible countries: Sub-Saharan Africa', 'https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Swiss Government Excellence Scholarships', 'Coverage: CHF 1,920/mo, tuition waived, health insurance, housing, airfare. Level: Masters / PhD / Postdoc. Field: Research-oriented subjects. Eligible: Selected countries (bilateral agreements). Apply through Swiss embassy in your country. Very selective.', 'scholarship', 'Swiss Confederation', 'Switzerland', 'Country-specific (Nov–Feb)', 'Masters/PhD level record; Eligible countries: Selected countries (bilateral agreements)', 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Knight-Hennessy Scholars (Stanford)', 'Coverage: Full tuition, living stipend, travel, books, health insurance. Level: Any Stanford graduate programme. Field: All fields. Eligible: All nationalities. Top 10% academic record; leadership demonstrated. 2% acceptance rate.', 'scholarship', 'Stanford University / Phil Knight & Penny Knight', 'United States (Stanford)', '~Oct annually', 'Top 10% academic record; Eligible countries: All nationalities', 'https://knight-hennessy.stanford.edu/admission', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('MTN Foundation Science & Technology Scholarship', 'Coverage: Tuition, stipend, book allowance, laptop. Level: Undergraduate (300 level). Field: STEM-related courses. Eligible: Nigeria. TETFUND partnership; women encouraged to apply.', 'scholarship', 'MTN Nigeria Foundation', 'Nigeria', 'Expected June–July 2026', 'Full-time 300-level student in STEM; Eligible countries: Nigeria', 'https://www.mtnfoundation.com.ng', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('NNPC/SNEPCo National University Scholarship', 'Coverage: Tuition, accommodation, laptop, book grant, living stipend. Level: Undergraduate. Field: All courses. Eligible: Nigeria. Covers 100+ students annually. Strong merit-based.', 'scholarship', 'NNPC / Shell Nigeria (SNEPCo)', 'Nigeria', 'Expected July–August 2026', 'Full-time Nigerian undergraduates; Eligible countries: Nigeria', 'https://www.shellinnigeria.com/scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Jim Ovia Foundation Scholarship', 'Coverage: Full tuition, laptop, stipend, mentorship. Level: Undergraduate. Field: All courses. Eligible: Nigeria. Must be in public university. Focus on financially disadvantaged students.', 'scholarship', 'Jim Ovia Foundation', 'Nigeria', 'Mid-year (check website)', 'Nigerian undergraduate in public university; Eligible countries: Nigeria', 'https://jimovia.org/scholarship/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('University of Manchester Global Futures Scholarship', 'Coverage: £2,000–£5,000 tuition reduction. Level: UG / Masters. Field: All subjects. Eligible: Nigeria. Separate scholarship tiers for UG and Masters. Apply via university portal.', 'scholarship', 'University of Manchester', 'United Kingdom', 'April 23, 2026 (Masters)', 'Nigerian national; Eligible countries: Nigeria', 'https://www.manchester.ac.uk/study/international/country-specific-information/nigeria/scholarships/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Ban Ki-moon Foundation Global Citizen Scholarship 2026', 'Coverage: Full participation, travel, accommodation. Level: All levels (young leaders). Field: Global affairs/leadership. Eligible: All countries; under 35 years. Conference + training format.', 'scholarship', 'Ban Ki-moon Foundation', 'Various (conference/programme)', 'Check current cycle', 'Under 35 years; Eligible countries: All countries', 'https://bankimoon.foundation/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('DSM-Firmenich Progress Foundation Scholarship (OYW 2026)', 'Coverage: Full ticket to One Young World Summit, travel, accommodation. Level: Young entrepreneurs (all levels). Field: Business / entrepreneurship. Eligible: Developing countries. Must have measurable social impact project.', 'scholarship', 'DSM-Firmenich', 'South Africa (Cape Town summit)', 'March 23, 2026', 'Young entrepreneurs 18–30; Eligible countries: Developing countries', 'https://www.oneyoungworld.com/scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('UCL Fully Funded PhD Studentships 2026/27', 'Coverage: Full tuition, London living stipend (~£20,000/yr). Level: PhD. Field: Various; check UCL faculty pages. Eligible: All nationalities. Competitive; based on research proposal excellence.', 'scholarship', 'University College London', 'United Kingdom', 'Rolling (check UCL website)', 'Masters degree, research proposal; Eligible countries: All nationalities', 'https://www.ucl.ac.uk/scholarships/doctoral-scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('University of Copenhagen PhD Positions 2026', 'Coverage: Salary-based (~€4,000–€5,000/mo gross). Level: PhD. Field: Various; check UCPH vacancies. Eligible: All nationalities. Employment-based PhD (3-year salaried position).', 'scholarship', 'University of Copenhagen (UCPH)', 'Denmark', 'Rolling; check UCPH vacancies portal', 'Masters degree; Eligible countries: All nationalities', 'https://employment.ku.dk/phd/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('MEXT Scholarship (Japan)', 'Coverage: Full tuition, monthly allowance (JPY 117K–145K), travel, housing. Level: UG / Masters / PhD / Research. Field: Most fields. Eligible: Countries with diplomatic relations with Japan. Embassy track and university track. Japanese language training included.', 'scholarship', 'Japanese Ministry of Education', 'Japan', 'Embassy: ~May–June; University: varies', 'Varies by track; Eligible countries: Countries with diplomatic relations with Japan', 'https://www.studyinjapan.go.jp/en/smap_stopj-applications_research.html', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Chinese Government Scholarship (CSC)', 'Coverage: Full tuition, accommodation, living allowance (CNY 3K–3.5K/mo), medical insurance. Level: UG / Masters / PhD. Field: All subjects. Eligible: All countries. Bilateral programme through Chinese embassies.', 'scholarship', 'China Scholarship Council', 'China', 'Late 2025/early 2026 for Autumn 2026', 'Varies by level; Eligible countries: All countries', 'https://www.campuschina.org', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Rhodes Scholarship (Oxford)', 'Coverage: Full tuition, living stipend (~£18K/yr), travel, visa, health. Level: Masters / DPhil (PhD). Field: Any full-time Oxford degree. Eligible: 20+ countries/jurisdictions. One of the oldest and most prestigious scholarships. Leadership, academic excellence, service.', 'scholarship', 'Rhodes Trust', 'United Kingdom (Oxford)', 'Country-specific; typically July–Aug', 'UG degree with strong academics; Eligible countries: 20+ countries/jurisdictions', 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Australia Awards Scholarships', 'Coverage: Full tuition, return airfare, establishment allowance, living stipend, health cover. Level: Masters / PhD. Field: Priority development areas. Eligible: Selected developing countries. Must return to home country for 2 years post-completion.', 'scholarship', 'Australian Govt (DFAT)', 'Australia', 'Varies by country (~April–June)', 'Citizens of eligible countries; Eligible countries: Selected developing countries', 'https://www.dfat.gov.au/people-to-people/australia-awards/pages/australia-awards-scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Türkiye Bursları (Turkish Govt Scholarship)', 'Coverage: Full tuition, monthly stipend (TRY 4K–7K), accommodation, health, travel. Level: UG / Masters / PhD. Field: All subjects. Eligible: All countries. Rolling applications; one of the most comprehensive packages globally.', 'scholarship', 'Republic of Turkey', 'Turkey', '~Feb–Mar annually', 'Good academic record; Eligible countries: All countries', 'https://www.turkiyeburslari.gov.tr', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Stipendium Hungaricum (Hungary)', 'Coverage: Full tuition, monthly stipend (HUF 43K–140K), accommodation, health insurance. Level: UG / Masters / PhD. Field: Most fields. Eligible: ~70+ partner countries. Strong Central/Eastern European option.', 'scholarship', 'Government of Hungary', 'Hungary', '~Jan–Feb annually', 'Varies by country and level; Eligible countries: ~70+ partner countries', 'https://stipendiumhungaricum.hu', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Gates Cambridge Scholarship', 'Coverage: Full cost of study (tuition, fees, living £18K, travel, visa). Level: Masters / PhD. Field: Any subject offered at Cambridge. Eligible: All countries. Top 5% acceptance rate. Leadership + academic excellence.', 'scholarship', 'Gates Foundation', 'United Kingdom (Cambridge)', '~Oct–Dec (US); ~Jan (others)', 'Outstanding academics + leadership; Eligible countries: All countries', 'https://www.gatescambridge.org/apply/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('PTDF Scholarship', 'Coverage: Full tuition, living stipend, book allowance, travel. Level: UG / Postgraduate. Field: Engineering, Geosciences, Management, Law (oil & gas). Eligible: Nigeria. Must commit to work in oil & gas sector after.', 'scholarship', 'Petroleum Technology Development Fund', 'Nigeria / Abroad', 'Mid-year (check PTDF portal)', 'Nigerian citizen; Eligible countries: Nigeria', 'https://ptdf.gov.ng/scholarship/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('NLNG Undergraduate Scholarship', 'Coverage: Full tuition, laptop, book grants, stipend. Level: Undergraduate (100 level ONLY). Field: All courses. Eligible: Nigeria. Must be in first year of a Nigerian university. Renewed annually based on performance.', 'scholarship', 'Nigeria LNG Limited', 'Nigeria', 'Expected Oct–Dec 2026', '100-level Nigerian university student; Eligible countries: Nigeria', 'https://www.nlng.com/scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('NHEF Scholars Program', 'Coverage: Full tuition, laptop, mentorship, internship placement, career support. Level: Undergraduate (penultimate year). Field: All subjects. Eligible: Nigeria. Partnership with top Nigerian and US universities.', 'scholarship', 'Nigeria Higher Education Foundation', 'Nigeria', 'March 13, 2026', 'Penultimate year Nigerian undergraduates; Eligible countries: Nigeria', 'https://nhef.org/scholars-program/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Warwick-GREAT Scholarship (Nigeria)', 'Coverage: £10,000–£15,000 tuition reduction. Level: Masters (taught). Field: All subjects. Eligible: Nigeria. Joint British Council + University of Warwick.', 'scholarship', 'University of Warwick + British Council', 'United Kingdom', 'April 22, 2026', 'Nigerian national; Eligible countries: Nigeria', 'https://warwick.ac.uk/study/international/admissions/scholarships/great-scholarships/', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Hauwa Ojeifo Scholarship (OYW 2026)', 'Coverage: Full ticket to One Young World Summit, travel, accommodation. Level: Women leaders (all levels). Field: Mental health advocacy / women''s rights. Eligible: Africa. Named after Hauwa Ojeifo; focuses on mental health advocates.', 'scholarship', 'Hauwa Ojeifo / One Young World', 'South Africa (Cape Town summit)', 'March 27, 2026', 'Women aged 18–30; mental health advocacy focus; Eligible countries: Africa', 'https://www.oneyoungworld.com/scholarships', true, true);

INSERT INTO opportunities (title, description, type, organization, location, deadline, requirements, application_url, is_active, is_visible)
VALUES ('Italian Government Scholarships 2026–2027', 'Coverage: Tuition waiver, €900–€1,100/mo stipend, health insurance. Level: UG / Masters / PhD / Research. Field: All subjects. Eligible: Selected countries (Africa, Asia, Latin America, Eastern Europe). Apply through Italian embassy.', 'scholarship', 'Italian Ministry of Foreign Affairs (MAECI)', 'Italy', 'Varies; check Italian embassy / MAECI portal', 'Varies by level and country; Eligible countries: Selected countries', 'https://www.esteri.it/en/opportunita/borse-di-studio/per-stranieri/', true, true);