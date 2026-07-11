-- UNICEF Liberia job posting for the Jobs section
-- Execute this in Supabase SQL Editor to add the role to the platform.

INSERT INTO opportunities (
  title,
  description,
  type,
  organization,
  location,
  deadline,
  requirements,
  application_url,
  is_active,
  is_visible
) VALUES (
  'National Child Protection Consultant (Office based with possible travel), 6 months, Monrovia',
  'UNICEF Liberia is seeking a National Child Protection Consultant to strengthen the integration of child protection and GBV prevention and response within WASH sectors. The consultancy is office based with possible travel, based in Monrovia, and runs for 6 months. The assignment focuses on safer WASH environments for children, adolescents, and women across humanitarian-development settings.',
  'job',
  'UNICEF Liberia',
  'Monrovia, Liberia',
  'July 25, 2026',
  'Masters in Child Protection, Gender Studies, Social Work, Public Health, International Development, or related field. Minimum 5 years of child protection and/or GBV programming experience. Proven cross-sectoral experience, preferably in WASH, education, health, or social services. Must be a Liberian national. Fluency in English required.',
  'https://secure.dc7.pageuppeople.com/apply/671/gateway/default.aspx?c=apply&lJobID=594350&lJobSourceTypeID=796&sLanguage=en-us',
  true,
  true
);
