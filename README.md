# Private Equity Target Finder App

This app helps private equity professionals find the top 3 target companies to acquire based on specific investment criteria.

## User Journey

1. **Login**

   - User opens the app.
   - If not already logged in, the user is prompted to "Sign in with ZAPT".
   - User clicks "Sign in with ZAPT" and completes the authentication process using available providers (Google, Facebook, Apple).

2. **Set Investment Criteria**

   - After logging in, the user is presented with a form to enter investment criteria:
     1. **Purchase Price Range**
        - Minimum Purchase Price
        - Maximum Purchase Price
     2. **Location**
        - Text input for preferred location.
     3. **Growth Target Percentage**
        - Numeric input for desired growth target (in percentage).
     4. **Industry**
        - Text input for the industry of interest.

3. **Find Target Companies**

   - User clicks the "Find Target Companies" button.
   - The app displays a loading indicator while processing the request.

4. **View Results**

   - The app displays the top 3 target companies matching the criteria.
   - For each company, the following information is displayed:
     - Company Name
     - Purchase Price
     - Location
     - Expected Growth Percentage
     - Industry

5. **Sign Out**

   - User can sign out of the app by clicking the "Sign Out" button.

## Features

- Responsive and user-friendly interface.
- Secure authentication with Supabase and ZAPT.
- Dynamic search functionality using AI-powered backend.
- Real-time updates and loading indicators for a smooth user experience.