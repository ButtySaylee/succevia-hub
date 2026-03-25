# How to Add Scholarships to Succevia Hub

This guide explains how to add the fully funded scholarship opportunities for Liberian students to your platform.

## Method 1: Using Supabase SQL Editor (Recommended)

1. **Open your Supabase project dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your Succevia Hub project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Copy and paste the SQL**
   - Open the file `scholarships-for-liberians-2026.sql`
   - Copy all the content
   - Paste it into the SQL Editor

4. **Execute the query**
   - Click the "Run" button or press `Ctrl+Enter` (Windows) or `Cmd+Enter` (Mac)
   - You should see a success message: "Successfully added 12 fully funded scholarship opportunities for Liberian students!"

5. **Verify the scholarships were added**
   - Navigate to your Opportunities page: https://succeviahub.vercel.app/opportunities
   - You should see all 12 scholarships listed
   - Or check in Supabase Table Editor → opportunities table

## Method 2: Using Admin Portal (Alternative)

If you prefer to add scholarships one by one through the admin interface:

1. **Access Admin Portal**
   - Go to https://succeviahub.vercel.app/admin-portal
   - Enter your admin password

2. **Add Each Scholarship**
   - Click the "Add Opportunity" button
   - Fill in the details from `scholarships-for-liberians-2026.sql`
   - Upload an image (or use the Unsplash URLs provided)
   - Click "Create Opportunity"

## Scholarships Included

The SQL file adds **12 fully funded scholarships** for Liberian students:

1. **Mastercard Foundation Scholars Program 2026** - Deadline: June 30, 2026
2. **African Union Scholarship Programme** - Deadline: May 15, 2026  
3. **Chevening Scholarships (UK)** - Deadline: November 2, 2026
4. **Commonwealth Master's Scholarships** - Deadline: December 15, 2026
5. **Fulbright Foreign Student Program (USA)** - Deadline: May 31, 2026
6. **Türkiye Scholarships** - Deadline: February 20, 2026
7. **Chinese Government Scholarship (CSC)** - Deadline: April 30, 2026
8. **MEXT Scholarship (Japan)** - Deadline: May 1, 2026
9. **DAAD Scholarships (Germany)** - Deadline: October 31, 2026
10. **ADB-Japan Scholarship Program** - Deadline: August 1, 2026
11. **Australian Awards Scholarships** - Deadline: April 30, 2026
12. **AfDB Scholarship Program** - Deadline: March 31, 2026

## Important Notes

- All scholarships are **fully funded** (tuition, living expenses, travel)
- All are open to **Liberian citizens**
- Deadlines are set for **2026** and haven't passed yet
- Each scholarship includes detailed requirements and application links
- All scholarships are set as **active** by default

## Troubleshooting

**If you get an error:**
- Make sure you have the proper admin permissions
- Check that the `opportunities` table exists in your database
- Verify you're using the correct Supabase project

**If images don't load:**
- The SQL uses placeholder images from placehold.co which are reliable and work without configuration
- If any image doesn't load, you can update the `image_url` in the Supabase table editor with your own image URLs
- You can also upload images to Cloudinary and update the URLs

## Questions?

If you need help executing this SQL file or have any questions, please reach out for assistance.

---

**Created:** March 9, 2026  
**Total Scholarships:** 12  
**All Deadlines:** Active (2026)
